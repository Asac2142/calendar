import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';

import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import { Subscription } from 'rxjs';
import { CityService } from 'src/app/services/city.service';
import { Remainder } from '../model/remainder';
import { RemainderService } from '../services/remainders.service';

@Component({
  selector: 'app-modal-event',
  templateUrl: './modal-event.component.html',
  styleUrls: ['./modal-event.component.scss'],
  providers: [CityService]
})
export class ModalEventComponent implements OnInit, OnDestroy, DoCheck {
  public modalRemainder: {day: string, flag: boolean} = {day: '1', flag: false};
  public date: IMyDateModel = null;
  public color: string;
  public remainder: string;
  public time: string;
  public cities: string [] = [];
  public citySubcription: Subscription
  public selectedCity: string;
  public dateOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd.mm.yyyy'    
  };

  public constructor(private cityService: CityService, private remainderService: RemainderService) {}

  public ngOnInit(): void { 
    this.cityService.getCities().subscribe(cities => {
      for(let city of cities) {
        this.cities.push(city.name);
      }      
    });
  }

  public onDateChanged(event: Event): void {}
  
  public ngDoCheck(): void {
    if (this.remainderService.createRemainder.isCreated) {      
      this.modalRemainder.day = this.remainderService.createRemainder.day;
      this.modalRemainder.flag = this.remainderService.createRemainder.isCreated;
    }
  }

  public onCloseModalRemainder(): void {
    this.remainderService.createRemainder.isCreated = false;
    this.modalRemainder.flag = false;
    this.clearForm();
  }

  public onSaveRemainder(): void {   
    if (this.getRemainder()) {
      this.remainderService.setRemainder(this.getRemainder());
      this.remainderService.onSetRemainderEmitter.next(this.remainderService.remainders);
    } 
    this.onCloseModalRemainder();
  }

  public ngOnDestroy(): void {
    this.citySubcription.unsubscribe();
  }

  private getRemainder(): Remainder {
    return this.date? new Remainder(      
      this.getRemainderDate(), 
      this.modalRemainder.day, 
      this.getRemainderId(this.modalRemainder.day), 
      this.remainder, 
      this.selectedCity, 
      this.time, 
      this.color
    ): null;
  }

  private getRemainderId(day: string): string {
    const remainderQuantity = this.remainderService.filterByScheduledDay(day).length;    
    return `${this.modalRemainder.day}_${(remainderQuantity)}_${this.color}`;
  }

  private getFormmatedDate(): string {
    return this.date? this.date.singleDate.formatted : '';
  }

  private getRemainderDate(): any {
    return { 
      dateRange: null,  
      singleDate: {
        date: {year: +this.getFormmatedDate().split('.')[2], month: +this.getFormmatedDate().split('.')[1], day: +this.getFormmatedDate().split('.')[0]},
        formatted: this.getFormmatedDate()
      }, 
      isRange: false
    };
  }

  private clearForm(): void {
    this.remainder = '';
    this.color = '';
    this.time = '';
    this.selectedCity = '';
    this.date = null;
  }
}

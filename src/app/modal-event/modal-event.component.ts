import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import { CityService } from 'src/app/services/city.service';
import { Remainder } from '../model/remainder';
import { RemainderService } from '../services/remainders.service';
import { WeatherService } from '../services/weather.service';

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
  public remainderDate: any;
  public remainderId: string;
  public remainder: string;
  public time: string;
  public cities: string [] = [];
  public citySubscription: Subscription;
  public weatherSubscription: Subscription;
  public selectedCity: string;
  public weather: string;
  public dateOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd.mm.yyyy'    
  };

  public constructor(private cityService: CityService, 
    private remainderService: RemainderService, 
    private weatherService: WeatherService) {}

  public ngOnInit(): void { 
    this.citySubscription = this.cityService.getCities().subscribe(cities => {
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
    this.citySubscription.unsubscribe();
    this.weatherSubscription.unsubscribe();
  }

  private getRemainder(): Remainder {
    this.remainderDate = this.getRemainderDate();
    this.remainderId = this.getRemainderId(this.modalRemainder.day);

    return this.date? new Remainder(      
      this.remainderDate,
      this.modalRemainder.day, 
      this.remainderId,  
      this.remainder, 
      this.selectedCity, 
      this.time, 
      this.color,
      this.weather
    ): null;
  }

  private getRemainderId(day: string): string {
    const remainderQuantity = this.remainderService.filterByScheduledDay(day).length;  
    this.getWeather();  
    return `_${this.modalRemainder.day}_${(remainderQuantity)}_${this.color}`;
  }

  private getFormmatedDate(): string {
    return this.date? this.date.singleDate.formatted : '';
  }

  private getWeather(): void {
    this.setCityForRemainderWeather();
    this.setDaysForRemainderWeather();
    this.weatherSubscription = this.weatherService.getForecastWeatherByCity().subscribe(data => {     
      this.weather = data.weather[0]['main'];
    });
  }

  private setCityForRemainderWeather(): void {
    this.weatherService.city = this.selectedCity;
  }

  private setDaysForRemainderWeather(): void {
    const days = this.getRemainderDay();
    this.weatherService.days = days > 16 ? 16 : days;
  }

  private getRemainderDay(): number {
    return this.date? +this.date.singleDate.formatted.split('.')[0] : 0;
  }

  private getRemainderDate(): any {
    return { 
      dateRange: null,  
      singleDate: {
        date: {
          year: +this.getFormmatedDate().split('.')[2], 
          month: +this.getFormmatedDate().split('.')[1], 
          day: +this.getFormmatedDate().split('.')[0]
        },
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

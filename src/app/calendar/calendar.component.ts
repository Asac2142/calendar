import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { Remainder } from '../model/remainder';
import { RemainderService } from '../services/remainders.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('row_one') rowOne: ElementRef;
  @ViewChild('row_two') rowTwo: ElementRef;
  @ViewChild('row_three') rowThree: ElementRef;
  @ViewChild('row_four') rowFour: ElementRef;
  @ViewChild('row_five') rowFive: ElementRef;
  @ViewChild('row_six') rowSix: ElementRef;  
  public weekDays: number [] = new Array(7);
  public daysName: string [] = ['Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  public eventsPerDay: Remainder [];
  private calendarDays:number [] = [];
  private remainderMap: Map<string, {}> = new Map();
  private setEvents: Set<any>;
  private remainderSub: Subscription;
  private calendarRows: ElementRef[] = [];
  
  public constructor(private remainderService: RemainderService) {}  

  public ngOnInit(): void {    
    this.remainderSub = this.remainderService.onSetRemainderEmitter.subscribe(data => {
      this.eventsPerDay = data;      
      this.getUniqueCalendarDays();
      this.getCalendarDaysWithIds();
      this.renderRemainderElementOnCalendarComponent();
    });
  }  

  public ngOnDestroy() {
    this.remainderSub.unsubscribe();
  }

  public ngAfterViewInit() {
    this.calendarRows = [this.rowOne, this.rowTwo, this.rowThree, this.rowFour, this.rowFive, this.rowSix];
  }

  public onRemainder(event: any): void {    
    const day = event.target.firstChild.innerText;
    const create = true;
    this.remainderService.setCreateRemainder({dayCreated: day, isCreated: create});
  }

  public onRemainderCreated(event: Event): void {
    console.log(event);
  }

  private getUniqueCalendarDays(): void {
    for (let i = 0; i < this.eventsPerDay.length; i++) {
      this.calendarDays[i] = +(this.eventsPerDay[i].getCalendarDay());  
    }
    this.setEvents = new Set(this.calendarDays);          
  }

  private getCalendarDaysWithIds(): void {    
    for (let value of this.setEvents) {
      const ids = this.eventsPerDay.filter(dayEvent => +dayEvent.getCalendarDay() === value).map((value) => value.getID());
      this.remainderMap.set(value, {ids});
    }
  }

  private renderRemainderElementOnCalendarComponent(): void {   
    let cellDay: number;
    let remainderContent: string;    

    this.remainderMap.forEach((value, key) => {  
      this.calendarRows.map(content => {
        [...content.nativeElement.childNodes].map((val, index) => {
          if (val.firstChild) { 
            cellDay = (+val.firstChild.innerText === +key) ? +val.firstChild.innerText : -1;
            if (cellDay !== -1) {            
              this.removeChilds(content.nativeElement.childNodes[index]);
              for (let i = 0; i < value['ids'].length; i++) {
                remainderContent = this.remainderService.getRemainderContent(value['ids'][i]);                                  
                content.nativeElement.childNodes[index].insertAdjacentHTML(
                  'beforeend', 
                  `<span 
                    id="${value['ids'][i]}" 
                    style="background: ${value['ids'][i].split('_')[2]}; display: block; color: #fff; padding: 0.3rem; font-size: 0.8rem">
                    ${remainderContent}
                  </span>`);
              }
            }
          }
        });
      });      
    });

  }

  private removeChilds(cell: any): any {
    while(cell.childElementCount > 1) {
      cell.lastElementChild.remove();
    }    
  }

}

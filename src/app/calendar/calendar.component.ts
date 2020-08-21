import { Component, ElementRef, OnDestroy, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { Remainder } from '../model/remainder';

import { RemainderService } from '../services/remainders.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  @ViewChild('row_one') rowOne: ElementRef;
  @ViewChild('row_two') rowTwo: ElementRef;
  @ViewChild('row_three') rowThree: ElementRef;
  @ViewChild('row_four') rowFour: ElementRef;
  @ViewChild('row_five') rowFive: ElementRef;
  @ViewChild('row_six') rowSix: ElementRef;  
  private remainderSub: Subscription;
  public weekDays: number [] = new Array(7);
  public daysName: string [] = ['Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  public eventsPerDay: Remainder [];
  calendarDays:number [] = [];
  remainderMap: Map<string, {}> = new Map();
  setEvents: Set<any>;

  public constructor(private remainderService: RemainderService, private render: Renderer2) {}  

  public ngOnInit(): void {
    this.remainderSub = this.remainderService.onSetRemainderEmitter.subscribe(data => {
      this.eventsPerDay = data;
      //console.log([...this.rowTwo.nativeElement.childNodes]);
      // console.log(this.rowTwo.nativeElement.childNodes[0].innerText);
      this.getUniqueCalendarDays();
      this.getCalendarDaysWithIds();
      this.renderRemainderElementOnCalendarComponent();
    });
  }  

  public ngOnDestroy() {
    this.remainderSub.unsubscribe();
  }

  public onRemainder(event: any): void {    
    const day = event.target.firstChild.innerText;
    const create = true;
    this.remainderService.setCreateRemainder({dayCreated: day, isCreated: create});
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
      [...this.rowOne.nativeElement.childNodes].map((val, index) => {
        if (val.firstChild) { 
          cellDay = (+val.firstChild.innerText === +key) ? +val.firstChild.innerText : -1;

          if (cellDay !== -1) {            
            this.removeChilds(this.rowOne.nativeElement.childNodes[index]);
            for (let i = 0; i < value['ids'].length; i++) {
              remainderContent = this.remainderService.getRemainderContent(value['ids'][i]);                                  
              this.rowOne.nativeElement.childNodes[index].insertAdjacentHTML(
                'beforeend', 
                `<span id="${value['ids'][i]}" style="background: ${value['ids'][i].split('_')[2]}">${remainderContent}</span>`
              );
            }
          }
        }
      });
    });
  }

  private removeChilds(cell: any): any {
    while(cell.childElementCount > 1) {
      cell.lastElementChild.remove();
    }    
  }

}

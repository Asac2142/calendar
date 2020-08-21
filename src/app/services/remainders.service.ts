import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Remainder } from '../model/remainder';

@Injectable({
    providedIn: 'root'
})
export class RemainderService {
    public remainders: Remainder[] = [];
    public createRemainder: {day: string, isCreated: boolean} = {day: '1', isCreated: false};
    public onSetRemainderEmitter = new Subject<Remainder[]>();

    public setCreateRemainder(remainder: {dayCreated: string, isCreated: boolean }): void {
        this.createRemainder.day = remainder.dayCreated;
        this.createRemainder.isCreated = remainder.isCreated;
    }    

    public setRemainder(remainder: Remainder): void {
        this.remainders.push(remainder);        
    }

    public getRemainder(scheduledDay: string, id: string): {} {        
        return this.searchRemainder(scheduledDay, id);
    }

    public filterByScheduledDay(day: string): any {
        return this.remainders.filter(d => d.getCalendarDay() === day);
    }

    public getRemainderContent(id: string): string {
        return this.remainders.filter(remainder => remainder.getID() === id)[0].getContent();
    }

    private searchRemainder(day: string, id: string) : {} {        
        const searchedDay = this.filterByScheduledDay(day);
        return searchedDay ? searchedDay.filter(i => i.getID() === id) : {};        
    }    
}

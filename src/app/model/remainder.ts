export class Remainder {
    public constructor(
        private dateOfRemainder: {
            dateRange: string,
            singleDate: {
                formatted: string,
                date: {
                    year: number,
                    month: number,
                    day: number
                }            
            },
            isRange: boolean
        },
        private calendarDay: string,  
        private id: string,
        private content: string,
        private city: string,
        private time: string,
        private color: string,
        private weather: string){};
        

    public getCalendarDay(): string {
        return this.calendarDay;
    }

    public getID(): string {
        return this.id;
    }

    public getColor(): string {
        return this.color;
    }

    public getContent(): string {
        return this.content;
    }

    public getWeather(): string {
        return this.weather;
    }
}

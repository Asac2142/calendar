import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ModalEventComponent } from './modal-event/modal-event.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { ColorPickerModule } from 'ngx-color-picker';
import { RemainderService } from './services/remainders.service';
import { WeatherService } from './services/weather.service';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    ModalEventComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularMyDatePickerModule,
    HttpClientModule,
    ColorPickerModule
  ],
  providers: [RemainderService, WeatherService],
  bootstrap: [AppComponent]
})
export class AppModule { }

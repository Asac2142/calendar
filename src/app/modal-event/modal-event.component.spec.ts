import { Remainder } from '../model/remainder';
import { ModalEventComponent } from "./modal-event.component";

describe('ModalEventComponent', () => {
  const fakeRemainderService: any = jasmine.createSpyObj('remainderService', ['setRemainder', 'filterByScheduledDay']);
  const fakeWeatherService: any = jasmine.createSpyObj('weatherService', ['getForecastWeatherByCity']);
  const fakeCityService: any = jasmine.createSpyObj('citiyService', ['getCities']);
  
  fakeRemainderService.setRemainder();
  fakeRemainderService.remainders = []
  fakeRemainderService.filterByScheduledDay();
  const remainderObject = new Remainder(      
    {
      dateRange: null, 
      isRange: false, 
      singleDate: {
        date: {
          year: 2200,
          month: 8,
          day: 7
        },
        formatted: '07.08.2200'
      }
    }, '7', '_7_1_#ccc', 'Lunch at office', 'Ecuador', '12:31', '#ccc', 'Rain');
  
  it('should allow to save a remainder', () => {    
    const modalRemainder = new ModalEventComponent(fakeCityService, fakeRemainderService, fakeWeatherService);
    
    modalRemainder.remainderDate = { 
      dateRange: null,  
      singleDate: {
        date: {
          year: 2200, 
          month: 8, 
          day: 7,
          formatted: '07.08.2200'
        }
      }, 
      isRange: false
    };
    modalRemainder.modalRemainder.day = '7';
    modalRemainder.remainderId = '_7_1_#ccc';
    modalRemainder.remainder = 'Lunch at office';
    modalRemainder.selectedCity = 'Ecuador';
    modalRemainder.time = '12:31';
    modalRemainder.color = '#ccc';
    modalRemainder.weather = 'Rain';

    
    fakeRemainderService.remainders.push(remainderObject);

    modalRemainder.onSaveRemainder();

    expect(fakeRemainderService.setRemainder()).toHaveBeenCalled();
  });
});

import { Component, OnInit, Input} from '@angular/core';
import { Booking } from '../../../booking/shared/booking.model';


@Component({
  selector: 'app-rental-detail-booking',
  templateUrl: './rental-detail-booking.component.html',
  styleUrls: ['./rental-detail-booking.component.scss']
})
export class RentalDetailBookingComponent implements OnInit {

  @Input() price: number;
  @Input() bookings: Booking[];


  public daterange: any = {};

  public options: any = {
    locale: { format: 'YYYY-MM-DD'},
    alwaysShowCalendars: false,
    //displayFormat: 'DD-MM-YYYY'
  };

  constructor() { }

  ngOnInit() {
    
    this.bookings.forEach((booking) => {
      console.log(booking);
    })

  }
  
  private getBookedOutDates() {
    
  }
 
  

  public selectedDate(value: any, datepicker?: any) {
      
      console.log(value);

      datepicker.start = value.start;
      datepicker.end = value.end;

      this.daterange.start = value.start;
      this.daterange.end = value.end;
      this.daterange.label = value.label;
  }
}

import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router'; // pour acceder à :id

import { RentalService } from '../shared/rental.service';

import { Rental } from '../shared/rental.model';
 

@Component({
  selector: 'app-rental-detail',
  templateUrl: './rental-detail.component.html',
  styleUrls: ['./rental-detail.component.scss']
})
export class RentalDetailComponent implements OnInit {

  currentId: string;

  rental: Rental;

  constructor(private route: ActivatedRoute, // pour recuperer params
              private rentalService: RentalService) { }

  ngOnInit() {
    this.rental = new Rental();

    this.route.params.subscribe((params) => { // acces à :id par url
      this.getRental(params['rentalID']);

    })
  }

  getRental(rentalId: string) {
    this.rentalService.getRentalById(rentalId).subscribe((rental: Rental) => {
      this.rental = rental;
    })
  }

}

import { Component } from '@angular/core';
import { UserService } from '../../services/users.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  constructor (private userServices: UserService, private spinner: NgxSpinnerService) {}

  cities:[]= [];
  selectedCities: any
  ngOnInit(): void {
    // this.spinner.show();
    this.userServices.getPeopleData(1).subscribe((dat)=>{
      console.log(dat)
    })

    const ddd: any = 'Luke' && 'r2';
    this.userServices.searchPeople(ddd).subscribe((dat)=>{
      console.log(dat)
    })
  }
}

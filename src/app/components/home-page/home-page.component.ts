import { Component } from '@angular/core';
import { UserService } from 'src/app/services/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  constructor (private userServices: UserService, private spinner: NgxSpinnerService, private router: Router) {}
  private endPoints:string[] = ['people', 'films', 'species']

  public peopleDataResponse:any[] = [];
  public speciesResponse:[] = [];
  public filmsResponse:[] = [];

  public selectedMovies: any[] = [];
  public selectSpecies: any[] = [];
  public selectedBirthYear: any;

  public subscriptions: Subscription[] = [];
  
  totalRecords: number = 82;
  recordsPerPage: number = 10;
  currentPage: number = 1;
  totalPages!: number;
  selectedEndYear = '';
  selectedStartYear = '';

  public filteredPeopleDataResponse: any[] = []; // To hold filtered characters
  ngOnInit() {
    // this.spinner.show();
    this.fetchAllData(1);

  }
  fetchAllData( pageNum: number): void {
    const apiCalls = this.endPoints.map(endpoint => 
      this.userServices.getAPIResponseData(endpoint, pageNum)
    );

    forkJoin(apiCalls).subscribe(
      {
        next: (results) => {
          this.peopleDataResponse = results[0]?.results;
          this.filteredPeopleDataResponse = [...this.peopleDataResponse];
          this.filmsResponse = results[1]?.results;
          this.speciesResponse = results[2]?.results;
        },
        error: (error) =>{
          console.log(error);
        }
      }
    );
  }

  formatDateOfBirth(birthYear: any): any {
    const isBBY = birthYear?.birth_year.endsWith('BBY');
    const year = parseInt(birthYear?.birth_year.split(' ')[0]);
    return isBBY ? -year : year;
  }
  
  
  changePage(page: number) {
    this.totalPages = Math.ceil(this.totalRecords / this.recordsPerPage);
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.fetchAllData(page);
  }
  applyFilters(): void {
    this.filteredPeopleDataResponse = this.peopleDataResponse.filter(person => 
      this.filterByMovie(person) &&
      this.filterBySpecies(person) &&
      this.filterByBirthYear(person)
    );
    
  }

  filterByMovie(person: any): boolean {
    if (!this.selectedMovies || this.selectedMovies.length === 0) return true;
  
    return this.selectedMovies.some((movieTitle: string) => {
      const movie: any = this.filmsResponse.find((film: any) => film.title === movieTitle);
      return person.films.includes(movie?.url);
    });
  }
  
  filterBySpecies(person: any): boolean {
    if (!this.selectSpecies || this.selectSpecies.length === 0) return true;
  
    return this.selectSpecies.some((speciesName: string) => {
      const species: any = this.speciesResponse.find((spec: any) => spec.name === speciesName);
      return person.species.includes(species?.url);
    });
  }
  
  filterByBirthYear(person: any): boolean {
    const personBirthYear = this.convertBirthYear(person.birth_year);
    const startYear = this.convertBirthYear(this.selectedStartYear);
    const endYear = this.convertBirthYear(this.selectedEndYear);
  
    if (isNaN(startYear) || isNaN(endYear)) return true;
    return personBirthYear >= startYear && personBirthYear <= endYear;
  }
  convertBirthYear(birthYear: string): number {
    if (birthYear.includes('BBY')) {
      return -parseInt(birthYear.replace('BBY', '').trim());
    } else if (birthYear.includes('ABY')) {
      return parseInt(birthYear.replace('ABY', '').trim());
    }
    return 0;
  }

  navigateToDetailsPage(i: number) {
    this.router.navigate(['character',i])
  }

}

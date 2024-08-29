import { Component } from '@angular/core';
import { UserService } from 'src/app/services/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, of, Observable, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  constructor (private userServices: UserService, private spinner: NgxSpinnerService) {}
  private endPoints:string[] = ['people', 'films', 'starships', 'vehicles', 'species', 'planets']

  public peopleDataResponse:any[] = [];
  public starShipsResponse:[] = [];
  public vehicleResponse:[] = [];
  public speciesResponse:[] = [];
  public planetResponse:[] = [];
  public filmsResponse:[] = [];

  public selectedMovies: any;
  public selectSpecies: any;
  public selectedVehicles: any;
  public selectedStarShips: any;
  public selectedBirthYear: any;

  public subscriptions: Subscription[] = [];
  
  totalRecords: number = 82;
  recordsPerPage: number = 10;
  currentPage: number = 1;
  totalPages!: number;

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
          this.starShipsResponse = results[2]?.results;
          this.vehicleResponse = results[3]?.results;
          this.speciesResponse = results[4]?.results;
          this.planetResponse = results[5]?.results;
          // this.applyFilters();
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
      this.filteredPeopleDataResponse = this.peopleDataResponse.filter(person => {
         this.filterByMovie(person) &&
               this.filterBySpecies(person) &&
               this.filterByVehicle(person) &&
               this.filterByStarship(person) &&
               this.filterByBirthYear(person);
      });
    }
  
    filterByMovie(person: any) {
      if (this.selectedMovies.length === 0) return true;else 
      return this.selectedMovies.some((movie: any) => person.films.includes(movie.url));
    }
  
    filterBySpecies(person: any) {
      if (this.selectSpecies.length === 0) return true;
      return this.selectSpecies.some((species: any) => person.species.includes(species.url));
    }
  
    filterByVehicle(person: any) {
      if (this.selectedVehicles.length === 0) return true;
      return this.selectedVehicles.some((vehicle: any) => person.vehicles.includes(vehicle.url));
    }
  
    filterByStarship(person: any) {
      if (this.selectedStarShips.length === 0) return true;
      return this.selectedStarShips.some((starship: any) => person.starships.includes(starship.url));
    }
  
    filterByBirthYear(person: any) {
      if (this.selectedBirthYear.length === 0) return true;
      return this.selectedBirthYear.includes(person.birth_year);
    }
  
    // applyFilters(filter: boolean): void {
    //   if (filter) {
    //     let filteredPeople = this.peopleDataResponse;
    
    //   // Filter by selected movies
    //   if (this.selectedMovies?.length) {
    //     filteredPeople = filteredPeople.filter(person => 
    //       this.filmsResponse.some((film: any) => 
    //         this.selectedMovies.includes(film.title) &&
    //         film.characters.includes(person.url)
    //       )
    //     );
    //   }
    
    //   // Filter by selected species
    //   if (this.selectSpecies?.length) {
    //     filteredPeople = filteredPeople.filter((person: any) => 
    //       person.species.some((speciesUrl: any) => 
    //         this.speciesResponse.some((species: any) => 
    //           this.selectSpecies.includes(species.name) && species.url === speciesUrl
    //         )
    //       )
    //     );
    //   }
    
    //   // Filter by selected vehicles
    //   if (this.selectedVehicles?.length) {
    //     filteredPeople = filteredPeople.filter(person => 
    //       person.vehicles.some((vehicleUrl: any) => 
    //         this.vehicleResponse.some((vehicle: any) => 
    //           this.selectedVehicles.includes(vehicle.name) && vehicle.url === vehicleUrl
    //         )
    //       )
    //     );
    //   }
    
    //   // Filter by selected starships
    //   if (this.selectedStarShips?.length) {
    //     filteredPeople = filteredPeople.filter(person => 
    //       person.starships.some((starshipUrl: any) => 
    //         this.starShipsResponse.some((starship: any) => 
    //           this.selectedStarShips.includes(starship.name) && starship.url === starshipUrl
    //         )
    //       )
    //     );
    //   }
    
    //   // Filter by birth year range
    //   if (this.selectedBirthYear?.length) {
    //     filteredPeople = filteredPeople.filter(person => {
    //       const birthYear = this.formatDateOfBirth(person);
    //       const [startYear, endYear] = this.selectedBirthYear.map(this.formatDateOfBirth);
    //       return birthYear >= startYear && birthYear <= endYear;
    //     });
    //   }
    
    //   this.peopleDataResponse = filteredPeople;
    //   }
    // }
    // applyFilters() {
    //   this.filteredPeopleData = this.peopleDataResponse.filter(character => {
    //     const matchesMovies = this.selectedMovies.length === 0 || this.selectedMovies.some((movie: any) =>
    //       movie.characters.includes(character.url)
    //     );
  
    //     const matchesSpecies = this.selectSpecies.length === 0 || this.selectSpecies.some((species: any) =>
    //       character.species.includes(species.url)
    //     );
  
    //     const matchesVehicles = this.selectedVehicles.length === 0 || this.selectedVehicles.some((vehicle: any) =>
    //       character.vehicles.includes(vehicle.url)
    //     );
  
    //     const matchesStarShips = this.selectedStarShips.length === 0 || this.selectedStarShips.some((starship: any) =>
    //       character.starships.includes(starship.url)
    //     );
  
    //     const matchesBirthYear = this.selectedBirthYear.length === 0 || this.selectedBirthYear.includes(this.formatDateOfBirth(character));
  
    //     return matchesMovies && matchesSpecies && matchesVehicles && matchesStarShips && matchesBirthYear;
    //   });
    // }

    // applyFilters() {
    //   let filteredData = this.peopleDataResponse;
  
    //   // Filter by selected movies
    //   if (this.selectedMovies.length > 0) {
    //     filteredData = filteredData.filter(character =>
    //       character.films.some((filmUrl: any) => 
    //         this.selectedMovies.includes(this.filmsResponse.find((film: any) => film.url === filmUrl)?.title)
    //       )
    //     );
    //   }
  
    //   // Filter by selected species
    //   if (this.selectSpecies.length > 0) {
    //     filteredData = filteredData.filter(character =>
    //       this.selectSpecies.includes(this.speciesResponse.find((species: any) => species.url === character.species[0])?.name)
    //     );
    //   }
  
    //   // Filter by selected birth year
    //   if (this.selectedBirthYear.length > 0) {
    //     filteredData = filteredData.filter(character => {
    //       const birthYear = this.formatDateOfBirth(character);
    //       return this.selectedBirthYear.some((range: any) => 
    //         birthYear >= range.startYear && birthYear <= range.endYear
    //       );
    //     });
    //   }
  
    //   this.peopleDataResponse = filteredData;
    // }



  // Method to update filters
  // updateFilters(): void {
  //   this.filteredPeopleData = this.peopleDataResponse.filter(character => 
  //     this.filterByMovie(character) &&
  //     this.filterBySpecies(character) &&
  //     this.filterByVehicle(character) &&
  //     this.filterByBirthYear(character)
  //   );
  // }

  // // Filter by selected movies
  // private filterByMovie(character: any): boolean {
  //   if (!this.selectedMovies || this.selectedMovies.length === 0) {
  //     return true; // No movie filter selected, include all
  //   }
  //   // Check if character is in any of the selected movies
  //   console.log(character.films.some((filmUrl: any) => this.selectedMovies.includes(filmUrl)))
  //   return character.films.some((filmUrl: any) => this.selectedMovies.includes(filmUrl));
  // }

  // // Filter by selected species
  // private filterBySpecies(character: any): boolean {
  //   if (!this.selectSpecies || this.selectSpecies.length === 0) {
  //     return true; // No species filter selected, include all
  //   }
  //   // Check if character's species matches any selected species
  //   return character.species.some((speciesUrl: any) => this.selectSpecies.includes(speciesUrl));
  // }

  // // Filter by selected vehicles
  // private filterByVehicle(character: any): boolean {
  //   if (!this.selectedVehicles || this.selectedVehicles.length === 0) {
  //     return true; // No vehicle filter selected, include all
  //   }
  //   // Check if character has any of the selected vehicles
  //   return character.vehicles.some((vehicleUrl: any) => this.selectedVehicles.includes(vehicleUrl));
  // }

  // // Filter by selected birth year range
  // private filterByBirthYear(character: any): boolean {
  //   if (!this.selectedBirthYear || this.selectedBirthYear.length === 0) {
  //     return true; // No birth year filter selected, include all
  //   }
  //   const characterBirthYear = this.formatDateOfBirth(character.birth_year);
  //   // Check if character's birth year falls within the selected range
  //   const [minYear, maxYear] = this.selectedBirthYear;
  //   return characterBirthYear >= minYear && characterBirthYear <= maxYear;
  // }
}

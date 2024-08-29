import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/users.service';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent {

  character: any;
  films: any[] = [];
  speciesName: string = '';
  starships: any[] = [];

  constructor(private route: ActivatedRoute, private starWarsService: UserService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.starWarsService.getCharacterDetails(`https://swapi.dev/api/people/${id}/`).subscribe((data: any) => {
      this.character = data;
      this.fetchAdditionalDetails();
    });
  }

  fetchAdditionalDetails(): void {
    if (this.character.species.length) {
      this.starWarsService.getResource(this.character.species[0]).subscribe((species: any) => {
        this.speciesName = species.name;
      });
    }

    this.character.films.forEach((filmUrl: string) => {
      this.starWarsService.getResource(filmUrl).subscribe((film: any) => {
        this.films.push(film.title);
      });
    });

    this.character.starships.forEach((starshipUrl: string) => {
      this.starWarsService.getResource(starshipUrl).subscribe((starship: any) => {
        this.starships.push(starship.name);
      });
    });
  }

}

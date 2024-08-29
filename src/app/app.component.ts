import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'insuredmine-assignment';
  onFiltersChanged(filters: any) {
    // Pass filters to the character list component
  }
}

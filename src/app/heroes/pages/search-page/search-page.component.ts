import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent {
  public searchInput = new FormControl('');
  public heroes: Hero[] = [];

  constructor(private heroService: HeroesService) { }

  searchHero() {
    const value: string = this.searchInput.value || '';
    this.heroService.getSuggestions(value).subscribe((heroes) => {
      this.heroes = heroes;
      console.log({ heroes })
    });
  }
}

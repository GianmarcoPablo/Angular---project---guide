import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private baseUrl: string = environments.baseUrl

  constructor(private http: HttpClient) { }


  public getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`);
  }

  public getHeroById(id: string): Observable<Hero | undefined> {
    return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`).pipe(
      catchError((error) => of(undefined))
    )
  }

  public getSuggestions(term: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes?q=${term}&_limit=6`);
  }

  public addHero(hero: Hero): Observable<Hero> {
    console.log('Hero', hero)
    return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero);
  }

  public updateHero(hero: Hero): Observable<Hero> {
    if (!hero.id) throw new Error('The hero must have an id');
    return this.http.put<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero);
  }

  public deleteHeroById(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/heroes/${id}`).pipe(
      catchError((error) => of(false)),
      map(() => true)
    )
  }


}

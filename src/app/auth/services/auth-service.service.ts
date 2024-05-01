import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/enviroments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private baseUrl = environments.baseUrl;
  private user?: User;

  constructor(
    private readonly http: HttpClient
  ) { }

  get currentUser(): User | undefined {
    if (!this.user) return undefined
    return structuredClone(this.user) // esto tambien se podria hacer con un spread operator
  }

  login(email: string, password: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/1`).pipe(
      tap(user => this.user = user),
      tap(user => localStorage.setItem('token', JSON.stringify(user.id)))
    )
  }

  checkAuthentication(): Observable<boolean> {
    const token = localStorage.getItem('token')
    if (!token) return of(false)

    return this.http.get<User>(`${this.baseUrl}/users/1`).pipe(
      tap(user => this.user = user),
      map(user => !!user), // !!user es lo mismo que user ? true : false
      catchError(() => of(false))
    )
  }

  logout() {
    this.user = undefined
    localStorage.clear()
  }
}

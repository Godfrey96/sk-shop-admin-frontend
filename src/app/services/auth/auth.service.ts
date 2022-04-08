import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment.prod';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiURLUsers = environment.apiURL + 'users'
  private currentUserSource: BehaviorSubject<any>;
  public currentUser$!: Observable<User>;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private router: Router,
  ) {
    this.currentUserSource = new BehaviorSubject<User>(JSON.parse(this.localStorageService.getToken()));
    // this.currentUserSource = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.currentUser$ = this.currentUserSource.asObservable();
  }

  public get userValue(): User {
    return this.currentUserSource.value;
  }

  loginUser(email: string, password: string) {
    return this.http.post<User>(`${this.apiURLUsers}/login`, { email, password }).pipe(
      map((user: any) => {
        // this.localStorageService.setToken(JSON.stringify(user.token));
        this.localStorageService.setToken(JSON.stringify(user));
        this.currentUserSource.next(user);
        return user;
      })
    );
  }

  logout() {
    this.localStorageService.removeToken();
    this.currentUserSource.next(null);
    this.router.navigate(['/login']);
  }

}

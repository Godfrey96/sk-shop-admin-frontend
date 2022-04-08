import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiURLUsers = environment.apiURL + 'users';

  constructor(
    private http: HttpClient,
  ) { }

  // get all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiURLUsers);
  }

  // get single user
  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiURLUsers}/${userId}`);
  }

  // add new user
  createUser(user: User): Observable<User> {
    return this.http.post(this.apiURLUsers + '/register', user);
  }

  // update existing user
  updateUser(user: User, userId: string): Observable<User> {
    return this.http.put<User>(`${this.apiURLUsers}/${userId}`, user);
  }

  // delete user
  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURLUsers}/${userId}`);
  }

  // get users count
  getUsersCount(): Observable<number> {
    return this.http.get<number>(`${this.apiURLUsers}/get/count`).pipe(
      map((objectValue: any) => objectValue.userCount)
    );
  }

}

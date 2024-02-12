import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IUser, IUsersResponseDto } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  private readonly _users = new Subject<Map<string, IUser>>(); //
  readonly users$ = this._users.asObservable();

  public async loadUsers(): Promise<void> {
    try {
      const usersLocalStorage = await localStorage.getItem('users');
      if (usersLocalStorage) {
        this._users.next(new Map(JSON.parse(usersLocalStorage)));
        return;
      }
      this.getUsersApi();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  private getUsersApi(): void {
    this.http.get("https://randomuser.me/api/?page=1&results=50").subscribe(response => {

      const usersResponse = response as IUsersResponseDto;
      const users: Map<string, IUser> = new Map();

      usersResponse.results.forEach(obj => {
        users.set(obj.login.uuid, obj);
      });

      this._users.next(users);
      localStorage.setItem('users', JSON.stringify(Array.from(users.entries())));

    }, (error) => {
      console.error('Error fetching data:', error);
    });
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interface/user.interface';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public user : User | any;
  public user$ = new BehaviorSubject<User | any>({});

  constructor() { }

  public setUser(user: User) {
    this.user = user;
    this.user$.next(user);
    // Thông báo vs những subscription thay đổi giá trị total mới
  }

  public deleteUserName() {
    this.user = {
      username: ''
    };
    this.user$.next(this.user);
  }
}

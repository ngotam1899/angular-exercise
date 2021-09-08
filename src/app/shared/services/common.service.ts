import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interface/user.interface';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public userName : string = "";
  public userName$ = new BehaviorSubject<string>("");

  constructor() { }

  public setUserName(userName: string) {
    this.userName = userName;
    this.userName$.next(userName);
    // Thông báo vs những subscription thay đổi giá trị total mới
  }

  public deleteUserName() {
    this.userName = "";
    this.userName$.next(this.userName);
  }
}

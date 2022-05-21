import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Signup, Login } from '../../shared/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  constructor(private http: HttpClient) {}

  /**
   * It takes a body of type Signup and returns an Observable of type any
   * @param {Signup} body - Signup
   * @returns Observable&lt;any&gt;
   */
  singup(body: Signup): Observable<any> {
    return this.http.post('/user/signup', body);
  }

  /**
   * This function takes a Login object as a parameter and returns an Observable of any type.
   * @param {Login} body - Login
   * @returns Observable&lt;any&gt;
   */
  login(body: Login): Observable<any> {
    return this.http.post('/user/login', body);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginJwt } from 'src/app/types/login.type';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private router: Router,
    private httpClient: HttpClient
  ) {
    this.checkJwt();
  }

  checkJwt() {
    let jwt = new URLSearchParams(window.location.search).get('jwt');

    if(jwt)
      this.setJwt(jwt);

    if(!this.getJwt())
      this.router.navigate(['/401']);
    else
      this.getLoginJwt();
  }

  getJwt(): string | null {
    return localStorage.getItem('schwering_app_jwt');
  }

  setJwt(jwt: string) {
    localStorage.setItem('schwering_app_jwt', jwt);
  }

  resetJwt() {
    localStorage.removeItem('schwering_app_jwt');
    this.router.navigate(['/401']);
  }

  getLoginJwt(): Observable<LoginJwt> {
    return this.httpClient.get<LoginJwt>(`api/login`); 
  }
  
}

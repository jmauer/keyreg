import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string = 'https://keyreg.arfidex.de';
  private apiKey: string = ''
  private username: string = ''
  private role: string = ''
  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService,) { }

  get(endpoint: string): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    if (this.isLoggedIn()) {
      var header = {
        headers: new HttpHeaders()
          .set('Authorization', this.apiKey)
      }

      return this.http.get(url, header);
    } else {
      return this.http.get(url);
    }
  }

  post(endpoint: string, data: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    //const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': sessionStorage.getItem('cooler_cookie_name') ? sessionStorage.getItem('cooler_cookie_name') : '' }); // Setze den Content-Type auf application/json
    
    if (this.isLoggedIn()) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': this.apiKey,
        })
      };
      return this.http.post(url, data, httpOptions);
    } else {
      return this.http.post(url, data);
    }

  }

  public authGuard(): boolean {
    if (this.cookieService.get('cooler_cookie_name')) {
      this.setApiKey(this.cookieService.get('cooler_cookie_name'))
    }

    if (this.cookieService.get('coole_rolle')) {
      this.setRole(this.cookieService.get('coole_rolle'))
    }


    //Wenn Token vorhanden und gültig => weiter
    if (this.apiKey && this.apiKey !== "") {
      if (this.role == 'admin') {
        return true
      } else {
        this.router.navigate(['/auth/access']);
      return false;
      }
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
    // return true
  }

  public userGotRights(): boolean {
    if (this.cookieService.get('coole_rolle')) {
      this.setRole(this.cookieService.get('coole_rolle'))
    }
    if (this.role && this.role !== "") {
      if (this.role != "admin") {

        return false
      } else {

        return true
      }
    } else {
      return false
    }
  } 

  public setDsgvo(email: string) {

    const payload = {
      EMail: email,
      Status: 1
    };
    
    this.post("setDsgvoStatus", payload).subscribe((response: any) => {

    })
  }

  public getDsgvo(): boolean {

    var readDsgvo: boolean = false

    this.get("getOwnDsgvoStatus")
    .subscribe(
      (response: any) => {

        if (response.DSGVO_Accepted == 1) {
          readDsgvo = true
        } else {
          readDsgvo = false
        }
    })

    return readDsgvo
  }

  public setApiKey(key: string) {
    this.apiKey = key
  }

  public setRole(role: string) {

    this.role = role
  }

  public setUsername(username: string) {
    this.username = username
  }

  public getUsername() {
    return this.username
  }

  public isLoggedIn() {
    return this.apiKey !== ''
  }
}

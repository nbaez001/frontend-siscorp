import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  get headers(): HttpHeaders {
    return new HttpHeaders({Authorization: 'Basic ' + btoa(environment.basicAuthorization)});
  }

  login(body: RequestAuth): Observable<any> {
    const bodyFormData = new FormData();
    bodyFormData.set('username', body.username);
    bodyFormData.set('password', body.password);
    bodyFormData.set('grant_type', 'password');

    return this.http.post( `${environment.backendUrl}/oauth/token`, bodyFormData, { headers: this.headers, reportProgress: true });
  }

}

interface RequestAuth {
  username: string;
  password: string;
}

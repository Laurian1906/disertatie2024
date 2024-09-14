import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MakeHttpRequestService {

  // private apiUrl = 'http://localhost:3001/api';

  // constructor(private http: HttpClient) {}

  // getGameData(): Observable<any>{
  //   return this.http.get<any>(`${this.apiUrl}/game-data`)
  // }
}

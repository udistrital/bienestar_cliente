import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable()
export class ApiRestService {
  private url = 'https://sibud-891d.restdb.io/rest/documentos';
  private apiKey = '63f78ad9478852088da685a6';

  constructor(private http: HttpClient) { }

  get():Observable<any> {
    const headers = new HttpHeaders({
      'cache-control': 'no-cache',
      'x-apikey': this.apiKey,
    });
    const options = { headers: headers };

    return this.http.get(this.url, options);
  
    
    /* .subscribe((res) => {
      // alert(JSON.stringify(response));
      console.log(res);
      return res;
    }); */
  }

  post(body){

    const headers = new HttpHeaders({
      'cache-control': 'no-cache',
      'x-apikey': this.apiKey,
      'content-type': 'application/json'
    });
    const options = { headers: headers };

    this.http.post(this.url, body, options).subscribe((res) => {
      // alert(JSON.stringify(response));
      console.log('POST correcto: ' + JSON.stringify(res));
      
    },(error) => {
      console.log('Error en POST: ' + JSON.stringify(error));
    });
  }
  
}
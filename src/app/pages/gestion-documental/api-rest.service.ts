import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable()
export class ApiRestService {
  // private url = 'https://sibud-891d.restdb.io/rest/documentos';
  private url = 'https://sibud-60bb.restdb.io/rest/documentos'; 
  private apiKey = '640659e5bc22d22cf7b25c71';

  private headers = new HttpHeaders({
    'cache-control': 'no-cache',
    'x-apikey': this.apiKey,
  });
  private options = { headers: this.headers };
  
  constructor(private http: HttpClient) {   }


  get():Observable<any> {

    return this.http.get(this.url, this.options);
  }

   post(body):Observable<any>{
    this.headers=new HttpHeaders({
      'cache-control': 'no-cache',
      'x-apikey': this.apiKey,
      'content-type': 'application/json',
    });
    this.options = { headers: this.headers };
    let post= this.http.post(this.url, body, this.options)
    post.subscribe(  res => {
      console.log('POST correcto: ' + JSON.stringify(res));
    },(error) => {
      console.log('Error en POST: ' + JSON.stringify(error));
    });
    return post;
  }

  update(body, id){
    this.headers=new HttpHeaders({
      'cache-control': 'no-cache',
      'x-apikey': this.apiKey,
      'content-type': 'application/json',
    });
    this.options = { headers: this.headers };
    let url=this.url+'/'+id;
    this.http.put(url, body, this.options).subscribe((res) => {
      console.log('PUT correcto: ' + JSON.stringify(res));
    },(error) => {
      console.log('Error en PUT: ' + JSON.stringify(error));
    });
  }

  delete(id){
    this.headers=new HttpHeaders({
      'cache-control': 'no-cache',
      'x-apikey': this.apiKey,
      'content-type': 'application/json',
    });
    this.options = { headers: this.headers };
    let url=this.url+'/'+id;
    this.http.delete(url, this.options).subscribe((res) => {
      console.log('DELETE correcto: ' + JSON.stringify(res));
    },(error) => {
      console.log('Error en DELETE: ' + JSON.stringify(error));
    });
  }
}
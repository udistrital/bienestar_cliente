import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ActividadCulturalService {

    url = environment.CULTURA;
    urlDocumentos = environment.GESTOR_DOCUMENTAL;
    query = '?query=';
    
    constructor(private httpClient: HttpClient) { }

}
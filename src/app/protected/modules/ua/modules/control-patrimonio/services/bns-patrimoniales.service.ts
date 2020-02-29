import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WsApiOutResponse } from 'app/protected/modules/ups/modules/expediente/dto/response/WsApiOutResponse';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { FiltroDenominacionRequest } from '../dto/request/filtro-denominacion.request';

@Injectable({
  providedIn: 'root'
})
export class BnsPatrimonialesService {

  constructor(private http: HttpClient) { }

  filtrarDenominacion(req: FiltroDenominacionRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUA}/bienesPatrimoniales/filtrarDenominacion`, req);
  }
}

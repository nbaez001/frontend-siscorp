import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';


@Injectable()
export class ControlCombustibleService {
  httpHeaders: HttpHeaders;
  constructor(private http: HttpClient, private datePipe: DatePipe) { }

  public getPdfModelo(params: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post('http://perficon.elnazarenovraem.edu.pe/api/dashboard/get-file', params,
      { headers, responseType: 'blob' as 'json' }
    );
  }

  public crearBlobFile(data: any): Blob {
    const byteCharacters = atob(data.archivo);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: data.contentType });
    const resultBlob: any = blob;
    resultBlob.lastModifiedDate = new Date();
    resultBlob.name = data.nomArchivo;

    return blob;
  }
}
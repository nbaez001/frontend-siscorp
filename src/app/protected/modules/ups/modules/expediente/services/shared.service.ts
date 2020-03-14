import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private cantidad = new BehaviorSubject<any>("");
  set_cantidad = this.cantidad.asObservable();

  constructor() { }

  EnviarCantidad(data: any) {
    this.cantidad.next(data)
  }
}

import { Injectable } from '@angular/core';
import { environment as env } from 'environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Menu } from './../entities/menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  dataChange = new BehaviorSubject<Menu[]>([]);

  pageIndex = 1;
  pageSize = 10;
  total = 0;

  get data(): Menu[] { return this.dataChange.value; }

  constructor(
    private http: HttpClient
  ) {
    this.getMenus('mnu.main').subscribe(({ total, lista }) => {
      this.dataChange.next(

        lista.map((m: Menu) => {
          m.nivel = 0;
          return m;
        })

      );
    });
  }

  getMenus(padre: string): Observable<any> {
    return this.http
      .get<any>(`${env.backendUrl}/api/menuHijos?nombrePadre=${padre}&nroDePagina=${this.pageIndex}&registrosPorPagina=${this.pageSize}`);
  }

  createMenu(menu: Menu): Observable<void> {
    return this.http.post<void>(`${env.backendUrl}/menus/crear`, menu);
  }

  editarMenu(menu: Menu): Observable<void> {
    return this.http.put<void>(`${env.backendUrl}/menus/actualizar`, menu);
  }

  deleteMenu(idMenu: number): Observable<void> {
    return this.http.delete<void>(`${env.backendUrl}/menus/eliminar/${idMenu}`);
  }

  loadHijos(parent: Menu, nivel: number) {
    this.getMenus(parent.id_menu_hijo).subscribe(({ totalRegistros, lista }) => {

      parent.hijos = lista.map((m: Menu) => {
        m.nivel = nivel;
        return m;
      });

      parent.cantidad_hijos = totalRegistros;
      this.reloadData();
    });
  }

  reloadData() {
    this.dataChange.next(this.data);
  }
}

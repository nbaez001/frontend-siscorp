import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BandejaComponent } from './components/bandeja/bandeja.component';
import { PantallaComponent } from './components/pantalla/pantalla.component';
import { GestionModulosComponent } from './components/gestion-modulos/gestion-modulos.component';

const routes: Routes = [
  { path: '', component: BandejaComponent },
  { path: 'pantalla-estados', component: PantallaComponent },
  { path: 'gestion-modulos', component: GestionModulosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketsIntervencionesRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RevisorComponent } from './components/revisor/revisor.component';
import { AuthRouting } from '@shared/auth/auth-routing';
import { CronogramaValorizadoComponent } from './components/revisor/cronograma-valorizado/cronograma-valorizado.component';
import { AutorizacionComponent } from './components/revisor/cronograma-valorizado/autorizacion/autorizacion.component';
import { TrabajadorComponent } from './components/revisor/trabajador/trabajador.component';
import { ProveedorComponent } from './components/revisor/proveedor/proveedor.component';
import { RequerimientoComponent } from './components/revisor/requerimiento/requerimiento.component';
import { SupervisorComponent } from './components/supervisor/supervisor.component';
import { CoordinadorRtComponent } from './components/coordinador-rt/coordinador-rt.component';
import { DatosGeneralesComponent } from './components/revisor/datos-generales/datos-generales.component';
import { CoordinadorCgpComponent } from './components/coordinador-cgp/coordinador-cgp.component';
import { BandejaPendienteComponent } from './components/revisor/bandeja-pendiente/bandeja-pendiente.component';

const routes: Routes = [
  {
    path: 'bandeja-residente',
    component: RevisorComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'cronograma-valorizado',
    component: CronogramaValorizadoComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'datos-generales',
    component: DatosGeneralesComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'autorizacion',
    component: AutorizacionComponent

  },
  {
    path: 'bandeja-trabajador',
    component: TrabajadorComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'bandeja-proveedor',
    component: ProveedorComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'requerimiento',
    component: RequerimientoComponent

  },
  {
    path: 'bandeja-supervisor',
    component: SupervisorComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'bandeja-crp',
    component: CoordinadorRtComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'bandeja-cgp',
    component: CoordinadorCgpComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'bandeja-pendiente',
    component: BandejaPendienteComponent,
    canActivate: [AuthRouting]
  }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class AutorizacionGastoRoutingModule { }

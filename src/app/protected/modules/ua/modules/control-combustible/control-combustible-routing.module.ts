import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BdjVehiculosComponent } from './components/bdj-vehiculos/bdj-vehiculos.component';
import { BdjGrpElectrogenoComponent } from './components/bdj-grp-electrogeno/bdj-grp-electrogeno.component';
import { BdjDeslizadoresComponent } from './components/bdj-deslizadores/bdj-deslizadores.component';
import { BdjCtrlKilometrajeComponent } from './components/bdj-ctrl-kilometraje/bdj-ctrl-kilometraje.component';
import { BdjHrsGrpElectrogenoComponent } from './components/bdj-hrs-grp-electrogeno/bdj-hrs-grp-electrogeno.component';
import { BdjHrsDeslizadorComponent } from './components/bdj-hrs-deslizador/bdj-hrs-deslizador.component';
import { BdjReqBienesComponent } from './components/bdj-req-bienes/bdj-req-bienes.component';
import { BdjSolMantenimientoComponent } from './components/bdj-sol-mantenimiento/bdj-sol-mantenimiento.component';
import { BdjReqServiciosComponent } from './components/bdj-req-servicios/bdj-req-servicios.component';
import { CuadroCtrlPresupuestalComponent } from './components/cuadro-ctrl-presupuestal/cuadro-ctrl-presupuestal.component';
import { CuadroCtrlDetalladoComponent } from './components/cuadro-ctrl-detallado/cuadro-ctrl-detallado.component';
import { BdjBancosComponent } from './components/config/bdj-bancos/bdj-bancos.component';
import { BdjProveedoresComponent } from './components/config/bdj-proveedores/bdj-proveedores.component';
import { BdjOrdCompraComponent } from './components/config/bdj-ord-compra/bdj-ord-compra.component';
import { BdjOrdServicioComponent } from './components/config/bdj-ord-servicio/bdj-ord-servicio.component';
import { BdjFondoEcgComponent } from './components/config/bdj-fondo-ecg/bdj-fondo-ecg.component';
import { BdjAsigPresupuestalComponent } from './components/bdj-asig-presupuestal/bdj-asig-presupuestal.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'bdj-vehiculos',
        pathMatch: 'full'
      }, {
        path: 'bdj-vehiculos',
        component: BdjVehiculosComponent,
        data: { title: 'Bandeja vehiculos' }
      }, {
        path: 'bdj-grupo-electrogeno',
        component: BdjGrpElectrogenoComponent,
        data: { title: 'Bandeja grupo electrogeno' }
      }, {
        path: 'bdj-deslizadores',
        component: BdjDeslizadoresComponent,
        data: { title: 'Bandeja deslizadores' }
      }, {
        path: 'bdj-ctrl-kilometraje',
        component: BdjCtrlKilometrajeComponent,
        data: { title: 'Bandeja control kilometraje' }
      }, {
        path: 'bdj-hrs-grp-electrogeno',
        component: BdjHrsGrpElectrogenoComponent,
        data: { title: 'Bandeja horas grupo electrogeno' }
      }, {
        path: 'bdj-hrs-deslizador',
        component: BdjHrsDeslizadorComponent,
        data: { title: 'Bandeja horas deslizador' }
      }, {
        path: 'bdj-req-bienes',
        component: BdjReqBienesComponent,
        data: { title: 'Bandeja requerimiento combustible' }
      }, {
        path: 'bdj-req-servicios',
        component: BdjReqServiciosComponent,
        data: { title: 'Bandeja requerimiento de mantenimiento' }
      }, {
        path: 'bdj-sol-mantenimiento',
        component: BdjSolMantenimientoComponent,
        data: { title: 'Bandeja solicitud de mantenimiento' }
      }, {
        path: 'cuadro-control-detallado',
        component: CuadroCtrlDetalladoComponent,
        data: { title: 'Cuadro control detallado' }
      }, {
        path: 'cuadro-control',
        component: CuadroCtrlPresupuestalComponent,
        data: { title: 'Cuadro control general' }

        // }, {
        //   //   path: 'avance-econ-presupuestal',
        //   //   component: BdjEjecPresupuestalComponent,
        //   //   data: { title: 'Bandeja ejecucion economico presupuestal' }

      }, {
        path: 'config/bdj-bancos',
        component: BdjBancosComponent,
        data: { title: 'Bandeja bancos' }
      }, {
        path: 'config/bdj-proveedores',
        component: BdjProveedoresComponent,
        data: { title: 'Bandeja proveedores' }
      }, {
        path: 'config/bdj-ord-compra',
        component: BdjOrdCompraComponent,
        data: { title: 'Bandeja orden compra' }
      }, {
        path: 'config/bdj-ord-servicio',
        component: BdjOrdServicioComponent,
        data: { title: 'Bandeja orden servicio' }
      }, {
        path: 'config/bdj-fd-encargo',
        component: BdjFondoEcgComponent,
        data: { title: 'Bandeja fondo encargo' }
      }, {
        path: 'config/asig-presupuestal',
        component: BdjAsigPresupuestalComponent,
        data: { title: 'Bandeja asignacion presupuestal' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlCombustibleRoutingModule { }

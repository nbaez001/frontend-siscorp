import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BandejaResidenteComponent } from './components/bandeja-residente/bandeja-residente.component';
import { AuthRouting } from '@shared/auth/auth-routing';
import { ComprobantesComponent } from './components/bandeja-residente/comprobantes/comprobantes.component';
import { InformePreliquidacionComponent } from './components/bandeja-residente/informe-preliquidacion/informe-preliquidacion.component';
import { ValorizacionAvanceComponent } from './components/bandeja-residente/valorizacion-avance/valorizacion-avance.component';
import { ResumenMovimientoAlmacenComponent } from './components/bandeja-residente/resumen-movimiento-almacen/resumen-movimiento-almacen.component';
import { RegistrarComprobanteComponent } from './components/bandeja-residente/registrar-comprobante/registrar-comprobante.component';

const routes: Routes = [
  {
    path: 'bandeja-residente',
    component: BandejaResidenteComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'comprobante',
    component: ComprobantesComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'informe-preliquidacion',
    component: InformePreliquidacionComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'valorizacion-avance',
    component: ValorizacionAvanceComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'resumen-mov-almacen',
    component: ResumenMovimientoAlmacenComponent,
    canActivate: [AuthRouting]
  }
  ,
  {
    path: 'registrar-comprobante',
    component: RegistrarComprobanteComponent,
    canActivate: [AuthRouting]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreLiquidacionRoutingModule { }

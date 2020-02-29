import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AltaBienesComponent } from './components/alta-bienes/alta-bienes.component';
import { BdjBnsSobrantesComponent } from './components/bdj-bns-sobrantes/bdj-bns-sobrantes.component';
import { BdjBnsPatrimonialesComponent } from './components/bdj-bns-patrimoniales/bdj-bns-patrimoniales.component';
import { BdjBajaBienesComponent } from './components/bdj-baja-bienes/bdj-baja-bienes.component';
import { BdjAsigBienesComponent } from './components/bdj-asig-bienes/bdj-asig-bienes.component';
import { BdjEtrgRcpBienesComponent } from './components/bdj-etrg-rcp-bienes/bdj-etrg-rcp-bienes.component';
import { BdjReportBienesComponent } from './components/bdj-report-bienes/bdj-report-bienes.component';
import { BdjAutorizSldaRtnoComponent } from './components/bdj-autoriz-slda-rtno/bdj-autoriz-slda-rtno.component';

const routes: Routes = [
  {
    path: 'bdj-alta-bienes',
    component: AltaBienesComponent
  }, {
    path: 'bdj-bienes-sobrantes',
    component: BdjBnsSobrantesComponent
  }, {
    path: 'bdj-bienes-patrimoniales',
    component: BdjBnsPatrimonialesComponent
  }, {
    path: 'bdj-baja-bienes',
    component: BdjBajaBienesComponent
  }, {
    path: 'bdj-asig-bienes',
    component: BdjAsigBienesComponent
  }, {
    path: 'bdj-despl-bienes',
    component: BdjAutorizSldaRtnoComponent
  }, {
    path: 'bdj-etrg-rcp-bienes',
    component: BdjEtrgRcpBienesComponent
  }, {
    path: 'bdj-report-bienes',
    component: BdjReportBienesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlPatrimonioRoutingModule { }

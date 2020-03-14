import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'control-patrimonio',
    loadChildren: './modules/control-patrimonio/control-patrimonio.module#ControlPatrimonioModule'
  },
  {
    path: 'control-combustible',
    loadChildren: './modules/control-combustible/control-combustible.module#ControlCombustibleModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UaRoutingModule { }

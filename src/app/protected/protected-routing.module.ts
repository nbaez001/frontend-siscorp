import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProtectedComponent } from './protected.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthRouting } from '@shared/auth/auth-routing';

const routes: Routes = [
  {
    path: '',
    component: ProtectedComponent,
    children: [
      {
        path: 'principal',
        children: [
          { path: 'inicio', component: HomeComponent, canActivate: [AuthRouting] },
          // EXAMPLE MORE BASE PAGES
          // { path: 'change-password', component: ChangePasswordComponent },
        ]
      },
      {
        path: 'seguridad',
        loadChildren: './modules/security/security.module#SecurityModule'
      },
      {
        path: 'tickets-intervenciones',
        loadChildren: './modules/tickets-intervenciones/tickets-intervenciones.module#TicketsIntervencionesModule'
      },
      {
        path: 'ups',
        loadChildren: './modules/ups/ups.module#UpsModule'
      },
      {
        path: 'ua',
        loadChildren: './modules/ua/ua.module#UaModule'
      },
      {
        path: 'uti',
        loadChildren: './modules/uti/uti.module#UtiModule'
      },
      {
        path: 'factibilidad-proyecto',
        loadChildren: './modules/ups-project-feasibility/ups-project-feasibility.module#UpsProjectFeasibilityModule'
      },
      {
        path: 'chat',
        loadChildren: './modules/chat/chat.module#ChatModule'
      },
      {
        path: 'uaj',
        loadChildren: './modules/uaj/uaj.module#UajModule'
      },
      {
        path: 'inicio',
        loadChildren: './modules/inicio/inicio.module#InicioModule'
      },
      { path: '', redirectTo: 'principal/inicio', pathMatch: 'full' }
    ],
  },
  { path: '404', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }

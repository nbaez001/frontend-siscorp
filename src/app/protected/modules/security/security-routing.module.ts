import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthRouting } from '@shared/auth/auth-routing';
import { MenuComponent } from './components/menu/menu.component';
import { AplicacionesComponent } from './components/aplicaciones/aplicaciones.component';
import { PerfilesComponent } from './components/perfiles/perfiles.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

const routes: Routes = [
  {
    path: 'menus',
    component: MenuComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'aplicaciones',
    component: AplicacionesComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'perfiles',
    component: PerfilesComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [AuthRouting]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }

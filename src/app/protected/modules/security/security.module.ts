import { NgModule } from '@angular/core';
import { SecurityRoutingModule } from './security-routing.module';
import { SharedModule } from '@shared/shared.module';
import { MenuComponent } from './components/menu/menu.component';
import { MenuService } from './services/menu.service';
import { MenuFormComponent } from './components/menu/menu-form/menu-form.component';
import { AplicacionesComponent } from './components/aplicaciones/aplicaciones.component';
import { PerfilUsuariosComponent } from './components/perfil-usuarios/perfil-usuarios.component';
import { PerfilMenusComponent } from './components/perfil-menus/perfil-menus.component';
import { PerfilesComponent } from './components/perfiles/perfiles.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { AplicacionService } from './services/aplicacion.service';
import { AuthModule } from '@shared/auth/auth.module';
import { AplicacionFormComponent } from './components/aplicaciones/aplicacion-form/aplicacion-form.component';
import { ModuloService } from './services/modulo.service';
import { ModuloFormComponent } from './components/aplicaciones/modulo-form/modulo-form.component';
import { PerfilModuloService } from './services/perfil-modulo.service';
import { PerfilModuloFormComponent } from './components/aplicaciones/perfil-modulo-form/perfil-modulo-form.component';
import { UsuarioPerfilModuloService } from './services/usuario-perfil-modulo.service';

@NgModule({
  declarations: [
    MenuComponent,
    MenuFormComponent,
    AplicacionesComponent,
    PerfilUsuariosComponent,
    PerfilMenusComponent,
    PerfilesComponent,
    UsuariosComponent,
    AplicacionFormComponent,
    ModuloFormComponent,
    PerfilModuloFormComponent
  ],
  entryComponents: [
    AplicacionFormComponent,
    ModuloFormComponent,
    MenuFormComponent,
    PerfilModuloFormComponent,
    PerfilUsuariosComponent,
    PerfilMenusComponent
  ],
  imports: [
    SecurityRoutingModule,
    AuthModule.forRoot(),
    SharedModule
  ],
  providers: [
    AplicacionService,
    ModuloService,
    PerfilModuloService,
    UsuarioPerfilModuloService,
    MenuService
  ]
})
export class SecurityModule { }

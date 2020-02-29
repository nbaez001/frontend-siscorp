import { NgModule } from '@angular/core';

import { TicketsIntervencionesRoutingModule } from './tickets-intervenciones-routing.module';
import { SharedModule } from '@shared/shared.module';
import { SocketIoModule } from 'ng-socket-io';
import { BandejaComponent } from './components/bandeja/bandeja.component';
import { DetalleComponent } from './components/bandeja/detalle/detalle.component';
import { RegistroAtencionComponent } from './components/registro-atencion/registro-atencion.component';
import { IntervencionService } from './services/intervencion.service';
import { EstadoIntervencionPipe } from './pipes/estado-intervencion.pipe';
import { environment } from 'environments/environment';
import { PantallaComponent } from './components/pantalla/pantalla.component';
import { GestionModulosComponent } from './components/gestion-modulos/gestion-modulos.component';
import { GestionModulosService } from './services/gestion-modulos.service';
import { ModuloRegistrarComponent } from './components/gestion-modulos/modulo-registrar/modulo-registrar.component';
import { EntidadComponent } from './components/gestion-modulos/modulo-registrar/entidad/entidad.component';
import { EncargadoComponent } from './components/gestion-modulos/modulo-registrar/encargado/encargado.component';
import { AuthModule } from '@shared/auth/auth.module';

@NgModule({
  declarations: [
    BandejaComponent,
    DetalleComponent,
    RegistroAtencionComponent,
    EstadoIntervencionPipe,
    PantallaComponent,
    GestionModulosComponent,
    ModuloRegistrarComponent,
    EntidadComponent,
    EncargadoComponent
  ],
  entryComponents: [
    RegistroAtencionComponent,
    DetalleComponent,
    ModuloRegistrarComponent
  ],
  imports: [
    SharedModule,
    AuthModule.forRoot(),
    SocketIoModule.forRoot({url: environment.serverWebSocket}),
    TicketsIntervencionesRoutingModule
  ],
  providers: [
    IntervencionService,
    GestionModulosService
  ]
})
export class TicketsIntervencionesModule { }

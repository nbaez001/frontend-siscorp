import { NgModule } from '@angular/core';
import { ProtectedComponent } from './protected.component';
import { ProtectedRoutingModule } from './protected-routing.module';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { AuthService } from './services/auth.service';
import { environment } from 'environments/environment';
import { ChatService } from './modules/chat/services/chat.service';
import { SocketIoModule } from 'ng-socket-io';
import { LockComponent } from './modules/chat/components/lock/lock.component';
import {
  MatFormFieldModule,
  MatInputModule,
  MatCardModule,
  MatSidenavModule,
  MatButtonModule,
  MatTreeModule,
  MatIconModule,
  MatTooltipModule,
  MatMenuModule,
  MatDialogModule,
  MatProgressBarModule,
  MatToolbarModule
} from '@angular/material';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from '@shared/auth/auth.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { LoadingModule } from '@shared/loading/loading.module';
import { AlertaErrorCargaComponent } from './components/alerta-error-carga/alerta-error-carga.component';

@NgModule({
  declarations: [
    ProtectedComponent,
    NotFoundComponent,
    HomeComponent,
    NavbarComponent,
    ToolbarComponent,
    // TODO: POR REFACTORIZAR
    LockComponent,
    AlertaErrorCargaComponent,
  ],
  imports: [
    ProtectedRoutingModule,
    CommonModule,
    HttpClientModule,
    SocketIoModule.forRoot({url: environment.serverWebSocket}),
    AuthModule.forRoot(),
    LoadingModule.forRoot(),

    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSidenavModule,
    MatButtonModule,
    MatTreeModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatToolbarModule
  ],
  providers: [
    AuthService,
    ChatService
  ],
  entryComponents: [
    LockComponent,
    AlertaErrorCargaComponent
  ]
})
export class ProtectedModule { }

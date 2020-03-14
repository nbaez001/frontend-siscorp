import { NgModule } from '@angular/core';
import { PublicComponent } from './public.component';
import { PublicRoutingModule } from './public-routing.module';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { AuthService } from './services/auth.service';
import { CaptchaComponent } from './components/sign-in/captcha/captcha.component';
import { SocketIoModule } from 'ng-socket-io';
import { environment } from 'environments/environment';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressBarModule } from '@angular/material';
import { PipeModule } from '@shared/pipes/pipe.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from '@shared/auth/auth.module';
import { LoadingModule } from '@shared/loading/loading.module';

@NgModule({
  declarations: [
    PublicComponent,
    SignInComponent,
    CaptchaComponent
  ],
  imports: [
    PublicRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    PipeModule,
    HttpClientModule,
    SocketIoModule.forRoot({url: environment.serverWebSocket}),
    AuthModule.forRoot(),
    LoadingModule.forRoot(),

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  providers: [
    AuthService,
  ]
})
export class PublicModule { }

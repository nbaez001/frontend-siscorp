import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routing, AuthRouting, DsAuthRouting } from './auth-routing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth-interceptor';
import { MatSnackBarModule } from '@angular/material';

@NgModule({
  imports: [
    MatSnackBarModule
  ],
  providers: [
    Routing,
    AuthRouting,
    DsAuthRouting
  ]
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        }
      ]
    };
  }
}

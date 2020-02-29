import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiUrlInterceptor } from './api-url-interceptor';

@NgModule({
  imports: [
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiUrlInterceptor,
      multi: true
    },
    {
      provide: 'apiUrl',
      useValue: ''
    }
  ]
})
export class ApiUrlModule { }

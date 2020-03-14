import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './loading-interceptor';
import { LoadingService } from './loading.service';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { MatDialogModule } from '@angular/material';
import { LoadingComponent } from './loading.component';

@NgModule({
  declarations: [
    LoadingComponent
  ],
  imports: [
    MatDialogModule
  ],
  providers: [
    LoadingService,
    /*{
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }*/
  ],
  entryComponents: [
    LoadingComponent
  ]
})
export class LoadingModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LoadingModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoadingInterceptor,
          multi: true
        }
      ]
    };
  }
}

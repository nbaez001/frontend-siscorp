import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicComponent } from './public.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { DsAuthRouting } from '@shared/auth/auth-routing';

const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    children: [
      { path: 'iniciar-sesion', component: SignInComponent, canActivate: [DsAuthRouting] },
      // EXAMPLE MORE BASE PAGES
      // { path: 'recover-password', component: RecoverPasswordComponent },
      // { path: 'reset-password', component: ResetPasswordComponent },
    ],
  },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }

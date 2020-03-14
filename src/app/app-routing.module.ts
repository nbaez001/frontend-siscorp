import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'anonimo',
    loadChildren: './public/public.module#PublicModule'
  },
  {
    path: '',
    loadChildren: './protected/protected.module#ProtectedModule'
  },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

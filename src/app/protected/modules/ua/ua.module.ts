import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UaRoutingModule } from './ua-routing.module';
import { UaCommonService } from './services/ua-common.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UaRoutingModule
  ],
  providers: [
    UaCommonService,
  ]
})
export class UaModule {

  // constructor(@Inject(UaCommonService) private uaCommonService: UaCommonService) {
  //   console.log('INGRESO A CONSTRUCTOR DE UA MODULE');
  //   if (!PerfilUA.exist()) {
  //     let req = new PerfilUsuarioModuloRequest();
  //     req.idModulo = MODULOS_SISCORP.UA.MODULOS.CONTROL_COMBUSTIBLE.id;
  //     req.idUsuario = +Session.identity.id_usuario;

  //     this.uaCommonService.listarPerfilUsuarioModulo(req).subscribe(
  //       (data: WsApiOutResponse) => {
  //         if (data.codResultado == 1) {
  //           PerfilUA.start(data.response[0]);
  //           console.log('PERFIL:');
  //           console.log(data.response[0]);
  //         } else {
  //           console.log(data.msgResultado);
  //         }
  //       }, error => {
  //         console.log('Error al obtener perfil de usuario');
  //         console.log(error);
  //       });
  //   }
  // }



}

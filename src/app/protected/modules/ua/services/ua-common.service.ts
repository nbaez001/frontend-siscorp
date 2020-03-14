import { Injectable } from '@angular/core';
import { Session } from '@shared/auth/Session';
import { MODULOS_SISCORP } from 'app/common';

@Injectable({
  providedIn: 'root'
})
export class UaCommonService {

  constructor() { }

  accesoMCP(perfil): boolean {//METODO QUE RETORNA TRUE SI EL ID_PERFIL ENVIADO ES IGUAL AL ID DE USUARIO (UTILIZADO PARA MOSTRAR BOTONES)
    if (Session.identity.lista_perfil_modulo) {
      let perfilModulo = Session.identity.lista_perfil_modulo.filter(el => el.idModulo == MODULOS_SISCORP.UA.MODULOS.CONTROL_PATRIMONIO.id)[0];
      if (perfilModulo) {
        if (perfilModulo.idPerfil == perfil.idCodigo) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  getIdPerfilMCP(): number {//RETORNA EL ID DEL USUARIO DEL MODULO DE CONTROL PATRIMONIAL
    if (Session.identity.lista_perfil_modulo) {
      return Session.identity.lista_perfil_modulo.filter(el => el.idModulo == MODULOS_SISCORP.UA.MODULOS.CONTROL_PATRIMONIO.id)[0].idPerfil;
    } else {
      return 0;
    }
  }
}

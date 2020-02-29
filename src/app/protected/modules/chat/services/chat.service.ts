import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { PushNotificationOptions, PushNotificationService } from 'ngx-push-notifications';
import { Session } from '@shared/auth/Session';
import { Socket } from 'ng-socket-io';
import { Mensaje } from '../entities/mensaje';

@Injectable()
export class ChatService {

  contacts: any[];
  chats: any[];
  user: any;
  onChatSelected = new BehaviorSubject<any>(null);
  listadoConversacionRefresh = new Subject<any[]>();
  listadoContactoRefresh = new Subject<any[]>();
  private conversacionEliminada = new BehaviorSubject<any>('');
  setConversacionEliminada = this.conversacionEliminada.asObservable();

  HOST: string = environment.backendUrlProj;
  HOST_NODE: string = environment.serverWebSocket;

  constructor(private http: HttpClient,
    // private _pushNotificationService: PushNotificationService
  ) {
  }

  conectarWebsocket() {
    const socket = new SockJS(`${this.HOST}/websocket`);
    const stompClient = Stomp.over(socket);
    return stompClient;
  }

  enviarConversacionEliminada(data: any) {
    return this.conversacionEliminada.next(data);
  }

  obtenerUltimaConversacion(idConversacion: string, tipoChat: number, nombreChat: string, color: string) {
    return this.http.get<any>(`${this.HOST}/appChat/obtenerIdUltimaConversacion?idConversacion=${idConversacion}&tipoChat=${tipoChat}&nombreChat=${nombreChat}&color=${color}`);
  }

  obtenerChatDesdeContacto(idContacto: string, tipoChat: number, nombreChat: string, color: string, nuevoGrupo: number) {
    let cadena = (tipoChat === 0) ? (Session.identity.id_usuario.toString() + ',' + idContacto) : (Session.identity.id_usuario.toString() + ',' + idContacto);

    return new Promise((resolve, reject) => {
      this.obtenerUltimaConversacion(cadena, tipoChat, nombreChat, color).subscribe(response => {
        if (tipoChat === 1) { idContacto = idContacto.substr(0, idContacto.indexOf(",")); }

        this.http.get(`${this.HOST}/appChat/listarConversacion?idConversacion=${response}&idContacto=${idContacto}&tipoChat=${tipoChat}`).subscribe((response: any) => {
          const chatData = {
            chatId: response.id,
            dialog: response.dialog,
            contact: response.contact,
            typeChat: response.typeChat,
            nuevoGrupo: nuevoGrupo,
            administrator: response.administrator
          };

          this.onChatSelected.next({ ...chatData });
        }, reject);
        resolve();
      });
    });

  }

  enviarNuevoMensaje(mensaje: Mensaje) {
    return new Promise((resolve, reject) => {
      this.insertarMensaje(mensaje).subscribe(res => {
        resolve();
      });
    });
  }

  insertarMensaje(mensaje: Mensaje) {
    return this.http.post(`${this.HOST}/appChat/insercionMensaje`, mensaje);
  }

  listadoConversacion() {
    return this.http.get<any>(`${this.HOST}/appChat/listadoConversacion`);
  }

  listadoRefreshConversacionInicioSession(idSender: number) {
    return this.http.get<any>(`${this.HOST}/appChat/busquedaExistenciaConversacionInicioSesion?idSender=${idSender}`).subscribe(response => {
      if (+response != 0) {
        this.listadoConversacion().subscribe(data => {
          this.listadoConversacionRefresh.next(data);
        });
      }
    });
  }

  listadoRefreshConversacion(idConversacion: number) {
    return this.http.get<any>(`${this.HOST}/appChat/busquedaExistenciaConversacion?idConversacion=${idConversacion}`).subscribe(response => {
      if (+response == 1) {
        this.listadoConversacion().subscribe(data => {
          this.listadoConversacionRefresh.next(data);
        });
      }
    });
  }

  listadoContacto(nombre: string, idPlataforma: number, idPuesto: number) {
    return this.http.get<any[]>(`${this.HOST}/appChat/listarUsuario?nombre=${nombre}&idPlataforma=${idPlataforma}&idPuesto=${idPuesto}`)
  }

  listadoRefreshContacto(nombre: string, idPlataforma: number, idPuesto: number) {
    this.listadoContacto(nombre, idPlataforma, idPuesto).subscribe(data => {
      this.listadoContactoRefresh.next(data);
    });
  }

  obtenerChatDesdeConversaciones(idConversacion: number, idContacto: string, tipochat: number) {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.HOST}/appChat/listarConversacion?idConversacion=${idConversacion}&idContacto=${idContacto}&tipoChat=${tipochat}`)
        .subscribe((response: any) => {
          const chatData = {
            chatId: response.id,
            dialog: response.dialog,
            contact: response.contact,
            typeChat: response.typeChat,
            administrator: response.administrator
          };
          this.onChatSelected.next(chatData);
        }, reject);
      resolve();
    });

  }

  listarDialogo(idConversacion: number) {
    return this.http.get<any>(`${this.HOST}/appChat/listarDialogo?idConversacion=${idConversacion}`);
  }

  obtenerParticipanteGrupo(idConversacion: number) {
    return this.http.get<any>(`${this.HOST}/appChat/listarParticipanteGrupo?idConversacion=${idConversacion}`);

  }

  insertaFlagConversacionEliminada(idConversacion: number) {
    return this.http.get(`${this.HOST}/appChat/eliminarConversacion?idConversacion=${idConversacion}`);
  }

  marcarConversacionComoEliminada(idConversacion: number) {
    return new Promise((resolve, reject) => {
      this.insertaFlagConversacionEliminada(idConversacion).subscribe(res => {
        resolve();
      });
    });
  }

  obtenerDatosContacto(idContacto: number) {
    return this.http.get<any>(`${this.HOST}/appChat/obtenerDatosContacto?idContacto=${idContacto}`);
  }

  listaPlataforma() {
    return this.http.get<any[]>(`${this.HOST}/appChat/listaPlataforma`)
  }

  listaPuesto() {
    return this.http.get<any[]>(`${this.HOST}/appChat/listaPuesto`)
  }

  insertaIdUsuarioIdSocket(socket: string) {
    return this.http.get<any>(`${this.HOST}/appChat/insertaIdUsuarioIdSocket?cidSocket=${socket}`)
      .subscribe(response => {
        if (response.response === 1)// solo si tiene sesion en otra maquina
        { this.enviarCidSocketChannel(response.cidsocket, 'sesionIniciada'); }
        this.sesionSocket('sesionSocket', Session.identity.id_usuario);
      });
  }

  sesionSocket(channel: string, data: number) {
    const body = `{"channel":"${channel}","data":"${data}"}`;
    this.http.post(`${this.HOST_NODE}/execute-channel`, JSON.parse(body), { responseType: 'text' }).subscribe(() => { });
  }

  enviarCidSocketChannel(socket: string, channel: string, data?: any) {
    const body = `{"socket":"${socket}","channel":"${channel}","data":"${data}"}`;
    this.http.post(`${this.HOST_NODE}/send-to-socket`, JSON.parse(body), { responseType: 'text' }).subscribe(() => { });
  }

  cerrarSesionSocket(idUsuario: number) {
    return this.http.get(`${this.HOST}/appChat/CerrarSesionSocket`)
      .subscribe(() => {
        //idUsuario en este caso el id del usuario que se va desconectar
        this.sesionSocket('sesionSocket', idUsuario);
      });
  }

  obtenerCidSocketUsuario(idConversacion: number) {
    return this.http.get<any[]>(`${this.HOST}/appChat/obtenerCidSocketUsuario?idConversacion=${idConversacion}`)
  }

  /*mostrarNotificacion(cantidad: string) {
    this._pushNotificationService.requestPermission();
    const title = 'Chat PN PAIS';
    const options = new PushNotificationOptions();
    options.body = `${cantidad} mensajes pendientes`;
    options.icon = 'assets/images/avatars/chat.png';

    this._pushNotificationService.create(title, options).subscribe((notif) => {
      if (notif.event.type === 'show') {
        setTimeout(() => {
          notif.notification.close();
        }, 4000);
      }
      if (notif.event.type === 'click') {
        notif.notification.close();
      }
      if (notif.event.type === 'close') {
      }
    },
      (err) => {
        console.log(err);
      });
  }*/
  
}
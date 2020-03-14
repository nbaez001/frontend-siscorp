import { Component, OnInit, AfterViewInit, ViewChildren, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ChatService } from './../../../services/chat.service';
import { FusePerfectScrollbarDirective } from './../../../directives/fuse-perfect-scrollbar.directive';
import { Session } from '@shared/auth/Session';
import { MatDialogRef, MatDialog } from '@angular/material';
import { DetailGroupComponent } from './detail-group/detail-group.component';
import { ChatDeleteComponent } from './chat-delete/chat-delete.component';
import { Router } from '@angular/router';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';
import { Subscription } from 'rxjs';
import { Socket } from 'ng-socket-io';
import { Mensaje } from '../../../entities/mensaje';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() mostrandoSidenav2 = new EventEmitter();

  subscriptor: Subscription;
  socketSubscription: Subscription;

  user: any;
  chat: any;
  dialog: any;
  contact: any;
  replyInput: any;
  typeChat: any;
  nuevoGrupo: any;
  usuarioID: number = +Session.identity.id_usuario;
  chatID: number;
  administrator: number;
  mensaje: Mensaje = new Mensaje();

  @ViewChild(FusePerfectScrollbarDirective) directiveScroll: FusePerfectScrollbarDirective;
  @ViewChildren('replyInput') replyInputField;
  @ViewChild('replyForm') replyForm: NgForm;

  private stompClient;

  constructor(private chatService: ChatService,
    private modal: MatDialog, private router: Router, private socket: Socket) {
  }

  ngOnInit() {
    this.user = this.chatService.user;
    this.subscriptor = this.chatService.onChatSelected.subscribe(chatData => {
      if (chatData) {
        this.chatID = chatData.chatId;
        this.contact = chatData.contact;
        this.dialog = chatData.dialog;
        this.typeChat = chatData.typeChat;
        this.nuevoGrupo = chatData.nuevoGrupo;
        this.administrator = chatData.administrator;
        this.readyToReply();
      }
      // this.readyToReply();
      if (this.stompClient != null && this.stompClient.connected) {
        this.stompClient.disconnect();
      }
      this.connect();
      this.stompClient.debug = null;
    })

    this.socketSubscription = this.socket.fromEvent('sesionSocket').subscribe(() => {
      if (Session.identity.id_usuario) {
        this.chatService.obtenerDatosContacto(this.contact.id).subscribe(response => {
          this.contact = response;
        });
      }
    });

  }

  connect() {
    this.stompClient = this.chatService.conectarWebsocket();
    const _this = this;
    this.stompClient.connect({}, (frame) => {
      const roomId = _this.chatID;
      const recargaList = 'reloaded';
      if (_this.stompClient != null && _this.stompClient.connected) {
        _this.stompClient.subscribe(`/channel/${roomId}`, (response) => {
          if (_this.nuevoGrupo == 1) {
            _this.stompClient.send(`/app/chat/reloaded/sendMessage`, {},
              JSON.stringify({
                sender: 'reloaded',
                content: roomId,
                type: 'CHAT'
              })
            );
          }
          if (JSON.parse(response.body).content === 'DELETE') {
            const dialogMessage: MatDialogRef<ChatDeleteComponent> = _this.modal.open(ChatDeleteComponent);
            dialogMessage.disableClose = true;
            dialogMessage.componentInstance.message = 'La conversación fue eliminada por el administrador';
            dialogMessage.afterClosed().subscribe((confirm: boolean) => {
              if (confirm) {
                _this.chatService.enviarConversacionEliminada(1);
                return false;
              }
            });
          }
          if (JSON.parse(response.body).content != null) {
            _this.chatService.listarDialogo(+roomId).subscribe(data => {
              _this.dialog = data;
              if (this.usuarioID == +JSON.parse(response.body).content) {
                _this.readyToReply();
              }
            });
          }
        });
        // console.log("<==========******** INGRESO AL SOCKET ********==========> " + roomId);
        _this.stompClient.send(`/app/chat/${roomId}/addUser`, {}, JSON.stringify({ sender: 'username', type: 'JOIN' }));
        _this.stompClient.send(`/app/chat/${recargaList}/addUser`, {}, JSON.stringify({ sender: 'username', type: 'JOIN' }));
      }
    });

  }

  trackDialog(index, hero) {
    return hero ? hero.id : undefined;
  }

  ngAfterViewInit() {
    this.replyInput = this.replyInputField.first.nativeElement;
    this.readyToReply();
  }

  readyToReply() {
    setTimeout(() => {
      this.replyForm.reset();
      this.focusReplyInput();
      this.scrollToBottom();
    });
  }

  focusReplyInput() {
    setTimeout(() => {
      this.replyInput.focus();
    });
  }

  scrollToBottom(speed?: number) {
    speed = speed || 400;
    if (this.directiveScroll) {
      this.directiveScroll.update();
      setTimeout(() => {
        this.directiveScroll.scrollToBottom(0, speed);
      });
    }
  }

  async reply(event) {
    if (!this.replyForm.form.value.message) {
      return false;
    } else {

      this.mensaje.idChat = this.chatID;
      this.mensaje.mensaje = this.replyForm.form.value.message;
      this.mensaje.idUsuario = this.usuarioID;

      await this.chatService.enviarNuevoMensaje(this.mensaje);
      let roomId = this.chatID;
      await this.stompClient.send(`/app/chat/${roomId}/sendMessage`, {},
        JSON.stringify({
          sender: this.chatID,
          content: this.usuarioID,
          type: 'CHAT'
        })
      );
      await this.stompClient.send(`/app/chat/reloaded/sendMessage`, {},
        JSON.stringify({
          sender: this.usuarioID,
          content: this.chatID,
          type: 'CHAT'
        })
      );
      this.chatService.obtenerCidSocketUsuario(this.chatID).subscribe(response => {
        if (response) {
          response.forEach(element => {
            this.chatService.enviarCidSocketChannel(element.cidsocket, 'contadorMenu', 'chat');
          });
        }
      });
    }
  }

  arrayContacto: any[] = [];
  verParticipantes(id: number): void {
    this.chatService.obtenerParticipanteGrupo(+id).subscribe(response => {
      const dialogReg: MatDialogRef<DetailGroupComponent> = this.modal.open(DetailGroupComponent, {
        disableClose: true,
        panelClass: 'dialog-no-padding',
        width: '500px',
        data: {
          id,
          arrayContacto: response
        }
      });
    });
  }

  eliminarConversacion(id) {
    const roomId = id;
    const dialogMessage: MatDialogRef<ConfirmMessageComponent> = this.modal.open(ConfirmMessageComponent);
    dialogMessage.componentInstance.message = '¿Está seguro de eliminar la conversacion?';
    dialogMessage.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.chatService.marcarConversacionComoEliminada(id);
        this.stompClient.send(`/app/chat/${roomId}/sendMessage`, {},
          JSON.stringify({
            sender: roomId,
            content: 'DELETE',
            type: 'CHAT'
          })
        );
        this.stompClient.send(`/app/chat/reloaded/sendMessage`, {},
          JSON.stringify({
            sender: this.usuarioID,
            content: roomId,
            type: 'DELETE'
          })
        );
      }
    });
  }

  mostrarSidenav() {
    this.mostrandoSidenav2.emit(true);
  }

  ngOnDestroy() {
    if (this.stompClient != null && this.stompClient.connected) {
      this.stompClient.disconnect();
    }
    this.subscriptor.unsubscribe();
    this.socketSubscription.unsubscribe();
  }

}

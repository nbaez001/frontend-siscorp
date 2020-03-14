import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Session } from '@shared/auth/Session';
import { Router } from '@angular/router';
import { AuthService } from 'app/protected/services/auth.service';
import { ChatService } from 'app/protected/modules/chat/services/chat.service';
import { Cabecera } from 'app/protected/entities/cabecera';
import { Subscription } from 'rxjs';

@Component({
  selector: 'protected-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewChecked, OnDestroy {

  cabecera: Cabecera = {
    titulo: '',
    icono: ''
  };

  esperarCabecera: Subscription;

  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    // TODO: POR REFACTORIZAR
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.esperarCabecera = this.authService.cabecera.subscribe(cabecera => this.cabecera = cabecera);
  }

  ngOnDestroy() {
    this.esperarCabecera.unsubscribe();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  logout(): void {
    // TODO: POR REFACTORIZAR
    /*
      envio el idUsuario que se va desconectar al websocket para que actualice
      su estado como offline para los demas usuarios conectados.
    */
    this.chatService.cerrarSesionSocket(Session.identity.id_usuario);

    Session.stop();
    this.router.navigate(['/anonimo/iniciar-sesion']);
  }

  get user() {
    return Session.identity;
  }

}

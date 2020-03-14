import { Component, OnInit, OnDestroy, Output, EventEmitter, HostListener } from '@angular/core';
import { ChatService } from './../../../../../services/chat.service';
import { Animations } from '@shared/animations';
import { Session } from '@shared/auth/Session';
import { GroupComponent } from './../group/group.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { noop as _noop } from 'lodash';
import { Combo } from 'app/protected/modules/chat/entities/combo';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Socket } from 'ng-socket-io';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
  animations: Animations,
})

export class ChatsComponent implements OnInit, OnDestroy {

  proyectoForm: FormGroup;

  user: any;
  chats: any[];
  contacts: any[] = [];
  chatSearch: any;
  searchText = '';
  chatList: any[] = [];
  chatID: number;
  usuarioID: number = +Session.identity.id_usuario;

  searchTambo: Combo;
  searchPuesto: Combo;
  searchNombre: string = '';
  filteredOptionsplataforma: Observable<Combo[]>;
  filteredOptionspuesto: Observable<Combo[]>;
  plataforma: Combo[];
  puesto: Combo[];

  @Output() toggleLeftSidenav = new EventEmitter();

  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);
  toggleLeftChat: boolean = false;

  constructor(
    private chatService: ChatService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private socket: Socket
  ) {
    this.chatSearch = {
      name: ''
    };
    this.obtenerPlataforma();
    this.obtenerPuesto();
  }

  ngOnInit() {
    this.getScreenWidth().subscribe(width => {
      if (width < 640) {
        this.toggleLeftChat = true;
      }
      else if (width > 640) {
        this.toggleLeftChat = false;
      }
    });
    this.crearFormulario();
    this.autocompletar();
    this.user = this.chatService.user;
    this.chatService.listadoConversacionRefresh.subscribe(response => {
      this.chatList = response;
    });
    this.chatService.listadoConversacion().subscribe(response => {
      this.chatList = response;
    });
    this.chatService.listadoContactoRefresh.subscribe(response => {
      this.contacts = response;
    });
    this.chatService.listadoContacto('', 0, 0).subscribe(response => {
      this.contacts = response
    });
  }

  trackChatList(index, hero) {
    return hero ? hero.id : undefined;
  }

  trackContacts(index, hero) {
    return hero ? hero.id : undefined;
  }

  private obtenerPlataforma() {
    this.plataforma = [];
    this.chatService.listaPlataforma().subscribe(response => {
      this.plataforma = response;
    });
  }

  private obtenerPuesto() {
    this.puesto = [];
    this.chatService.listaPuesto().subscribe(response => {
      this.puesto = response;
    })
  }

  crearFormulario(): void {
    this.proyectoForm = this.formBuilder.group({
      tambos: [''],
      puesto: [''],
      nombre: ['']
    });
  }

  autocompletar() {
    this.filteredOptionsplataforma = this.proyectoForm.controls['tambos'].valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.cidNombre),
        map(name => name ? this._filter_plataforma(name) : [])
      );

    this.filteredOptionspuesto = this.proyectoForm.controls['puesto'].valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.cidNombre),
        map(name => name ? this._filter_puesto(name) : [])
      );
  }

  displayFn(user?: any): string | undefined {
    return user ? user.cidNombre : undefined;
  }

  private _filter_plataforma(name: string): Combo[] {
    return this.plataforma.filter(option => option.cidNombre.toLowerCase().includes(name.toLowerCase()));
  }

  private _filter_puesto(name: string): Combo[] {
    return this.puesto.filter(option => option.cidNombre.toLowerCase().includes(name.toLowerCase()));
  }

  toggleClass(chat) {
    chat.flag = true;
  }

  onKeybusquedaContacto(event) {
    if (+event.target.value.length == 0) {
      this.chatService.listadoRefreshContacto(
        this.searchNombre,
        !(this.searchTambo) ? 0 : this.searchTambo.idCodigo,
        !(this.searchPuesto) ? 0 : this.searchPuesto.idCodigo
      );
    }
  }

  busquedaContacto(event) {
    this.chatService.listadoRefreshContacto(
      this.searchNombre,
      !(this.searchTambo) ? 0 : this.searchTambo.idCodigo,
      !(this.searchPuesto) ? 0 : this.searchPuesto.idCodigo
    );
  }

  obtenerChatDesdeContacto(idContacto) {
    this.chatService.obtenerChatDesdeContacto(idContacto.toString(), 0, 'conversacion simple', '123', 0);
    this.toggleLeftSidenav.emit(this.toggleLeftChat);
  }

  async obtenerChatDesdeConversaciones(id: number, idContacto: string, tipochat: number) {
    await this.chatService.obtenerChatDesdeConversaciones(id, idContacto, tipochat);
    this.chatService.obtenerCidSocketUsuario(id).subscribe(response => {
      if (response) {
        response.forEach(element => {
          if (element.response === +this.usuarioID) {
            this.chatService.enviarCidSocketChannel(element.cidsocket, 'contadorMenu', 'chat');
          }
        });
      }
    });
    this.toggleLeftSidenav.emit(this.toggleLeftChat);
  }

  arrayPlataforma: any[] = [];
  arrayPuesto: any[] = [];
  crearChatGrupal(): void {
    const dialogReg: MatDialogRef<GroupComponent> = this.dialog.open(GroupComponent, {
      disableClose: true,
      panelClass: 'dialog-no-padding',
      width: '600px',
      data: {
        arrayPlataforma: this.plataforma,
        arrayPuesto: this.puesto
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth$.next(event.target.innerWidth);
  }
  getScreenWidth(): Observable<number> {
    return this.screenWidth$.asObservable();
  }

  ngOnDestroy() {
  }

}

import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewChecked, Input } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { ColeccionMenu } from 'app/protected/entities/coleccion_menu';
import { MatTreeNestedDataSource, MatDialog, MatDialogRef, MatDrawer } from '@angular/material';
import { ContadorMenu } from 'app/protected/entities/cabecera';
import { Subscription } from 'rxjs';
import { AuthService } from 'app/protected/services/auth.service';
import { Socket } from 'ng-socket-io';
import { ChatService } from 'app/protected/modules/chat/services/chat.service';
import { LockComponent } from 'app/protected/modules/chat/components/lock/lock.component';

@Component({
  selector: 'protected-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy, AfterViewChecked {

  @Input() drawer: MatDrawer;

  treeControl = new NestedTreeControl<ColeccionMenu>(menu => menu.hijos);
  dataSource = new MatTreeNestedDataSource<ColeccionMenu>();

  contadoresMenu: ContadorMenu[] = [];

  esperarContadorMenu: Subscription;

  socketSubscription: Subscription;

  audioChat = new Audio('assets/audio/audioChat.wav');

  constructor(
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private socket: Socket,
    private chatService: ChatService,
    private dialog: MatDialog
  ) { }

  hasChild = (_: number, menu: ColeccionMenu) => !!menu.hijos && menu.hijos.length > 0;

  ngOnInit() {
    this.loadMenu();

    // ALTERAR EL CONTADOR DEL MENU
    this.esperarContadorMenu = this.socket.fromEvent('contadorMenu').subscribe((cm) => this.alterarContadorMenu(cm));

    // POR REFACTORIZAR
    this.obtenerIdSocket.then(id => {
      this.chatService.insertaIdUsuarioIdSocket(id);
      this.socketSubscription = this.socket.fromEvent('sesionIniciada').subscribe(() => {
        const dialogReg: MatDialogRef<LockComponent> = this.dialog.open(LockComponent, {
          disableClose: true,
          panelClass: 'dialog-no-padding',
        });
      });
    });

  }

  // POR REFACTORIZAR
  alterarContadorMenu(codigo: string|any) {

    this.authService.contadoresMenu().then(cm => {

      const index = this.contadoresMenu.map(c => c.codigo).indexOf(codigo);

      if (cm.length > 0) {
        const contadorMenu = cm[0];
        let cantidadInicial = 0;

        if (index !== -1) {
          cantidadInicial = this.contadoresMenu[index].cantidad;
          this.contadoresMenu[index] = contadorMenu;
        } else {
          this.contadoresMenu.push(contadorMenu);
        }

        if (contadorMenu.codigo === 'chat' && contadorMenu.cantidad > cantidadInicial) {
          this.audioChat.play();
        }

      } else if (index !== -1) {
        this.contadoresMenu.splice(index, 1);
      }

    });

  }

  // POR REFACTORIZAR
  get obtenerIdSocket(): Promise<string> {
    return new Promise((res) => {
      setTimeout(() => {
        res(this.socket.ioSocket.id);
      }, 10);
    });
  }

  existeContador(cm: ColeccionMenu) {
    return this.contadoresMenu.find(c => c.codigo === cm.cidCodigo && c.cantidad > 0);
  }

  ngOnDestroy() {
    this.socketSubscription.unsubscribe();
    this.esperarContadorMenu.unsubscribe();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  async loadMenu() {
    const data = await this.authService.loadMenu();
    this.dataSource.data = data;
    this.treeControl.dataNodes = data;
    this.treeControl.collapseAll();

    this.contadoresMenu = await this.authService.contadoresMenu();
  }

}

import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { UsuarioPerfilModuloService } from '../../services/usuario-perfil-modulo.service';
import { UsuarioPerfilModulo } from '../../entities/usuario-perfil-modulo';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';
import { UsuarioBuscado } from '../../entities/usuario-buscado';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'security-perfil-usuarios',
  templateUrl: './perfil-usuarios.component.html',
  styleUrls: ['./perfil-usuarios.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PerfilUsuariosComponent implements OnInit {

  columnas: string[] = ['numero', 'nombre', 'eliminar'];
  usuarios: UsuarioPerfilModulo[] = [];

  agregando = false;

  filtroUsuario = '';

  usuariosBuscados: UsuarioBuscado[] = [];

  usuarioBuscadoSeleccionado: UsuarioBuscado = null;

  buscarCambio: Subject<string> = new Subject<string>();

  constructor(
    public dialogRef: MatDialogRef<PerfilUsuariosComponent>,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    private codigoPerfilModulo: number,
    private usuarioPerfilModuloService: UsuarioPerfilModuloService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();

    this.buscarCambio
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((v) => {
        this.usuarioPerfilModuloService
          .filtrarUsuario(this.codigoPerfilModulo, v)
          .subscribe(usuariosBuscados => this.usuariosBuscados = usuariosBuscados);
      });
  }

  cargarUsuarios() {
    this.usuarioPerfilModuloService
      .lista(this.codigoPerfilModulo)
      .subscribe(usuarios => this.usuarios = usuarios);
  }

  quitarUsuario(codigoUsuarioPerfilModulo: number) {

    const eliminar: MatDialogRef<ConfirmMessageComponent> = this.dialog.open(ConfirmMessageComponent);
    eliminar.componentInstance.message = '¿Seguro que desea quitar al usuario?';

    eliminar.afterClosed().subscribe((elimino) => {
      if (!!elimino) {
        this.usuarioPerfilModuloService
          .quitar(codigoUsuarioPerfilModulo)
          .subscribe(() => this.cargarUsuarios());
      }
    });

  }

  filtrarUsuario() {
    this.buscarCambio.next(this.filtroUsuario);
  }

  mostrarFormulario() {
    this.agregando = true;
    this.filtroUsuario = '';
    this.usuariosBuscados = [];
  }

  seleccionarUsuario(usuario: UsuarioBuscado) {
    this.usuarioBuscadoSeleccionado = usuario;

    setTimeout(() => {
      this.filtroUsuario = '';
      this.usuariosBuscados = [];
    }, 10);
  }

  agregarUsuario() {
    this.usuarioPerfilModuloService.agregar(
      this.codigoPerfilModulo,
      [this.usuarioBuscadoSeleccionado.codigoUsuario]
    ).subscribe(
      () => {
        this.usuarioPerfilModuloService.usuarioAgregado.next();
        this.cargarUsuarios();
        this.snackbar.open('Usuario agregado correctamente', '', { horizontalPosition: 'center', duration: 5000 });
        this.usuarioBuscadoSeleccionado = null;
      },
      (error: HttpErrorResponse) => {
        this.snackbar.open(error.error.mensaje, '', { horizontalPosition: 'center', duration: 5000 });
        this.usuarioBuscadoSeleccionado = null;
      }
    );
  }

}

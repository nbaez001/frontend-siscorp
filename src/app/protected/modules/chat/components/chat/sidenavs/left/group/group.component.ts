import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Animations } from '@shared/animations';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatSelectionList, MatSelectionListChange, MatOption } from '@angular/material';
import { ChatService } from './../../../../../services/chat.service';
import { Session } from '@shared/auth/Session';
import { Combo } from './../../../../../entities/combo';
import { Observable, of, combineLatest } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { ENTER, COMMA } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
  animations: Animations
})
export class GroupComponent implements OnInit {

  gridHeight = 400;

  proyectoForm: FormGroup;
  grabar: boolean = true;
  nombreGrupo: string = "";
  usuarioID: number = +Session.identity.id_usuario;

  dataPlataforma: Combo[] = this.datos.arrayPlataforma;
  dataPuesto: Combo[] = this.datos.arrayPuesto;
  searchTambo: Combo;
  searchPuesto: Combo;
  searchNombre: string = '';
  filteredOptionsdataPlataforma: Observable<Combo[]>;
  filteredOptionsdataPuesto: Observable<Combo[]>;
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  separatorKeysCodes = [ENTER, COMMA];
  integrantes: any[] = [];

  contacts: any[] = [];

  constructor(
    private chatService: ChatService,
    public dialogRef: MatDialogRef<GroupComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public datos: DataContacto
  ) {

  }

  @ViewChild(MatSelectionList) contactos: MatSelectionList;

  ngOnInit() {
    this.crearFormulario();
    this.autocompletar();

    this.chatService.listadoContactoRefresh.subscribe(response => {
      this.contacts = response;
    });

    this.chatService.listadoContacto('', 0, 0).subscribe(response => {
      this.contacts = response
    });

    this.contactos.selectionChange.subscribe((s: MatSelectionListChange) => {
      if (s.option.selected) {
        if ((this.integrantes.findIndex(x => x.id === s.option.value.id)) === -1) {
          this.integrantes.push({
            'id': s.option.value.id,
            'name': s.option.value.name,
            'avatar': s.option.value.avatar,
            'idSocket': s.option.value.idSocket,
            'status': s.option.value.status,
            'nombre': s.option.value.nombre
          });
        } else {
          return false;
        }
      } else {
        let index = this.integrantes.findIndex(x => x.id === s.option.value.id);
        if (index >= 0) {
          this.integrantes.splice(index, 1);
        }
      }
      (+this.integrantes.length >= 2 && this.nombreGrupo.length != 0) ? this.grabar = false : this.grabar = true;
    });

  }
  crearFormulario(): void {
    this.proyectoForm = this.formBuilder.group({
      tambos: [''],
      puesto: [''],
      nombre: [''],
      nombreGrupo: ['']
    });
  }

  onKeyup(event) {
    if (+event.target.value.length == 0) {
      this.grabar = true
    } else if (+event.target.value.length != 0 && +this.integrantes.length >= 2) {
      this.grabar = false;
    }
  }

  remove(integrante: any) {
    let index = this.integrantes.findIndex(x => x.id === integrante.id);
    this.contactos.selectedOptions.selected.forEach(item => {
      if (item.value.id === integrante.id) {
        item.selected = false;
        return false;
      }
    });
    if (index >= 0) {
      this.integrantes.splice(index, 1);
    }
    (+this.integrantes.length >= 2 && this.nombreGrupo.length != 0) ? this.grabar = false : this.grabar = true;
  }

  autocompletar() {
    this.filteredOptionsdataPlataforma = this.proyectoForm.controls['tambos'].valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.cidNombre),
        map(name => name ? this._filter_plataforma(name) : [])
      );

    this.filteredOptionsdataPuesto = this.proyectoForm.controls['puesto'].valueChanges
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
    return this.dataPlataforma.filter(option => option.cidNombre.toLowerCase().includes(name.toLowerCase()));
  }

  private _filter_puesto(name: string): Combo[] {
    return this.dataPuesto.filter(option => option.cidNombre.toLowerCase().includes(name.toLowerCase()));
  }

  onKeybusquedaContacto2(event) {
    if (+event.target.value.length == 0) {
      this.chatService.listadoRefreshContacto(
        this.searchNombre,
        !(this.searchTambo) ? 0 : this.searchTambo.idCodigo,
        !(this.searchPuesto) ? 0 : this.searchPuesto.idCodigo
      );
    }
  }

  busquedaContacto2(event) {
    this.chatService.listadoRefreshContacto(
      this.searchNombre,
      !(this.searchTambo) ? 0 : this.searchTambo.idCodigo,
      !(this.searchPuesto) ? 0 : this.searchPuesto.idCodigo
    );
  }

  async crearGrupo() {
    let cadena = "";
    let color = this.getRandomColor() + ",";
    this.integrantes.forEach((data) => {
      cadena = cadena + data.id.toString() + ',';
      color = color + this.getRandomColor() + ',';
    })

    await this.chatService.obtenerChatDesdeContacto(cadena.substr(0, cadena.length - 1), 1, this.nombreGrupo, color.substr(0, color.length - 1), 1);
    this.dialogRef.close();
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return ('000000' + color).slice(-6);
  }

}

interface DataContacto {
  arrayPlataforma?: any[],
  arrayPuesto?: any[]

}

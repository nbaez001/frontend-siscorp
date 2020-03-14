import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { DecimalPipe, DatePipe } from '@angular/common';
import { _formasAdquisicion, _unidades, _tambos, _cuentas } from '../../../data-patrimonio';
import { DialogData } from '@shared/components/info-message/info-message.component';
import { DataDialog } from '../../../../control-combustible/entities/data-dialog.model';
import { BienPatrimonio } from '../../../entities/bien-patrimonio.model';
import { BienSobrante } from '../../../entities/bien-sobrante.model';
import { Adquisicion } from '../../../entities/adquisicion.model';

@Component({
  selector: 'app-alta-bns-sobr',
  templateUrl: './alta-bns-sobr.component.html',
  styleUrls: ['./alta-bns-sobr.component.scss']
})
export class AltaBnsSobrComponent implements OnInit {
  unidades: any[];
  tambos: any[];
  cuentas: any[];

  unidadesTabla: any[];
  tambosTabla: any[];
  cuentasTabla: any[];
  cuentasTabla2: any[];


  estados = [//OPCIONES
    { label: 'BUENO', value: { id: 1, nombre: 'BUENO' } },
    { label: 'REGULAR', value: { id: 2, nombre: 'REGULAR' } },
    { label: 'MALO', value: { id: 3, nombre: 'MALO' } },
  ];
  // estadosAdquisicion = _estadosAdquisicion;

  formularioGrp: FormGroup;
  messages = {
    'formaAdquisicion': {
      'required': 'Campo obligatorio'
    },
    'nroDocSustentatorio': {
      'required': 'Campo obligatorio'
    },
    'fechaAdquisicion': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'formaAdquisicion': '',
    'nroDocSustentatorio': '',
    'fechaAdquisicion': '',
  };

  listaBienes: BienPatrimonio[] = [];
  isLoading: boolean = true;
  formasAdquisicion: Object[];

  //AUTOCOMPLETE EN TABLA
  groupResultsData: any[] = [{ groupName: 'PERRO', groupDescription: 'ANIMAL DOMESTICO' }, { groupName: 'GATO', groupDescription: 'ANIMAL DOMESTICO' }];
  groupResults: any[] = [];
  groupSearchText: string;

  constructor(private fb: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AltaBnsSobrComponent>,
    // private spinnerService: Ng4LoadingSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    @Inject(ValidationService) private validationService: ValidationService,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      formaAdquisicion: ['', [Validators.required]],
      nroDocSustentatorio: ['', [Validators.required]],
      fechaAdquisicion: [{ value: this.datePipe.transform(new Date(), 'yyyy-MM-dd'), disabled: false }, [Validators.required]],
    });

    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  displayFn(subject) {
    return subject ? subject.denominacion : undefined;
  }

  public inicializarVariables(): void {
    this.isLoading = false;
    this.comboFormaAdquisicion();

    // this.cargarUnidades();
    // this.cargarCuentas();

    this.cargarUnidadesTabla();//PARA LOS SELECT DE LA TABLA
    this.cargarCuentasTabla();//PARA LOS SELECT DE LA TABLA
    this.bienesSobrantesAPatrimonio(this.data.objeto);
  }

  bienesSobrantesAPatrimonio(lista: BienSobrante[]): void {
    let cont = 0;
    const validarIntervalo = setInterval(() => {
      if (this.tambosTabla.length > 0) {
        lista.forEach(el => {
          let obj = new BienPatrimonio();
          obj.id = 0;
          obj.estado = { id: 1, nombre: 'BUENO' };
          obj.cuenta = { id: 1, codigo: '1503', nombre: 'VEHICULO, MAQUINARIAS Y OTROS' };
          obj.fechaContabilidad = new Date();
          obj.unidad = el.unidad;
          obj.tambo = el.tambo;

          this.listaBienes.push(obj);
        });
        clearInterval(validarIntervalo);
      } else {
        cont++;
        if (cont >= 50) {
          console.log('Nunca se cargo las lista de Tambos');
          console.log(this.tambosTabla);
          clearInterval(validarIntervalo);
        }
      }
    }, 100);
  }

  comboFormaAdquisicion() {
    this.formasAdquisicion = _formasAdquisicion;
    this.formularioGrp.get('formaAdquisicion').setValue(this.formasAdquisicion[0]);
  }


  guardar(): void {
    if (this.formularioGrp.valid) {
      if (this.listaBienes.length > 0) {
        let mae = new Adquisicion();
        mae.id = 0;
        mae.adquisicion = this.formularioGrp.get('formaAdquisicion').value;
        mae.nroDocSustentatorio = this.formularioGrp.get('nroDocSustentatorio').value;
        mae.fecha = this.formularioGrp.get('fechaAdquisicion').value;
        mae.totalBienes = this.listaBienes.length;

        this.dialogRef.close({ adquisicion: mae, lista: this.data.objeto });
      } else {
        console.log('agregar detalle')
      }
    } else {
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, true);
    }
  }

  public cargarUnidadesTabla() {
    let temp = JSON.parse(JSON.stringify(_unidades));
    this.unidadesTabla = [];
    temp.forEach(el => {
      this.unidadesTabla.push({ label: el.nombre, value: el });
    });

    console.log(this.unidadesTabla);

    this.cargarTambosTabla(this.unidadesTabla[0].value);
  }

  public cargarTambosTabla(ut: any) {
    console.log(ut);
    let temp = JSON.parse(JSON.stringify(_tambos.filter(tb => tb.idUnidad == ut.id)));
    this.tambosTabla = [];
    temp.forEach(el => {
      this.tambosTabla.push({ label: el.nombre, value: el });
    });

    console.log(this.tambosTabla);
  }

  public cargarCuentasTabla() {
    let temp = JSON.parse(JSON.stringify(_cuentas));
    this.cuentasTabla = [];
    this.cuentasTabla2 = [];
    temp.forEach(el => {
      this.cuentasTabla.push({ label: el.codigo, value: el });
      this.cuentasTabla2.push({ label: el.nombre, value: el });
    });
  }

  search(evt): void {
    this.groupResults = this._filter(this.groupSearchText);
    console.log(this.groupResults);
  }


  private _filter(value: any): any[] {
    const filterValue = (typeof value == 'string') ? value.toLocaleUpperCase() : null;
    return this.groupResultsData.filter(option =>
      option.groupName.toLocaleUpperCase().includes(filterValue)
    );
  }

}

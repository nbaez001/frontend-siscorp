import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { RegistroAsistenciaTareoComponent } from './registro-asistencia-tareo/registro-asistencia-tareo.component';
import { ListaAsistenciaTareoComponent } from './lista-asistencia-tareo/lista-asistencia-tareo.component';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, isFuture, isPast, addHours, isToday } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-asistencia-tareo',
  templateUrl: './asistencia-tareo.component.html',
  styleUrls: ['./asistencia-tareo.component.scss']
})
export class AsistenciaTareoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AsistenciaTareoComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public datos: DataTrabajador
  ) { }

  ngOnInit() {
  }

  registraTareo(fecha: any) {
    console.log("FECHA")
    console.log(fecha)
    const dialogReg: MatDialogRef<RegistroAsistenciaTareoComponent> = this.dialog.open(RegistroAsistenciaTareoComponent, {
      disableClose: true,
      panelClass: 'dialog-no-padding',
      width: '40%',
      data: {
        dataTrabajadorSelectedRegistro: this.datos.dataTrabajadorSelected,
        dataTrabajadorSelectedFecha: fecha.toDateString()
      }
    });
  }

  listarTareo(fecha: any) {
    const dialogReg: MatDialogRef<ListaAsistenciaTareoComponent> = this.dialog.open(ListaAsistenciaTareoComponent, {
      disableClose: true,
      panelClass: 'dialog-no-padding',
      width: '40%',
      data: {
        dataListaTareoTrabajadorFecha: fecha.toDateString()
      }
    });
  }

  // ***************** CALENDARIO *****************
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  viewDate2: Date = new Date();
  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = false;

  
  
  dayClicked({ date }: { date: Date }): void {
    console.log("date")
    console.log(date)
    console.log("Date")
    console.log(Date)

  
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === false)) {
        this.activeDayIsOpen = false;
        //presente
        
        //this.registraTareo(date);
      } else {
        if (isPast(date) && this.activeDayIsOpen === false) {
          this.activeDayIsOpen = false;
          //pasado
          this.listarTareo(date);
        } else {
          this.activeDayIsOpen = false;
          //futuro
        }
      }
    }
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

}

interface DataTrabajador {
  dataTrabajadorSelected?: any
}


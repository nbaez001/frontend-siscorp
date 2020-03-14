import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { Animations } from '@shared/animations';

@Component({
  selector: 'app-detail-group',
  templateUrl: './detail-group.component.html',
  styleUrls: ['./detail-group.component.scss'],
  animations: Animations
})
export class DetailGroupComponent implements OnInit {

  contacts: any[] = [];
  searchText = '';

  displayedColumns: string[] = ['avatar','contact','admin'];
  dataSource = new MatTableDataSource<any>(this.datos.arrayContacto);

  constructor(
    public dialogRef: MatDialogRef<DetailGroupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public datos: DataParticipante,
  ) { }

  ngOnInit() {
    this.dataSource.filterPredicate =
      (data: any, filtersJson: string) => {
        const matchFilter = [];
        const filters = JSON.parse(filtersJson);
        filters.forEach(filter => {
          const val = data[filter.id] === null ? '' : data[filter.id];
          matchFilter.push(val.toLowerCase().includes(filter.value.toLowerCase()));
        });
        return matchFilter.every(Boolean);
      };
  }

  applyFilter(filterValue: string) {
    const tableFilters = [];
    tableFilters.push({
      id: 'contact',
      value: filterValue
    });
    this.dataSource.filter = JSON.stringify(tableFilters);
  }

}

interface DataParticipante {
  id?: any;
  arrayContacto?: any[]
}


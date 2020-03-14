import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'core-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss']
})
export class AlertMessageComponent implements OnInit {

  public message: string;

  constructor(
    public dialogRef: MatDialogRef<AlertMessageComponent>
  ) { }

  ngOnInit() {
  }

}

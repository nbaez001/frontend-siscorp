import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'core-confirm-message',
  templateUrl: './confirm-message.component.html',
  styleUrls: ['./confirm-message.component.scss']
})
export class ConfirmMessageComponent implements OnInit {

  public message: string;

  constructor() { }

  ngOnInit() {
  }

}

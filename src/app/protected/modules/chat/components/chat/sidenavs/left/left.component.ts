import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.scss']
})
export class LeftComponent implements OnInit {

  view: string;
  @Output() toggleLeftSidenav = new EventEmitter();

  constructor() {
    this.view = 'chats'
  }

  ngOnInit() {
  }

  toggleLeftSidenavFromChat(toggle) {
    this.toggleLeftSidenav.emit(toggle);
  }

}

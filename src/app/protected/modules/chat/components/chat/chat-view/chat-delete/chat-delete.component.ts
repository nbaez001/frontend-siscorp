import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-delete',
  templateUrl: './chat-delete.component.html',
  styleUrls: ['./chat-delete.component.scss']
})
export class ChatDeleteComponent implements OnInit {

  public message: string;

  constructor() { }

  ngOnInit() {
  }

}

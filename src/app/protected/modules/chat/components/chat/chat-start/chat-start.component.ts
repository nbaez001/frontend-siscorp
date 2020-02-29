import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Animations } from '@shared/animations';

@Component({
  selector: 'app-chat-start',
  templateUrl: './chat-start.component.html',
  styleUrls: ['./chat-start.component.scss'],
  animations: Animations
})
export class ChatStartComponent implements OnInit {

  @Output() mostrandoSidenav = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  mostrarSidenav() {
    this.mostrandoSidenav.emit(true);
  }

}

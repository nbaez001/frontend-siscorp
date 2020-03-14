import { Component, OnInit, OnDestroy } from '@angular/core';
import { Animations } from '@shared/animations';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material';
import { Session } from '@shared/auth/Session';

@Component({
  selector: 'app-lock',
  templateUrl: './lock.component.html',
  styleUrls: ['./lock.component.scss'],
  animations: Animations
})
export class LockComponent implements OnInit {

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<LockComponent>
  ) { }

  ngOnInit() {
    // reseteo access_token para que muera la sesion presente
    Session.start(Object.assign({}, Session.identity, { 'access_token': '' }));
  }

  aceptar() {
    Session.stop();
    this.dialogRef.close();
    this.router.navigate(['/anonimo/iniciar-sesion']);
  }

}
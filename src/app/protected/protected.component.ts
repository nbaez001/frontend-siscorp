import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { MatDrawer, MatDialog } from '@angular/material';
import { Router, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertaErrorCargaComponent } from './components/alerta-error-carga/alerta-error-carga.component';

@Component({
  selector: 'app-protected',
  templateUrl: './protected.component.html',
  styleUrls: ['./protected.component.scss']
})
export class ProtectedComponent implements OnInit, OnDestroy {

  loading: boolean;

  subscriptorRouter: Subscription;

  @ViewChild('drawer') drawer: MatDrawer;

  constructor(
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.onResize(window.innerWidth);

    this.subscriptorRouter = this.router.events.subscribe(
      (event) => {

        if ( event instanceof NavigationStart ) {
          this.loading = true;
        }

        if ( event instanceof NavigationEnd ) {
          this.loading = false;
        }

        if ( event instanceof NavigationError && /Loading chunk [\d]+ failed/.test(event.error.message) ) {

          this.dialog.open(AlertaErrorCargaComponent, {
            panelClass: 'errorcarga-form-dialog',
            disableClose: true
          });

          setTimeout(() => {
            window.location.reload(true);
          }, 5000);

        }

      });
  }

  ngOnDestroy() {
    this.subscriptorRouter.unsubscribe();
  }

  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize(innerWidth: number) {
    if (innerWidth <= 1280 && this.drawer.opened) {
      this.drawer.close();
    } else if (innerWidth >= 1280 && !this.drawer.opened) {
      this.drawer.open();
    }
  }

}

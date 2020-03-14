import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html'
})
export class PublicComponent implements OnInit, OnDestroy {

  loading: boolean;

  subscriptorRouter: Subscription;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.subscriptorRouter = this.router.events.subscribe(
      (event) => {
        if ( event instanceof NavigationStart ) {
          this.loading = true;
        }
        if ( event instanceof NavigationEnd ) {
          this.loading = false;
        }
      });
  }

  ngOnDestroy() {
    this.subscriptorRouter.unsubscribe();
  }

}

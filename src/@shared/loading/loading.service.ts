import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoadingComponent } from './loading.component';

@Injectable()
export class LoadingService {

  peticiones = 0;

  private idDialogLoading: string;

  constructor(
    private dialog: MatDialog
  ) {
  }

  loadingStart() {

    this.peticiones++;

    if (this.peticiones === 1) {
      setTimeout(() => {
        const dialogLoading = this.dialog.open(LoadingComponent, {
          disableClose: true,
          panelClass: ['dialog-no-padding', 'loading-dialog'],
        });

        this.idDialogLoading = dialogLoading.id;
      }, 1);
    }

  }

  loadingStop() {

    this.peticiones--;

    if (this.peticiones === 0) {
      this.dialog.getDialogById(this.idDialogLoading).close();
    }

  }

}

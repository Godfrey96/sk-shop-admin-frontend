import { Injectable } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toast: NgToastService) { }

  openWarning(summary?: string) {
    this.toast.warning({ detail: 'Warning Message', summary, duration: 5000 });
  }

  openSuccess(summary?: string) {
    this.toast.success({ detail: 'Success Message', summary, duration: 5000 });
  }

  openError(summary?: string) {
    this.toast.error({ detail: 'Error Message', summary, duration: 5000 });
  }

  openInfo(summary?: string) {
    this.toast.info({ detail: 'Info Message', summary, duration: 5000 });
  }

}

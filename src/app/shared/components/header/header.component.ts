import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  constructor(
    private authService: AuthService,
    private dialogService: DialogService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
  }

  toggleSideBar() {
    this.toggleSideBarForMe.emit();

    setTimeout(() => {
      new Event('resize')
    }, 300);
  }

  logout() {
    this.dialogService.openConfirmDialog('Are you sure to logout?')
      .afterClosed().subscribe((res: any) => {
        if (res) {
          this.authService.logout();
          this.toastService.openSuccess('Logout Successfully!')
        } else {
          this.toastService.openError('Failed to logout!')
        }
      });
  }

}

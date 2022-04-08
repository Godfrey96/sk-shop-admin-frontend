import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { UsersFormComponent } from '../users-form/users-form.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['firstname', 'lastname', 'email', 'phone', 'isAdmin', 'actions'];
  dataSource!: MatTableDataSource<User>;
  users: User[] = [];
  endsub$: Subject<any> = new Subject();

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private toastService: ToastService,
    private dialogService: DialogService,
    private loaderService: LoaderService,
  ) {

  }

  ngOnInit(): void {
    this.loaderService.loading();
    this._getAllUsers()
  }

  private _getAllUsers() {
    this.userService.getUsers().pipe(
      takeUntil(this.endsub$)).subscribe((users) => {
        this.users = users;
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        console.log('users: ', users);
      })
  }

  openDialog() {
    this.dialog.open(UsersFormComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this._getAllUsers();
      }
    })
  }

  editUser(element: any) {
    this.dialog.open(UsersFormComponent, {
      width: '30%',
      data: element
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this._getAllUsers();
      }
    })
  }

  applyFilter(event: any) {
    console.log('event: ', event);
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteUser(id: string) {
    this.dialogService.openConfirmDialog('Are you sure to delete this user?')
      .afterClosed().subscribe((res: any) => {
        if (res) {
          this.userService.deleteUser(id)
            .subscribe({
              next: (res) => {
                this.toastService.openSuccess('User deleted successfully');
                // alert('Product deleted successfully');
                this._getAllUsers();
              },
              error: () => {
                this.toastService.openError('Error while deleting the user!');
                // alert('Error while deleting the product!');
              }
            })
        }
      });
  }

  ngOnDestroy() {
    this.endsub$.next('');
    this.endsub$.complete();
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user.model';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.scss']
})
export class UsersFormComponent implements OnInit {

  userForm!: FormGroup;
  isSubmitted = false;
  actionBtn: string = 'Save';
  titleForm: string = 'Add';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<UsersFormComponent>,
    private toastService: ToastService,
    private loaderService: LoaderService,
  ) { }

  ngOnInit(): void {
    this._initProductForm();
    this._checkEditMode();
  }

  private _initProductForm() {
    this.userForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      isAdmin: [false],
      address: ['', Validators.required],
    })
  }

  private _checkEditMode() {
    if (this.editData) {
      this.actionBtn = 'Update';
      this.titleForm = 'Update';
      this.userFormError['firstname'].setValue(this.editData.firstname);
      this.userFormError['lastname'].setValue(this.editData.lastname);
      this.userFormError['email'].setValue(this.editData.email);
      this.userFormError['phone'].setValue(this.editData.phone);
      this.userFormError['address'].setValue(this.editData.address);
      this.userFormError['isAdmin'].setValue(this.editData.isAdmin);

      this.userFormError['password'].setValidators([]);
      this.userFormError['password'].updateValueAndValidity();
    }
  }

  createUser(user: User) {
    this.userService.createUser(user)
      .subscribe({
        next: (res) => {
          this.loaderService.loading();
          this.toastService.openSuccess('User added successfully');
          this.userForm.reset();
          this.dialogRef.close('save');
        },
        error: () => {
          this.loaderService.loading();
          this.toastService.openError('Error while adding the user');
        }
      })
  }

  updateUser(user: User) {
    this.userService.updateUser(user, this.editData.id)
      .subscribe({
        next: (res) => {
          this.loaderService.loading();
          this.toastService.openSuccess('User updated successfully');
          this.userForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          this.loaderService.loading();
          this.toastService.openError('Error while updating the user');
        }
      })
  }

  addUser() {
    this.isSubmitted = true;

    const user: User = {
      firstname: this.userFormError['firstname'].value,
      lastname: this.userFormError['lastname'].value,
      email: this.userFormError['email'].value,
      phone: this.userFormError['phone'].value,
      password: this.userFormError['password'].value,
      isAdmin: this.userFormError['isAdmin'].value,
      address: this.userFormError['address'].value,
    }

    if (this.editData) {
      this.updateUser(user);
    } else {
      this.createUser(user);
    }

  }

  onCancle() {
    this.dialogRef.close();
  }

  // errors
  get userFormError() {
    return this.userForm.controls;
  }

}

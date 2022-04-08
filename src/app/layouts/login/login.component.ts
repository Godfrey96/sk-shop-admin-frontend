import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginFormGroup!: FormGroup;
  isSubmitted = false;
  authError = false;
  isLoading = false;
  authMessage = 'Email or Password are wrong';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this._initLoginForm();
  }

  private _initLoginForm() {
    this.loginFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    // this.isLoading = true;
    this.isSubmitted = true;

    if (this.loginFormGroup.invalid) return;

    this.authService.loginUser(this.loginForm['email'].value, this.loginForm['password'].value).subscribe((user) => {
      if (user.isAdmin) {
        this.toastService.openSuccess('Successfully logged in...');
        this.authError = false;
        this.isLoading = true;
        this.router.navigate(['/']);
      } else {
        console.log("user-admin", user)
        this.authError = true;
        this.localStorageService.removeToken();
        this.toastService.openError('Only the admin can login!');
        // this.authMessage = "Only the admin can login here!";
        this.isLoading = false;
      }
    },
      (error: HttpErrorResponse) => {
        this.authError = true;
        if (error.status !== 400) {
          this.toastService.openError('Error in the Server. please try again later!')
          // this.authMessage = "Error in the Server. please try again later!";
        }
        // if (error.status === 404) {
        //   this.toastService.openError('No such user exists in our system!');
        //   // this.authMessage = "Error in the Server. please try again later!";
        // }
      }
    );
  }

  get loginForm() {
    return this.loginFormGroup.controls;
  }

}

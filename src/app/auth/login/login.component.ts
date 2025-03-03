import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  public loginForm!: UntypedFormGroup;
  public loggingIn: boolean = false;
  public loginError: boolean = false;
  public errorMessage: string = 'An error occured. Please try again!';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  get controls() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loggingIn = true;
    this.loginError = false;

    this.authService
      .login(this.loginForm.value)
      .pipe(finalize(() => (this.loggingIn = false)))
      .subscribe({
        next: (resp) => {
          this.authService.setUserToken(resp.token);
          this.router.navigate(['/books']);
        },
        error: (err) => {
          if (err.error?.error_name) {
            this.errorMessage = err.error.message;
          }
          this.loginError = true;
        },
      });
  }
}

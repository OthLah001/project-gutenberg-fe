import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
  public signupForm!: UntypedFormGroup;
  public registring: boolean = false;
  public registraionError: boolean = false;
  public errorMessage: string = 'An error occured. Please try again!';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  get controls() {
    return this.signupForm.controls;
  }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      first_name: ['', [Validators.required, Validators.maxLength(30)]],
      last_name: ['', [Validators.required, Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onRegisterUser() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.registring = true;
    this.registraionError = false;

    this.authService
      .registerUser(this.signupForm.value)
      .pipe(
        finalize(() => {
          this.registring = false;
        })
      )
      .subscribe({
        next: (resp) => {
          this.authService.setUserToken(resp.token);
          this.router.navigate(['/books']);
        },
        error: (err) => {
          if (err.error?.error_name) {
            this.errorMessage = err.error.message;
          }
          this.registraionError = true;
        },
      });
  }
}

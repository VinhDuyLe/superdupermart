// superdupermart/frontend/src/app/auth/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { RegistrationRequest } from 'src/app/shared/models/user.model'; // Import the model

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] 
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.errorMessage = null; // Clear previous errors
    if (this.registerForm.valid) {
      const userData: RegistrationRequest = this.registerForm.value;
      this.authService.register(userData).subscribe({
        next: response => {
          console.log('Registration successful', response);
          // On successful registration, redirect to login page
          this.router.navigate(['/login']);
        },
        error: err => {
          console.error('Registration failed', err);
          this.errorMessage = err.error?.error || 'Registration failed. Please try again.';
        }
      });
    }
  }
}
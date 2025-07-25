// superdupermart/frontend/src/app/auth/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginRequest } from 'src/app/shared/models/user.model';
import { UserRole } from 'src/app/shared/models/user.model'; // Import UserRole enum

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.errorMessage = null; 
    if (this.loginForm.valid) {
      const credentials: LoginRequest = this.loginForm.value;
      this.authService.login(credentials).subscribe({
        next: response => {
          console.log('Login successful', response);
          const role = this.authService.getUserRole();
          if (role === UserRole.ADMIN) {
            this.router.navigate(['/admin/home']);
          } else {
            this.router.navigate(['/user/home']);
          }
        },
        error: err => {
          console.error('Login failed', err);
          this.errorMessage = err.error?.error || 'Login failed. Please check your credentials.';
        }
      });
    }
  }
}
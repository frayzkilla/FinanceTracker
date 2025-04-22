import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HttpClient } from '@angular/common/http';


import {
  faEnvelope,
  faLock,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  faEnvelope = faEnvelope;
  faLock = faLock;
  faUserPlus = faUserPlus;

  loginForm: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder, private http: HttpClient) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;

      this.authService.login(formData).subscribe({
        next: (response) => {
          console.log('Успешно отправлено!', response);
        },
        error: (error) => {
          console.error('Ошибка при отправке:', error);
        },
      });
    }
  }
}
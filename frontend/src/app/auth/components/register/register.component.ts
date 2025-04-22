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
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  faEnvelope = faEnvelope;
  faLock = faLock;
  faUserPlus = faUserPlus;

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;

      this.authService.register(formData).subscribe({
        next: (response) => {
          console.log('Успешно отправлено!', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Ошибка при отправке:', error);
        },
      });
    }
  }
}

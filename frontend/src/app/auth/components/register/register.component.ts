import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HttpClient } from '@angular/common/http';

import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

import {
  faEnvelope,
  faLock,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  faEnvelope = faEnvelope;
  faLock = faLock;
  faUserPlus = faUserPlus;

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;

      this.http
        .post('http://localhost:3000/users/adduser', formData)
        .subscribe({
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

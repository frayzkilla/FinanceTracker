import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http'; 


@NgModule({
  declarations: [RegisterComponent],

  imports: [FontAwesomeModule, ReactiveFormsModule, CommonModule, AuthRoutingModule, HttpClientModule],
})
export class AuthModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LoadingSpinnerComponent, NavbarComponent],
  imports: [CommonModule, RouterModule],
  exports: [LoadingSpinnerComponent, NavbarComponent],
})
export class SharedModule {}

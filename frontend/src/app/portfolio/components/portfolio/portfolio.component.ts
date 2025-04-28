import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PortfolioService } from '../../services/portfolio.service';
import { debounceTime, filter } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { Stock } from '../../interfaces/stock.interface';

@Component({
  selector: 'app-portfolio',
  styleUrls: ['./portfolio.component.scss'],
  templateUrl: './portfolio.component.html',
})
export class PortfolioComponent implements OnInit {
  searchControl = new FormControl('');
  filteredSymbols: any[] = [];

  assets: Stock[] = [];

  isModalOpen = false;
  assetForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private authService: AuthService
  ) {
    this.assetForm = this.fb.group({
      name: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.0001)]],
    });
  }

  pieChartLabels: string[] = [];
  pieChartData: number[] = [];

  totalValue = 0;

  ngOnInit(): void {
    this.portfolioService.loadStockSymbols();

    const token = this.authService.getToken();
    if (token) {
      this.portfolioService.loadUserAssets(token);
    }

    // Подписываемся на поток активов
    this.portfolioService.assets$.subscribe((assets) => {
      this.assets = assets;
      this.updateTotalValue();
    });

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        filter((value): value is string => value !== null)
      )
      .subscribe((value: string) => {
        this.filteredSymbols = this.portfolioService.searchStockSymbols(value);
      });

    this.totalValue = this.assets.reduce(
      (sum, a) => sum + a.amount * a.price,
      0
    );
    this.pieChartLabels = this.assets.map((a) => a.name);
    this.pieChartData = this.assets.map((a) => a.amount * a.price);

    setTimeout(() => {
      this.filteredSymbols = [...(this.portfolioService?.['stocksList'] || [])];
    }, 300);
  }

  onAddAsset() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.assetForm.reset();
  }

  submitAsset() {
    if (this.assetForm.valid) {
      const newAsset = this.assetForm.value;
      this.assets.push(newAsset);
      this.updateTotalValue();
      this.closeModal();
    }
  }

  updateTotalValue() {
    this.totalValue = this.assets.reduce(
      (sum, asset) => sum + asset.amount * asset.price,
      0
    );
  }

  onDeleteAsset(index: number): void {
    this.assets.splice(index, 1);
    this.updateTotalValue();
  }
}

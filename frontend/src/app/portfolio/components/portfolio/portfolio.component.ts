import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PortfolioService } from '../../services/portfolio.service';
import { debounceTime, filter } from 'rxjs';

@Component({
  selector: 'app-portfolio',
  styleUrls: ['./portfolio.component.scss'],
  templateUrl: './portfolio.component.html',
})
export class PortfolioComponent implements OnInit {
  searchControl = new FormControl('');
  filteredSymbols: any[] = [];

  assets = [
    { name: 'Bitcoin', amount: 0.5, price: 4000000 },
    { name: 'Apple', amount: 10, price: 19000 },
    { name: 'Ethereum', amount: 2, price: 250000 },
  ];

  isModalOpen = false;
  assetForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService
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
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        filter((value): value is string => value !== null) // Игнорируем null значения
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
    this.portfolioService.loadStockSymbols();
    setTimeout(() => {
      // Защищенный доступ к списку акций
      this.filteredSymbols = [...this.portfolioService?.['stocksList'] || []];
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

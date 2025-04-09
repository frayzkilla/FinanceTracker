import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
})
export class PortfolioComponent implements OnInit {
  assets = [
    { name: 'Bitcoin', amount: 0.5, price: 4000000 },
    { name: 'Apple', amount: 10, price: 19000 },
    { name: 'Ethereum', amount: 2, price: 250000 },
  ];

  pieChartLabels: string[] = [];
  pieChartData: number[] = [];

  totalValue = 0;

  ngOnInit(): void {
    this.totalValue = this.assets.reduce((sum, a) => sum + a.amount * a.price, 0);
    this.pieChartLabels = this.assets.map(a => a.name);
    this.pieChartData = this.assets.map(a => (a.amount * a.price));
  }
}
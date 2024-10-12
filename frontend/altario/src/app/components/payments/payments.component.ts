import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GridService } from '../../services/grid.service';
import { GridData } from '../generator/generator.component';
import { GridcodeComponent } from '../gridcode/gridcode.component';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PaymentsService } from '../../services/payments.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    GridcodeComponent,
    FormsModule,
    NgxMaskDirective,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  providers: [provideNgxMask()],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent {
  gridData?: GridData;
  weightedCharacter = "";

  live = false;
  isDisabled: boolean = false;
  gridSubscription?: Subscription;
  name = "";
  ammount = "";

  displayedColumns: string[] = ['name', 'ammount', 'code', 'grid'];
  dataSource: PaymentData[] = [];

  constructor(private gridService: GridService, private router: Router, private paymentsService: PaymentsService) {
  }

  ngOnInit(): void {
    this.loadGridData();
    this.gridService.liveState$.subscribe({
      next: data => {
        this.live = data;
      }
    });
    this.paymentsService.getPayments().subscribe({
      next: data => {
        this.dataSource = data;
      }
    })
  }

  ngOnDestroy(): void {
    this.gridSubscription?.unsubscribe();
  }

  loadGridData() {
    this.gridSubscription = this.gridService.gridState.subscribe({
      next: data => {
        this.gridData = data;

      },
      error: err => {
        console.error('Error fetching grid data:', err);
      }
    });
  }

  navigate() {
    this.router.navigate(["/"]);
  }

  getGridSize(grid: string[][]): number {
    let counter = 0;
    for (let column of grid) {
      for (let row of column) {
        counter++;
      }
    }
    return counter;
  }

}

export interface PaymentData {
  name: string;
  ammount: string;
  grid: string[][];
  code: string;
}

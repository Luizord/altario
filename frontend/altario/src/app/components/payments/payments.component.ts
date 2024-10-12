import { Component, Inject, inject, Output } from '@angular/core';
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
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

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
  disabled = false;

  displayedColumns: string[] = ['name', 'ammount', 'code', 'grid'];
  dataSource: PaymentData[] = [];

  readonly dialog = inject(MatDialog);

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
      counter += column.length;
    }
    return counter;
  }

  addPayments() {

    if (!this.name || !this.ammount || !this.live || !this.gridData) {
      return;
    }

    this.disabled = true;
    let paymentData: PaymentData = {
      name: this.name,
      ammount: this.ammount,
      grid: this.gridData!.grid,
      code: this.gridData!.code,
    }
    this.paymentsService.addPayment(paymentData).subscribe({
      next: data => {
        this.dataSource = data;
      },
      error: err => {
        console.error('Error adding payment:', err);
      },
      complete: () => {
        this.disabled = false;
        this.name = "";
        this.ammount = "";
      }
    });
  }

  openDialog(row: any): void {
    let dialogRef = this.dialog.open(DeleteDialog, {
      width: '300px',
      data: row
    });
    dialogRef.afterClosed().subscribe(remove => {
      if (remove) {
        this.removePayment(row);
      }
    });
  }

  removePayment(row: any) {
    this.disabled = true;
    this.paymentsService.removePayment(row.id).subscribe({
      next: data => {
        this.dataSource = data;
      },
      error: err => {
        console.error('Error removing payment:', err);
      },
      complete: () => {
        this.disabled = false;
      }
    });

  }

}

export interface PaymentData {
  name: string;
  ammount: string;
  grid: string[][];
  code: string;
}

// Delete Table entry confirmation dialog component
@Component({
  selector: 'delete-dialog',
  template: `<h2 mat-dialog-title>Delete file</h2>
<mat-dialog-content>
  Would you like to delete this Payment named {{data.name}}?
</mat-dialog-content>
<mat-dialog-actions>
  <button mat-button (click)="closeDialog(false)">No</button>
  <button mat-button (click)="closeDialog(true)" cdkFocusInitial>Yes</button>
</mat-dialog-actions>`,
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent]
})
export class DeleteDialog {
  readonly dialogRef = inject(MatDialogRef<DeleteDialog>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  closeDialog(remove: boolean) {
    this.dialogRef.close(remove);
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { GridService } from '../../services/grid.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GridcodeComponent } from '../gridcode/gridcode.component';

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [MatGridListModule, FormsModule, NgxMaskDirective, MatIconModule, GridcodeComponent],
  providers: [provideNgxMask()],
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.scss'
})
export class GeneratorComponent implements OnInit, OnDestroy {

  gridData?: GridData;
  weightedCharacter = "";

  live = false;
  isDisabled: boolean = false;
  gridSubscription?: Subscription;

  constructor(private gridService: GridService, private router: Router) {
  }

  ngOnInit(): void {
    this.loadGridData();
    this.gridService.liveState$.subscribe({
      next: data => {
        this.live = data;
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

  startGridGeneration() {
    this.gridService.getGridData(this.weightedCharacter).subscribe({
      next: data => {
        this.gridData = data;
        this.gridService.gridState.next(data);
        this.gridService.startGridGeneration(this.weightedCharacter);
      },
      error: err => {
        console.error('Error fetching grid data:', err);
      }
    });
  }

  disableInput(): void {
    if (!this.weightedCharacter) {
      return;
    }
    this.isDisabled = true;

    setTimeout(() => {
      this.isDisabled = false;
    }, 4000);
  }

  navigate() {
    this.router.navigate(["./payments"]);
  }

  changedCharacterEvent(event: string) {
    this.weightedCharacter = event;
    this.disableInput();
    if(this.live) {
      this.startGridGeneration();
    }
  }

}

export interface GridData {
  grid: string[][];
  code: string;
}

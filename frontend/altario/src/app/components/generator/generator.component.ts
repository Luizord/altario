import { Component } from '@angular/core';
import { GridService } from '../../services/grid.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [MatGridListModule, FormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.scss'
})
export class GeneratorComponent {

  gridData: GridData; // Variable to store grid data
  weightedCharacter = "";
  emptyGrid = [["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""]
  ];
  interval?: NodeJS.Timeout;
  isDisabled: boolean = false;

  constructor(private gridService: GridService) {
    this.gridData = { grid: this.emptyGrid, code: "--" };
  }

  ngOnInit() {

  }

  loadGridData() {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.getGridData();
    }, 2000);
  }

  getGridData() {
    this.gridService.getGridData(this.weightedCharacter).subscribe({
      next: data => {
        this.gridData = data;

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
      this.isDisabled = false; // Re-enable the input field after 4 seconds
    }, 4000);
  }

}

export interface GridData {
  grid: string[][];
  code: string;
}

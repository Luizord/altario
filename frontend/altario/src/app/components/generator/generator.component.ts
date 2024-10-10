import { Component } from '@angular/core';
import { GridService } from '../../services/grid.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [MatGridListModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule],
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

}

export interface GridData {
  grid: string[][];
  code: string;
}

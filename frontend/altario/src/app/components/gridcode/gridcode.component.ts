import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-gridcode',
  standalone: true,
  imports: [],
  templateUrl: './gridcode.component.html',
  styleUrl: './gridcode.component.scss'
})
export class GridcodeComponent {

  @Input() code: string ="";
  @Input() live: boolean = false;

}

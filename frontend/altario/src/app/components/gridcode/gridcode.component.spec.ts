import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridcodeComponent } from './gridcode.component';

describe('GridcodeComponent', () => {
  let component: GridcodeComponent;
  let fixture: ComponentFixture<GridcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridcodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

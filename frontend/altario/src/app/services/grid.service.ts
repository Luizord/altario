import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { GridData } from '../components/generator/generator.component';
import { environment } from '../../environments/environment';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GridService {

    private interval?: NodeJS.Timeout;
    private emptyGrid = [["", "", "", "", "", "", "", "", "", ""],
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
    private emptyGridData = { grid: this.emptyGrid, code: "--" };

    // This gridState will store the grid and emit the last value to subscribers as it gets updates
    gridState = new BehaviorSubject<GridData>(this.emptyGridData);
    // Use liveState to check if generation is currently live
    private liveState = new BehaviorSubject<boolean>(false);
    liveState$: Observable<boolean> = this.liveState.asObservable();


    constructor(private http: HttpClient) { }

    getGridData(weightedChar?: string): Observable<GridData> {
        return this.http.post<any>(`${environment.serverUrl}/grid`, { weightedChar: weightedChar });
    }

    startGridGeneration(weightedChar?: string) {
        clearInterval(this.interval);
        this.liveState.next(true);
        this.interval = setInterval(() => {
            this.getGridData(weightedChar).pipe(
                tap(response => {
                    // Update the state with the new grid
                    this.gridState.next(response);
                }),
                catchError(error => {
                    console.error('Error fetching data', error);
                    this.gridState.next(this.emptyGridData);
                    throw error;
                })
            ).subscribe();
        }, 2000);
    }


}
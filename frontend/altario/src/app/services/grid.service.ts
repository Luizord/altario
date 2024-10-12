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

    // BehaviorSubject will store the state and emit the last value to new subscribers
    gridState = new BehaviorSubject<GridData>(this.emptyGridData);
    // liveState to check if generation is currently live
    private liveState = new BehaviorSubject<boolean>(false);
    liveState$: Observable<boolean> = this.liveState.asObservable();


    constructor(private http: HttpClient) { }

    // Method to get data from the API
    getGridData(weightedChar?: string): Observable<GridData> {
        return this.http.post<any>(`${environment.serverUrl}/grid`, { weightedChar: weightedChar });
    }

    startGridGeneration(weightedChar?: string) {
        clearInterval(this.interval);
        this.liveState.next(true);
        this.interval = setInterval(() => {
            console.log(weightedChar)
            this.getGridData(weightedChar).pipe(
                tap(response => {
                    // Update the state with the new data
                    this.gridState.next(response);
                }),
                catchError(error => {
                    // Handle error, here you can set the error state
                    console.error('Error fetching data', error);
                    this.gridState.next(this.emptyGridData);
                    throw error;
                })
            ).subscribe();
        }, 2000);
    }


}
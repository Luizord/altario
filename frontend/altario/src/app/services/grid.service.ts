import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GridData } from '../components/generator/generator.component';

@Injectable({
    providedIn: 'root'
})
export class GridService {

    private apiUrl = 'http://localhost:3000'; // This should be changed to an enviroment variable in the future

    constructor(private http: HttpClient) { }

    // Method to get data from the API
    getGridData(weightedChar?: string): Observable<GridData> {
        return this.http.post<any>(`${this.apiUrl}/grid`, { weightedChar: weightedChar });
    }
}
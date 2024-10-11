import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GridData } from '../components/generator/generator.component';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GridService {

    constructor(private http: HttpClient) { }

    // Method to get data from the API
    getGridData(weightedChar?: string): Observable<GridData> {
        return this.http.post<any>(`${environment.serverUrl}/grid`, { weightedChar: weightedChar });
    }
}
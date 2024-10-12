import { Injectable } from "@angular/core";
import { PaymentData } from "../components/payments/payments.component";
import { Observable } from "rxjs/internal/Observable";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class PaymentsService {

    constructor(private http: HttpClient) { }

    getPayments(): Observable<PaymentData[]> {
        return this.http.get<any>(`${environment.serverUrl}/payments`);
    }

    addPayment(paymentData: PaymentData): Observable<PaymentData[]> {
        return this.http.post<any>(`${environment.serverUrl}/payments`, { createpaymentDto: paymentData });
    }

    removePayment(id: number) {
        return this.http.delete<any>(`${environment.serverUrl}/payments/${id}`);
    }

}
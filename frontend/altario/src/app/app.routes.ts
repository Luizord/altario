import { Routes } from '@angular/router';
import { GeneratorComponent } from './components/generator/generator.component';
import { PaymentsComponent } from './components/payments/payments.component';

export const routes: Routes = [
    { path: '', component: GeneratorComponent },
    { path: 'payments', component: PaymentsComponent },
    { path: '**', redirectTo: '' ,pathMatch: 'full' }
];

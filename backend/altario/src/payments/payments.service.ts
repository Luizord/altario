import { Injectable, NotFoundException } from '@nestjs/common';
import { Payment, PaymentDTO, UpdatePaymentDTO } from 'src/models/payment.model';
import * as fs from 'fs-extra';
import { join } from 'path';

@Injectable()
export class PaymentsService {

    private readonly filePath = join(__dirname, '..', '..', 'src', 'data', 'payments.json');; // Simulating a simple in-memory storage for payments

    constructor() {

    }

    // Helper method to read payments from the file
    private async readpaymentsFromFile(): Promise<Payment[]> {
        try {
            const payments = await fs.readJson(this.filePath);
            return payments;
        } catch (error) {
            // If file doesn't exist, return an empty array
            return [];
        }
    }

    // Helper method to write payments to the file
    private async writepaymentsToFile(payments: Payment[]): Promise<void> {
        await fs.writeJson(this.filePath, payments, { spaces: 2 }); // Writing with pretty formatting (spaces: 2)
    }

    // CREATE
    async create(createpaymentDto: PaymentDTO): Promise<Payment[]> {
        let payments = await this.readpaymentsFromFile();
        const newpayment: Payment = {
            id: payments.length + 1, // Auto-generate an ID
            ...createpaymentDto,
        };
        payments.push(newpayment);
        await this.writepaymentsToFile(payments); // Write the updated list to the file
        return payments;
    }

    // READ ALL
    async findAll(): Promise<Payment[]> {
        return await this.readpaymentsFromFile(); // Read products from the JSON file
    }

    // READ ONE
    // findOne(id: number): Payment {
    //     const payment = this.payments.find((prod) => prod.id === id);
    //     if (!payment) {
    //         throw new NotFoundException(`payment with ID ${id} not found`);
    //     }
    //     return payment;
    // }

    // UPDATE
    // update(id: number, updatepaymentDto: UpdatePaymentDTO): Payment {
    //     const paymentIndex = this.payments.findIndex((prod) => prod.id === id);
    //     if (paymentIndex === -1) {
    //         throw new NotFoundException(`payment with ID ${id} not found`);
    //     }

    //     const updatedpayment = { ...this.payments[paymentIndex], ...updatepaymentDto };
    //     this.payments[paymentIndex] = updatedpayment;
    //     return updatedpayment;
    // }

    // // DELETE
    // remove(id: number): void {
    //     const paymentIndex = this.payments.findIndex((prod) => prod.id === id);
    //     if (paymentIndex === -1) {
    //         throw new NotFoundException(`payment with ID ${id} not found`);
    //     }
    //     this.payments.splice(paymentIndex, 1);
    // }
}

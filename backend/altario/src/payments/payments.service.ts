import { Injectable, NotFoundException } from '@nestjs/common';
import { Payment, PaymentDTO, UpdatePaymentDTO } from 'src/models/payment.model';
import * as fs from 'fs-extra';
import { join } from 'path';
import { SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'dgram';
import { RealTimeGateway } from 'src/gateway/websocket.gateway';

@Injectable()
export class PaymentsService {

    private readonly filePath = join(__dirname, '..', '..', 'src', 'data', 'payments.json');; // Simulating a simple in-memory storage for payments

    constructor(private readonly realTimeGateway: RealTimeGateway) {}

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
        await fs.writeJson(this.filePath, payments, { spaces: 2 });
    }

    // CREATE
    async create(createpaymentDto: PaymentDTO): Promise<Payment[]> {
        let payments = await this.readpaymentsFromFile();
        const newpayment: Payment = {
            id: payments.length + 1, // Auto-generate an ID
            name: createpaymentDto.name,
            ammount: createpaymentDto.ammount,
            grid: createpaymentDto.grid,
            code: createpaymentDto.code,
        };
        payments.push(newpayment);
        await this.writepaymentsToFile(payments); // Write the updated list to the file
        this.realTimeGateway.server.emit('dataUpdated', newpayment);
        return payments;
    }

    // READ ALL
    async findAll(): Promise<Payment[]> {
        return await this.readpaymentsFromFile(); // Read payments from the JSON file
    }

    // READ ONE
    async findOne(id: number): Promise<Payment> {
        const payments = await this.readpaymentsFromFile();
        const payment = payments.find((prod) => prod.id === id);

        if (!payment) {
            throw new NotFoundException(`payment with ID ${id} not found`);
        }

        return payment;
    }

    // UPDATE
    async update(id: number, updatepaymentDto: UpdatePaymentDTO): Promise<Payment[]> {
        const payments = await this.readpaymentsFromFile();
        const paymentIndex = payments.findIndex((prod) => prod.id === id);

        if (paymentIndex === -1) {
            throw new NotFoundException(`payment with ID ${id} not found`);
        }

        const updatedpayment = { ...payments[paymentIndex], ...updatepaymentDto };
        payments[paymentIndex] = updatedpayment;

        this.realTimeGateway.server.emit('dataUpdated', updatedpayment);

        await this.writepaymentsToFile(payments);
        return payments;
    }

    // DELETE
    async remove(id: number): Promise<Payment[]> {
        const payments = await this.readpaymentsFromFile();
        const paymentIndex = payments.findIndex((pay) => pay.id === id);
        const deletedPayment = payments[paymentIndex];

        if (paymentIndex === -1) {
            throw new NotFoundException(`payment with ID ${id} not found`);
        }

        payments.splice(paymentIndex, 1); // Remove the payment
        this.realTimeGateway.server.emit('dataDeleted', deletedPayment);

        await this.writepaymentsToFile(payments);
        return payments;
    }

}

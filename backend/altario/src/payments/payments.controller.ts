import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { Payment, PaymentDTO, UpdatePaymentDTO } from 'src/models/payment.model';
import { PaymentsService } from './payments.service';

@Controller('payments') // This makes the route /payments
export class PaymentsController {
    constructor(private readonly paymentService: PaymentsService) { }

    // CREATE payment
    @Post()
    async create(@Body() body: { createpaymentDto: PaymentDTO }): Promise<Payment[]> {
        return await this.paymentService.create(body.createpaymentDto);
    }

    // GET ALL payments
    @Get()
    async findAll(): Promise<Payment[]> {
        return await this.paymentService.findAll();
    }

    // GET a payment by ID
    @Get(':id')
    findOne(@Param('id') id: string): Promise<Payment> {
        return this.paymentService.findOne(+id);
    }

    // UPDATE a payment by ID
    @Patch(':id')
    update(@Param('id') id: string, @Body() updatepaymentDto: UpdatePaymentDTO): Promise<Payment[]> {
        return this.paymentService.update(+id, updatepaymentDto);
    }

    // DELETE a payment by ID
    @Delete(':id')
    remove(@Param('id') id: string): Promise<Payment[]> {
        return this.paymentService.remove(+id);
    }
}

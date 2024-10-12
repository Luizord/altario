import { PartialType } from '@nestjs/swagger';

export interface Payment {
    id: number;
    name: string;
    ammount: string;
    grid: string[][];
    code: string;
  }

  export class PaymentDTO {
    name: string;
    ammount: string;
    grid: string[][];
    code: string;
  }


export class UpdatePaymentDTO extends PartialType(PaymentDTO) {}
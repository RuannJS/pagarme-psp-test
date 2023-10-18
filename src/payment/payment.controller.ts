import { Controller, Get, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { TransactionDto } from './dto/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly Service: PaymentService) {}

  @Post()
  async createPayment(@Body() transaction: TransactionDto) {
    return await this.Service.createPayment(transaction);
  }

  @Get('/transactions')
  async getAllTransactions() {
    return await this.Service.getAllTransactions();
  }

  @Get('/payables')
  async getPayables() {
    return await this.Service.getPayables();
  }
}

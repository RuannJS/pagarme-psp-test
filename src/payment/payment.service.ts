import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { PayableStatus, PaymentMethod } from './dto/payment.dto';

interface TransactionParam {
  value: number;
  payment: PaymentMethod;
  card_number: string;
  card_owner: string;
  expire_date: string;
  verification_value: string;
}

@Injectable()
export class PaymentService {
  constructor(private readonly Prisma: PrismaService) {}

  async createPayment(transaction: TransactionParam) {
    const safetyStorage = transaction.card_number.slice(12);

    if (transaction.payment === PaymentMethod.debit_card) {
      const today = Date.now();
      const debitFee = 0.03;

      const payableValue = transaction.value - transaction.value * debitFee;

      const newDebitTransaction = await this.Prisma.transaction.create({
        data: {
          ...transaction,
          card_number: safetyStorage,
          payable: {
            create: {
              afterFeeValue: payableValue,
              status: PayableStatus.paid,
              payment_date: new Date(today),
            },
          },
        },
      });

      return newDebitTransaction;
    } else {
      const D30 = new Date();
      const nextMonth = new Date(new Date().setDate(D30.getDate() + 30));
      const creditFee = 0.05;

      const payableValue = transaction.value - transaction.value * creditFee;

      const newCreditTransaction = await this.Prisma.transaction.create({
        data: {
          ...transaction,
          card_number: safetyStorage,
          payable: {
            create: {
              afterFeeValue: payableValue,
              status: PayableStatus.waiting_funds,
              payment_date: nextMonth,
            },
          },
        },
      });

      return newCreditTransaction;
    }
  }

  async getAllTransactions() {
    return await this.Prisma.transaction.findMany({
      select: {
        card_owner: true,
        card_number: true,
        payment: true,
        value: true,
      },
    });
  }

  async getPayables() {
    const allPayables = await this.Prisma.payable.findMany();

    const waitingValues: number[] = [];
    const availableValues: number[] = [];

    allPayables.map((payable) => {
      if (payable.status === PayableStatus.paid) {
        availableValues.push(payable.afterFeeValue);
      } else if (payable.status === PayableStatus.waiting_funds) {
        waitingValues.push(payable.afterFeeValue);
      }
    });

    const availableInitialValue = 0;
    const availableSum = availableValues.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      availableInitialValue,
    );

    const waitingInitialValue = 0;
    const waitingSum = waitingValues.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      waitingInitialValue,
    );

    return { available: availableSum, waiting_funds: waitingSum };
  }
}

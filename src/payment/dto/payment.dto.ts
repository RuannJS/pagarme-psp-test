import {
  IsNumber,
  IsNotEmpty,
  IsEnum,
  IsString,
  IsCreditCard,
  Length,
} from 'class-validator';

export enum PaymentMethod {
  credit_card = 'credit_card',
  debit_card = 'debit_card',
}

export enum PayableStatus {
  paid = 'paid',
  waiting_funds = 'waiting_funds',
}

export class TransactionDto {
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsEnum(PaymentMethod)
  payment: PaymentMethod;

  @IsCreditCard()
  card_number: string;

  @IsString()
  @IsNotEmpty()
  card_owner: string;

  @IsString()
  @Length(5, 5)
  expire_date: string;

  @IsString()
  @Length(3, 3)
  verification_value: string;
}

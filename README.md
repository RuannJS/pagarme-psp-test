# Transaction Processing Service

The Transaction Processing Service is a backend application built with Nest.js and TypeScript. It allows you to process transactions, create payables, and provides a means for clients to check their balances. 

## Requirements

The service is designed to meet the following requirements:

1. **Transaction Processing:**
   - Receive transaction information, including the transaction value, description, payment method (debit_card or credit_card), card details, and cardholder information.
   - Return a list of created transactions, displaying only the last 4 digits of the card number for security.

2. **Payables Creation:**
   - For debit card transactions:
     - Create payables with a status of "paid" indicating that the client has received the amount.
     - Set the payment date (payment_date) as the transaction creation date (D+0).
   - For credit card transactions:
     - Create payables with a status of "waiting_funds" indicating that the client will receive the money in the future.
     - Set the payment date (payment_date) as the transaction creation date + 30 days (D+30).
   - Deduct a processing fee (fee) from the transaction amount:
     - 3% fee for debit card transactions.
     - 5% fee for credit card transactions.

3. **Balance Inquiry:**
   - Provide a method for clients to check their balance, displaying:
     - Available balance (disponível): The total amount received (payables with status "paid").
     - Waiting funds (a receber): The total amount yet to be received (payables with status "waiting_funds").

## Technologies Used

- Nest.js
- TypeScript
- Prisma
- MongoDB
- MongoDB Atlas

## Getting Started

To run the service locally, follow these steps:

1. Clone the repository to your local machine.

2. Install the project dependencies:

   ```bash
   npm install

3. Start the application:

   npm run start

4. The service will be accessible at http://localhost:3000.

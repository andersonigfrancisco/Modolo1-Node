const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

const customer = [];

function Middlewaress(request, response, next) {
  const { cpf } = request.headers;

  const customers = customer.find((custome) => custome.cpf === cpf);

  if (!customers)
    return response.status(400).json({ message: 'customer not found' });

  request.customers = customers;

  return next();
}

function getBalente(statement) {

  const balance = statement.reduce((acc, operation) => {
    
    if (operation.type === 'credit') {
      return acc + operation.amount;
    } else {
      return acc - operation.amount;
    }
  }, 0);

  return balance;
}

app.post('/account', (request, response) => {
  const { cpf, name } = request.body;

  const customerAlreadyExists = customer.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlreadyExists)
    return response.status(400).json({ message: 'customer already exists' });

  customer.push({ cpf, name, id: uuidv4(), statement: [] });

  return response
    .status(201)
    .json({ customer: customer[customer.length - 1], message: 'success' });
});

app.get('/statement', Middlewaress, (request, response) => {
  const { customers } = request;

  return response.json(customers.statement);
});

app.post('/deposit', Middlewaress, (request, response) => {
  const { description, amount } = request.body;

  const { customers } = request;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: 'credit',
  };

  customers.statement.push(statementOperation);

  return response.status(201).json({ customer: customers, message: 'success' });
});

app.post('/saque', Middlewaress, (request, response) => {
  const { amount } = request.body;

  const customers = request;

  const balance = getBalente(customers.statement);

  if (balance < amount)
    return response.status(400).json({ error: 'Insufficient found!' });

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: 'debit',
  };

  customers.statement.push(statementOperation);

  return response.status(201).json({ customer: customers, message: 'success' });
});

app.listen(3001);

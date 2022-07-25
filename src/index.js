const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

const customer = [];

function Middleware(request, response, next) {

  const { cpf } = request.headers;

  const customers = customer.find((custome) => custome.cpf === cpf);

  if (!customers)
    return response.status(400).json({ message: 'customer not found' });

  requeste.customers = customers;

  return next();
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

app.get('/statement', Middleware, (request, response) => {

  const { customers } = request;

  return response.json(customers.statement);
});

app.listen(3001);

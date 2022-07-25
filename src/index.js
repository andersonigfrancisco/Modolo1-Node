const express = require('express');
const {v4:uuidv4} = require('uuid')

const app = express();

app.use(express.json())

const customer = [];
/**
 * cpf:sting
 * name: string
 * id: uuid
 * statement: []
*/ 

app.post("/account",(request,response)=>{

  const {cpf,name} = request.body;

  const customerAlreadyExists = customer.some((customer)=>customer.cpf ===cpf);

  if(customerAlreadyExists)
    return response.status(400).json({message:'customer already exists'})
  

  customer.push({cpf,name,id:uuidv4(),statement:[]})

  return response.status(201).json({customer:customer[customer.length-1],message:'success'});
})

app.get("/statement/:cpf",(request,response)=>{

  const {cpf} = request.params;

  const customers = customer.find(customers=>customers.cpf===cpf);

  if(!customers)
    return response.status(400).json({message:'customer not found'})

  return response.json(customers.statement);

})


app.listen(3001);
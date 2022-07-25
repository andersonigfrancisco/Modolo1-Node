const express = require('express');

const app = express();

app.get('/', (req, resp) => {

  return resp.json({message:'Ola, Mundo!'})

})


app.listen(3001);
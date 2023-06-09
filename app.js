const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes/api')


const app = express()
const port = 3000



// middleware
app.use(bodyParser.json())
app.use(express.static('views'))
app.use('/api', routes)           // initialise routes


const server = app.listen(port, () =>
  console.log(`Server ready at: http://localhost:3000`)
)
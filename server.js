const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes/api')
const user_route = require('./routes/users')
const books_route = require('./routes/books')
const wishbooks_route = require('./routes/books')

const app = express()
const port = 5000


// middleware
app.use(bodyParser.json())
app.use(express.static('views'))


// initialise routes
app.use('/api', routes)                   
app.use('/users', user_route)   
app.use('/books', books_route)   
app.use('/wishedbooks', wishbooks_route)   


app.get("/api2", (req, res) => {
  res.json( { "users": ["Matos", "Muhammad", "Mahmud"] } )
})



const server = app.listen(port, () =>
  console.log(`Server ready at: http://localhost:5000`)
)
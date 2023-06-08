const express = require('express')
const bodyParser = require('body-parser')
const { PrismaClient } = require('@prisma/client')
const routes = require('./routes/api')

const prisma = new PrismaClient()
const app = express()
const port = 3000




app.use(bodyParser.json())
app.use(express.static('views'))


// initialise routes
app.use('/api', routes) 




// fetch all users
app.get('/users', async (req, res) => {
  console.log('There is a GET Request for all users')
  const users = await prisma.user.findMany()
  // res.status(200).json(users)   // ??
  res.json(users)     //INFO: you need to either send a res or end the res. otherwise browserwill hang
  //res.end() 
})

// fetch all books
app.get('/books', async (req, res) => {
  const books = await prisma.book.findMany()
  res.json(books)
})



// When a new user registers
app.post(`/signup`, async (req, res) => {
  console.log(req.body)
  const { name, email, company, wish} = req.body        
  console.log(name, email)
    // const postData = books
    //   ? books.map((book) => {
    //       return { title: book.title || undefined }
    //     })
    //   : []

  const result = await prisma.user.create({
    data: {
      name,
      email,
      company,
      wish,

      // books: {
      //   create: books,
      // },
    },
  })
  res.json(result)
})


// create a book 
app.post(`/bookCreate`, async (req, res) => {
  const { title, author, publisher, free, QRcode, ISBN } = req.body
  const result = await prisma.book.create({
    data: {
      title,
      author,
      publisher,
      free,
      QRcode,
      ISBN,  
    },
  })
  res.json(result)
}) 


//update data of a book (ToDo)
app.put('/book/:id/isFree', async (req, res) => {
  const { id } = req.params
  console.log(req.params)

  try {
    const book = await prisma.book.update({
      where: { id: Number(id) },
      data: {
        free: true
        },
    })

    res.json(book)
  } catch (error) {
    res.json({ error: `Book with ID ${id} does not exist in the database` })
  }
})

// app.put('/publish/:id', async (req, res) => {
//   const { id } = req.params

//   try {
//     const postData = await prisma.post.findUnique({
//       where: { id: Number(id) },
//       select: {
//         published: true,
//       },
//     })

//     const updatedPost = await prisma.post.update({
//       where: { id: Number(id) || undefined },
//       data: { published: !postData.published || undefined },
//     })
//     res.json(updatedPost)
//   } catch (error) {
//     res.json({ error: `Post with ID ${id} does not exist in the database` })
//   }
// })


// delete a book
app.delete(`/delete_book/:id`, async (req, res) => {
  const { id } = req.params
  const book = await prisma.book.delete({
    where: {
      id: Number(id),
    },
  })
  res.json(book)
})

// delete a user
app.delete(`/delete_user/:id`, async (req, res) => {
  const { id } = req.params
  const user = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  })
  res.json(user)
})


app.get('/user/:id/company', async (req, res) => {
  const { id } = req.params

  const drafts = await prisma.user
    .findUnique({
      where: {
        id: Number(id),
      },
    })
    .posts({
      where: { published: false },
    })

  res.json(drafts)
})

app.get(`/users/:id`, async (req, res) => {
  const { id } = req.params

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  })
  res.json(user)
})

// app.get('/feed', async (req, res) => {
//   const { searchString, skip, take, orderBy } = req.query

//   const or = searchString
//     ? {
//         OR: [
//           { title: { contains: searchString } },
//           { content: { contains: searchString } },
//         ],
//       }
//     : {}

//   const posts = await prisma.post.findMany({
//     where: {
//       published: true,
//       ...or,
//     },
//     include: { author: true },
//     take: Number(take) || undefined,
//     skip: Number(skip) || undefined,
//     orderBy: {
//       updatedAt: orderBy || undefined,
//     },
//   })

//   res.json(posts)
// })

const server = app.listen(port, () =>
  console.log(`Server ready at: http://localhost:3000`)
)
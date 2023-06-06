const express = require('express')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const app = express()
const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.use(express.static('views'))
 

  //GET Requests

  app.get('/users', async (req, res) => {
    console.log('There is a GET Request for all users')
    const users = await prisma.user.findMany()
    // res.status(200).json(users)   // ??
    res.json(users)     //INFO: you need to either send a res or end the res. otherwise browserwill hang
    //res.end()
  })

  app.get('/books', async (req, res) => {
    const users = await prisma.book.findMany()
    res.json(users)
  })


  app.post(`/signup`, async (req, res) => {
      const { name, email, books } = req.body
    
      const postData = books
        ? books.map((book) => {
            return { title: book.title || undefined }
          })
        : []
    
      const result = await prisma.user.create({
        data: {
          name,
          email,
          books: {
            create: postData,
          },
        },
      })
      res.json(result)
    })
  
  app.post(`/bookCreate`, async (req, res) => {
    const { title, author } = req.body
    const result = await prisma.book.create({
      data: {
        title,       
        author
      },
    })
    res.json(result)
  })
  
  // app.put('/post/:id/views', async (req, res) => {
  //   const { id } = req.params
  
  //   try {
  //     const post = await prisma.post.update({
  //       where: { id: Number(id) },
  //       data: {
  //         viewCount: {
  //           increment: 1,
  //         },
  //       },
  //     })
  
  //     res.json(post)
  //   } catch (error) {
  //     res.json({ error: `Post with ID ${id} does not exist in the database` })
  //   }
  // })
  
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
  
  // app.delete(`/post/:id`, async (req, res) => {
  //   const { id } = req.params
  //   const post = await prisma.post.delete({
  //     where: {
  //       id: Number(id),
  //     },
  //   })
  //   res.json(post)
  // })
  

  
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

const server = app.listen(3000, () =>
  console.log(`Server ready at: http://localhost:3000`)
)
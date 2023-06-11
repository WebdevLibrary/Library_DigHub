const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// mount route handlers onto router object
// '/api' we dont need 




// fetch all users
router.get('/users', async (req, res) => {
    console.log('There is a GET Request for all users')
    const users = await prisma.user.findMany()
    // res.status(200).json(users)   // ??
    res.json(users)     //INFO: you need to either send a res or end the res. otherwise browserwill hang
    //res.end() 
  })
  
// fetch all books
    router.get('/books', async (req, res) => {
    const books = await prisma.book.findMany()
    res.json(books)
})



// create a user 
router.post(`/signup`, async (req, res) => {
    console.log(req.body)
    const { name, email, company, wish, books} = req.body        
    console.log(books)
        // const postData = books
        //   ? books.map((book) => {
        //       return { title: book.title || undefined }
        //     })
        //   : []

    try {
        const result = await prisma.user.create({
            data: {
                name,
                email,
                company,
                wish,            
                books: {
                  create: [{
                    title: books.title
                  }]
                },
            },
        })
        res.json(result)
    } catch(error) {
        //console.log("error:::" , error)
        res.json({error: `A User with ${error?.meta?.target} exist already`})  
        //res.json(error)       
    }    
})
  
  
// create a book 
router.post(`/bookCreate`, async (req, res) => {
    const { title, author, publisher, free, QRcode, ISBN } = req.body

    try {
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
    } catch(error) {
        console.log("error:;::" , error)
        res.json({error: `A book with ${error?.meta?.target} exist already`})  
        //res.json(error)       
    }        
}) 


//update data of a user 
router.put('/user/:id', async (req, res) => {
    const { id } = req.params
    const{ name, company, wish, books } = req.body
    console.log("books: ", books)

    try {
        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: {
                update: books
            },
        })
        res.json(user)
    } catch (error) {
        res.json({ error: `Error occured with user ID ${id}` })
    }   
})


//update data of a book 
router.put('/book/:id', async (req, res) => {
    const { id } = req.params
    const{ title, author, publisher, free, QRcode, ISBN } = req.body
    console.log(req.body)

    try {
        const book = await prisma.book.update({
        where: { id: Number(id) },
        data: {
            title,
            author,
            publisher,
            free,
            QRcode,
            ISBN,
        },
        })
        res.json(book)
    } catch (error) {
        res.json({ error: `Book with ID ${id} does not exist in the database` })
    }   
})



  
  // router.put('/publish/:id', async (req, res) => {
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
  
  
// fetch a book by QR code





// delete a book
router.delete(`/delete_book/:id`, async (req, res) => {
    const { id } = req.params
    const book = await prisma.book.delete({
        where: {
        id: Number(id),
        },
    })
    res.json(book)
})

// delete a user
router.delete(`/delete_user/:id`, async (req, res) => {
    const { id } = req.params
    const user = await prisma.user.delete({
        where: {
        id: Number(id),
        },
    })
    res.json(user)
})

  
router.get('/user/:id/company', async (req, res) => {
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
  
router.get(`/users/:id`, async (req, res) => {
    const { id } = req.params

    const user = await prisma.user.findUnique({
        where: { id: Number(id) },
    })
    res.json(user)
})
  
  // router.get('/feed', async (req, res) => {
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




  


module.exports = router; 
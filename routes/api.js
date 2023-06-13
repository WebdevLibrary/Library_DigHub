const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// mount route handlers onto router object
// '/api' we dont need 




// get all users
router.get('/users', async (req, res) => {
    console.log('There is a GET Request for all users')
    const users = await prisma.user.findMany()
    // res.status(200).json(users)   // ??
    res.json(users)     //INFO: you need to either send a res or end the res. otherwise browserwill hang
    //res.end() 
  })
  
// get all books
    router.get('/books', async (req, res) => {
    const books = await prisma.book.findMany()
    res.json(books)
})

// get all wishlist
router.get('/wishlist', async (req, res) => {
    const wishLists = await prisma.wishlist.findMany()
    res.json(wishLists)
})


// get one user  
router.get(`/user/:id`, async (req, res) => {
    const { id } = req.params

    const user = await prisma.user.findUnique({
        where: { id: Number(id) },
    })
    res.json(user)
})

// get one book  
router.get(`/book/:id`, async (req, res) => {
    const { id } = req.params

    const book = await prisma.book.findUnique({
        where: { id: Number(id) },
    })
    res.json(book)
})

// get one book from wishlist
router.get(`/wishbook/:id`, async (req, res) => {
    const { id } = req.params

    const wishbook = await prisma.book.findUnique({
        where: { id: Number(id) },
    })
    res.json(wishbook)
})




// create a user 
router.post(`/signup`, async (req, res) => {
    console.log(req.body)
    const { name, email, company, wish, books} = req.body        
    console.log(books)

    // code to make a array of books if there is any and if zero then returns an empty array
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
    const { title, author, publisher, isFree, QRcode, ISBN } = req.body

    try {
        const result = await prisma.book.create({
            data: {
                title,
                author,
                publisher,
                isFree,
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



// create a book for the wishlist
router.post(`/wishListCreate`, async (req, res) => {
    const { title, author, publisher, QRcode, ISBN } = req.body

    try {
        const result = await prisma.wishlist.create({
            data: {
                title,
                author,
                publisher,               
                QRcode,
                ISBN,  
            },
        })
        res.json(result)
    } catch(error) {
        console.log("error:" , error)
        res.json({error: `Error with the book with id: ${error?.meta?.target} `})  
        //res.json(error)       
    }        
}) 





// create a wish book 
router.post(`/wishabook`, async (req, res) => {
    const { title, author, publisher, QRcode, ISBN } = req.body

    try {
        const result = await prisma.book.create({
            data: {
                title,
                author,
                publisher,
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
    const{ name, company, wish } = req.body   

    try {
        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: {
                name,
                company,
                wish
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
    const{ title, author, publisher, isFree, QRcode, ISBN } = req.body
    console.log(req.body)

    try {
        const book = await prisma.book.update({
            where: { id: Number(id) },
            data: {
                title,
                author,
                publisher,
                isFree,
                QRcode,
                ISBN,
            },
        })
        res.json(book)
    } catch (error) {
        res.json({ error: `Book with ID ${id} does not exist in the database` })
    }   
})



//connect a book to a user (when a user borrows a book)

router.put('/book2user/:id', async (req, res) => {
    const userID  = req.params.id   
    const bookID  = req.body.id   

    // console.log(bookID)
    // console.log(req.params)

    try {
        const user = await prisma.user.update({
            where: { id: Number(userID) },
            data: {
               books: {
                connect: {
                    id: Number(bookID)
                }
               }
            },
        })
        //if the book is borrowed, make is free false
        const book = await prisma.book.update({
            where: { id: Number(bookID) },
            data: {
                isFree: false,
               
            },
        })

        res.json(user)
    } catch (error) {
        res.json({ error: `Error occured with user ID ${userID}` })
    }   
})


//disconnect a book from a user

router.put('/NOTbook2user/:id', async (req, res) => {
    const userID  = req.params.id   
    const bookID  = req.body.id   

    // console.log(bookID)
    // console.log(req.params)

    try {
        const user = await prisma.user.update({
            where: { id: Number(userID) },
            data: {
               books: {
                disconnect: {
                    id: Number(bookID)
                }
               }
            },
        })

        //if the book is given back, make is free true
        const book = await prisma.book.update({
            where: { id: Number(bookID) },
            data: {
                isFree: true,
               
            },
        })
        res.json(user)
    } catch (error) {
        res.json({ error: `Error occured with user ID ${userID}` })
    }   
})


//




  
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

// delete a wish book
router.delete(`/delete_wishbook/:id`, async (req, res) => {
    const { id } = req.params
    const wishBook = await prisma.wishlist.delete({
        where: {
        id: Number(id),
        },
    })
    res.json(wishBook)
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
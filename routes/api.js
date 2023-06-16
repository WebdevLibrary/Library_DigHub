const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// mount route handlers onto router object
// '/api' we dont need 


// for search learn prisma "contains"

// ToDo: for each endpoint / another file   "Controller File"

// get all users
router.get('/users', async (req, res) => {
    //console.log('There is a GET Request for all users')
    const users = await prisma.user.findMany()
    // res.status(200).json(users)   // ??
    res.status(200).json(users)     //INFO: you need to either send a res or end the res. otherwise browserwill hang
    //res.end() 
  })
  
// get all books
router.get('/books', async (req, res) => {
    const books = await prisma.book.findMany()
    res.status(200).json(books)
})

// get all wishlist
router.get('/wishlist', async (req, res) => {
    const wishLists = await prisma.wishlist.findMany()
    res.status(200).json(wishLists)
})


// get one user  
router.get(`/user/:id`, async (req, res) => {
    const { id } = req.params

    const user = await prisma.user.findUnique({
        where: { id: Number(id) },
    })
    res.status(200).json(user)
})

// get one book by ID  
router.get(`/book/:id`, async (req, res) => {
    const { id } = req.params

    const book = await prisma.book.findUnique({
        where: { id: Number(id) },
    })
    res.status(200).json(book)
})


// get a book by QR code

router.get(`/bookgetQR/:bookQR`, async (req, res) => {
    const { bookQR } = req.params
   // console.log("bookqr =", bookQR)
   
    try {
        const book = await prisma.book.findUnique({
            where: { QRcode: bookQR },
        })
        res.status(200).json(book)
    } catch(error){
        res.status(500).json(error)
    }   
})



// get one book by name    
router.get(`/bookgetName/:bookTitle`, async (req, res) => {
    const { bookTitle } = req.params
   
    try {
        const book = await prisma.book.findMany({
            where: { title: bookTitle},
        })
        res.status(200).json(book)
    } catch(error){
        res.status(500).json(error)
    }   
})



// get one book from wishlist
router.get(`/wishbook/:id`, async (req, res) => {
    const { id } = req.params

    const wishbook = await prisma.wishlist.findUnique({
        where: { id: Number(id) },
    })
    res.status(200).json(wishbook)
})




// create a user 
router.post(`/signup`, async (req, res) => {
    console.log(req.body)
    const { name, email, company, wish, books } = req.body        
    console.log(books)

    // ToDo:
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
        res.status(200).json(result)
    } catch(error) {
        //console.log("error:::" , error)
        res.status(500).json({error: `A User with ${error?.meta?.target} exist already`})  
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
        res.status(200).json(result)
    } catch(error) {
        console.log("error:;::" , error)
        res.status(500).json({error: `A book with ${error?.meta?.target} exist already`})  
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
        res.status(200).json(result)
    } catch(error) {
        console.log("error:" , error)
        res.status(500).json({error: `Error with the book with id: ${error?.meta?.target} `})  
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
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: `Error occured with user ID ${id}` })
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
        res.status(200).json(book)
    } catch (error) {
        res.status(500).json({ error: `Book with ID ${id} does not exist in the database` })
    }   
})



//connect a book to a user (when a user borrows a book with QRcode)

router.put('/book2user/:id1/:QR', async (req, res) => {
    const userID  = req.params.id1   
    const bookQR  = req.params.QR  

    // console.log(bookID)
    // console.log(req.params)

    try {
        const user = await prisma.user.update({
            where: { id: Number(userID) },
            data: {
               books: {
                connect: {
                    QRcode: bookQR
                }
               }
            },
        })
        //if the book is borrowed, make is free false
        const book = await prisma.book.update({
            where: { QRcode: bookQR },
            data: {
                isFree: false,
               
            },
        })
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: `Error occured with user ID ${userID}` })
    }   
})


//disconnect a book from a user
// ToDo: book QR Code

router.put('/NOTbook2user/:id1/:id2', async (req, res) => {
    const userID  = req.params.id1   
    const bookID  = req.params.id2  

    // console.log(bookID)
    // console.log(req.params)

    try {
        
        // ToDo: if(isFree)  borrow if isFre true and give back if  is fedfad

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
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: `Error occured with user ID ${userID}` })
    }   
})



// ToDo:  which book have a given user


// ToDo:  which users have a given book


// ToDo:  which users have a given wish list and vice versa 



// move a book from wishlist to normal book DB

router.put('/wish2book/:id', async (req, res) => {
    const wishedBookID  = req.params.id
    console.log(wishedBookID)
   
    // console.log(bookID)
    // console.log(req.params)

    try {
        const wishbook = await prisma.wishlist.findUnique({
            where: { id: Number(wishedBookID) },
        })

        // ToDo: delete this book with this id
    
        //console.log(wishbook)

        const bookTakenFromWishList = await prisma.book.create({
            data: {
                title: wishbook.title,
                author: wishbook.author,
                publisher: wishbook.publisher,
                isFree: true,
                QRcode: wishbook.QRcode,
                ISBN: wishbook.ISBN,  
            },
        })
        res.status(200).json(bookTakenFromWishList)
    } catch (error) {
        res.status(500).json({ error: `Error occured with book ID ${wishedBookID}` })
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
  
  


// delete a book
router.delete(`/delete_book/:id`, async (req, res) => {
    const { id } = req.params
    const book = await prisma.book.delete({
        where: {
        id: Number(id),
        },
    })
    res.status(200).json(book)
})

// delete a user
router.delete(`/delete_user/:id`, async (req, res) => {
    const { id } = req.params
    const user = await prisma.user.delete({
        where: {
        id: Number(id),
        },
    })
    res.status(200).json(user)
})

// delete a wish book
router.delete(`/delete_wishbook/:id`, async (req, res) => {
    const { id } = req.params

    const wishBook = await prisma.wishlist.delete({
        where: {
            id: Number(id),
        },
    })
    res.status(200).json(wishBook)
})

  

//example query code
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
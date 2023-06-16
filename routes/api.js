const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// mount route handlers onto router object
// '/api' we dont need 

// for search learn prisma "contains"





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
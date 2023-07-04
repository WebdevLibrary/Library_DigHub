const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const apiController = require('../controllers/apiController')




// (when a user borrows a book with QRcode)
router.put('/book2user/:id1/:QR', apiController.connectBook2User)      


//when user gives the book back with QR Code
router.put('/NOTbook2user/:id1/:QR', apiController.disconnectBookFromUser)

// move a book from wishlist to normal book DB
router.put('/wished2book/:id', apiController.moveBookFromWishList2BookDB)

// users makes a wish list, a wished book will be connected to him 
router.put('/wished2book/:userID/:wishBookID', apiController.connectwishedbook2user)

//get the books of a given user by ID
router.get('/getbooksofusers/:id', apiController.getBooksOfUsersByID)


// get the borrowers of a book byID
router.get('/getborrowersofbooks/:id', apiController.getBorrowersOfBooksByID)


//get the wished books of a given user by ID 
router.get('/getwishlistofusers/:id', apiController.getWishesOfUsers)






  
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
//       data: { published: !postData.published || undefined },      ///ToDo:   ///// why "!"
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
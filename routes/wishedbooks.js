const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();




// get all wishlist
router.get('/wishes', async (req, res) => {
  const wishLists = await prisma.wishlist.findMany()
  res.status(200).json(wishLists)
})





// get one book from wishlist
router.get(`/wishbook/:id`, async (req, res) => {
  const { id } = req.params

  const wishbook = await prisma.wishlist.findUnique({
      where: { id: Number(id) },
  })
  res.status(200).json(wishbook)
})





// create a book for the wishlist
router.post(`/`, async (req, res) => {
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








// delete a wish book
router.delete(`/:id`, async (req, res) => {
  const { id } = req.params

  const wishBook = await prisma.wishlist.delete({
      where: {
          id: Number(id),
      },
  })
  res.status(200).json(wishBook)
})






  module.exports = router; 
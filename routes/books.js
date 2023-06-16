const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();




// get all books
router.get('/', async (req, res) => {
  const books = await prisma.book.findMany()
  res.status(200).json(books)
})
  

// get one book by ID  
router.get(`/:id`, async (req, res) => {
  const { id } = req.params

  const book = await prisma.book.findUnique({
      where: { id: Number(id) },
  })
  res.status(200).json(book)
})


// get a book by QR code
router.get(`/bookgetq/:bookQR`, async (req, res) => {
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


// create a book 
router.post(`/`, async (req, res) => {
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


//update data of a book 
router.put('/:id', async (req, res) => {
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





// delete a book
router.delete(`/:id`, async (req, res) => {
  const { id } = req.params
  const book = await prisma.book.delete({
      where: {
      id: Number(id),
      },
  })
  res.status(200).json(book)
})




module.exports = router; 
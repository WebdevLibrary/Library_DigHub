const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const userController = require('../controller/user_route')



// get all users
router.get('/', userController.getAllUsers)
  

// get one user  
router.get(`/:id`, async (req, res) => {
    const { id } = req.params

    const user = await prisma.user.findUnique({
        where: { id: Number(id) },
    })
    res.status(200).json(user)
})






// create a user 
router.post(`/`, async (req, res) => {
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


//update data of a user 
router.put('/:id', async (req, res) => {
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




// delete a user
router.delete(`/:id`, async (req, res) => {
    const { id } = req.params
    const user = await prisma.user.delete({
        where: {
        id: Number(id),
        },
    })
    res.status(200).json(user)
})



module.exports = router; 
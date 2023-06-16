const express = require('express');
const router = express.Router();
const bookController = require('../controller/bookController')




router.get('/', bookController.getAllBooks)  
router.get(`/:id`, bookController.getOneBookByID)
router.get(`/bookgetqr/:bookQR`, bookController.getOneBookByQRcode)  
router.get(`/bookgetName/:bookTitle`, bookController.getOneBookByName) 
router.post(`/`, bookController.createABook) 
router.put('/:id', bookController.createABook)
router.delete(`/:id`,bookController.deleteABook )




module.exports = router; 
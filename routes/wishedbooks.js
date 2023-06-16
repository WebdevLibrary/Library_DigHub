const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const wishedBookController = require('../controller/wishedBookController')





router.get('/', wishedBookController.getAllWishlist)
router.get(`/:id`, wishedBookController.getOneBookFromWishList)
router.post(`/`, wishedBookController.createABookForWishList) 
router.delete(`/:id`, wishedBookController.deleteABookInWishList )






module.exports = router; 
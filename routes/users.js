const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const userController = require('../controller/userController')





router.get('/', userController.getAllUsers)
router.get(`/:id`, userController.getOneUser )
router.post(`/`, userController.createAUser )
router.put('/:id', userController.updateAUser)
router.delete(`/:id`, userController.deleteAUser)



module.exports = router; 
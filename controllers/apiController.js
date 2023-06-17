const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



const connectBook2User = async (req, res) => {
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
}



// ToDo: disconnet using QR Code
const disconnectBookFromUser = async (req, res) => {
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
}




const moveBookFromWishList2BookDB = async (req, res) => {
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
}








module.exports = {
      connectBook2User,
      disconnectBookFromUser,
      moveBookFromWishList2BookDB
}
const { PrismaClient } = require('@prisma/client')
const { userData, bookData } = require('./fakeData.js') 

const prisma = new PrismaClient()


async function main() {
  console.log(`Deleting the old records and start seeding ...`)
  await prisma.user.deleteMany({})
  await prisma.book.deleteMany({})

  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }

  for (const u of bookData) {
    const book = await prisma.book.create({
      data: u,
    })
    console.log(`Created book with id: ${book.id}`)
  }
  // const user = await prisma.user.create({
  //   data: {
  //     name: "Gordan Freeman", 
  //     books: {
  //       create: [
  //         {
  //           title: "book001"
  //         }
  //       ]
  //     }

  //   }
  // })

  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
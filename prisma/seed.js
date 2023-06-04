const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const userData = [
  {
    name: 'Gordon Freeman',
    email: 'freeman@valve.com',
    books: {
      create: [
        {
          title: 'Book001',          
          free: false,
        },
        {
          title: 'Book002',
          free: false
        }
      ],
    },
  },
  {
    name: 'Alyx',
    email: 'alyx@valve.com',
    books: {
      create: [
        {
          title: 'Book003',          
          free: false,
        },
        {
          title: 'Book004',
          free: false
        }
      ],
    },
  },

]

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
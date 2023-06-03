const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const userData = [
  {
    name: 'Gordon Freeman',
    email: 'freeman@valve.com',
    books: {
      create: [
        {
          title: 'Book005',          
          free: false,
        },
        {
          title: 'Book006',
          free: false
        }
      ],
    },
  }
]

async function main() {
  console.log(`Start seeding ...`)
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

const userData = [
    {
      name: 'Gordon Freeman',
      email: 'freeman@valve.com',
      company: 'Valve',
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
      company: 'Valve',
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

const bookData = [
{
    title: 'The Alchemist',
},
{
    title: 'Bezelye',
},
]


module.exports.userData = userData
module.exports.bookData = bookData
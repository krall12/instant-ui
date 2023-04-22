import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  // create the first user
  const user = await prisma.user.create({
    data: {
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
    },
  })

  // create 1000 fake todos for the first user in a promise.all
  await Promise.all(
    Array.from({ length: 1000 }).map(async (_, i) => {
      return prisma.todo.create({
        data: {
          title: faker.lorem.sentence(),
          body: faker.lorem.paragraphs(),
          completed: faker.datatype.boolean(),
          author: {
            connect: {
              id: user.id,
            },
          },
        },
      })
    })
  )
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

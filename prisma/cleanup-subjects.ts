import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// List of correct subject names (from seed.ts)
const validSubjects = [
  'JavaScript in 2 Days',
  'Python Crash Course',
  'Digital Marketing Basics',
  'Excel for Beginners',
  'Speed Reading in 3 Days',
]

async function main() {
  // Delete subjects that are not in the valid list
  const deleted = await prisma.subject.deleteMany({
    where: {
      name: {
        notIn: validSubjects,
      },
    },
  })
  console.log(`Deleted ${deleted.count} invalid subjects.`)

  // Optionally, fix case/spacing issues for valid subjects
  for (const name of validSubjects) {
    const subject = await prisma.subject.findFirst({ where: { name: { equals: name, mode: 'insensitive' } } })
    if (subject && subject.name !== name) {
      await prisma.subject.update({ where: { id: subject.id }, data: { name } })
      console.log(`Normalized subject name to: ${name}`)
    }
  }

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}) 
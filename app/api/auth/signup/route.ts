import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, password } = body
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        hashedPassword,
      },
    })
    return NextResponse.json({ message: "User created successfully." }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
} 
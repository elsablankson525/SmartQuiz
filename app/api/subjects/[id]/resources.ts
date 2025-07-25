import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // @ts-ignore
    const resources = await prisma.resource.findMany({
      where: { subjectId: params.id },
    })
    return NextResponse.json({ resources })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 })
  }
} 
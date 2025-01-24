import { PrismaClient } from "@prisma/client"
import { Teacher } from "@prisma/client"
const prisma = new PrismaClient()

export function getAllTeachers() {
    return prisma.teacher.findMany()
}
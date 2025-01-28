import { PrismaClient } from "@prisma/client"
import { Student } from "@prisma/client"
const prisma = new PrismaClient()

export function getAllStudents() {
    return prisma.student.findMany()
}

export function createStudent(student: Student) {
    return prisma.student.create({
        data: student
    })
}

export function editStudent(id: number, newInfo: Student) {
    return prisma.student.update({
        where: {
            id
        },
        data: newInfo
    })
}

export function deleteStudent(id: number) {
    return prisma.student.delete({
        where: {
            id
        }
    })
}
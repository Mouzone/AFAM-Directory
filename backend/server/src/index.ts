import { Hono } from 'hono'
import { createStudent, deleteStudent, editStudent, getAllStudents } from "../../prisma/student"
import { Student } from '@prisma/client'
const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get("/students", async (c) => {
    const students: Student[] = await getAllStudents()
    return c.json(students)
})

app.post("/students", async (c) => {
    const student: Student = await c.req.json() as Student
    await createStudent(student)
})

app.put("/students", async (c) => {
    const student: Student = await c.req.json()
    await editStudent(student["id"], student)
})

app.delete("/students", async (c) => {
    const id: number = await c.req.json()
    await deleteStudent(id)
})
export default app

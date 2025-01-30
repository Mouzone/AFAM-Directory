import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createStudent, deleteStudent, editStudent, getAllStudents } from "../../prisma/student"
import { getAllTeachers } from "../../prisma/teacher"
import { Student, Teacher } from '@prisma/client'
import { initializeFirebaseAdmin } from './fireside';

const app = new Hono()
const admin = initializeFirebaseAdmin();

app.use('/*', cors())

app.use(async (c, next) => {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({error: 'Unauthorized'}, 401)
    }

    const idToken = authHeader.split("Bearer ")[1]
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        console.log(decodedToken)
        await next()
    } catch (error) {
        return c.json({ error: "Unauthorized"}, 401)
    }
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get("/teachers", async (c) => {
    const teachers: Teacher[] = await getAllTeachers()
    return c.json(teachers)
})
app.get("/students", async (c) => {
    const students: Student[] = await getAllStudents()
    return c.json(students)
})

app.post("/students", async (c) => {
    const student: Student = await c.req.json() as Student
    console.log(student)
    const result = await createStudent(student)
    return c.json(result)
})

app.put("/students", async (c) => {
    const student: Student = await c.req.json()
    console.log(student)
    const { id, afamTeacher, ...studentWithoutId } = student;
    const result = await editStudent(id, studentWithoutId)
    return c.json(result)
})

app.delete("/students", async (c) => {
    const id: number = await c.req.json()
    const result = await deleteStudent(id)
    return c.json(result)
})

export default app

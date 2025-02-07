import { getFunctions, httpsCallable } from "firebase/functions"

const functions = getFunctions()
export const addStudent = httpsCallable(functions, "addStudent")
export const editStudent = httpsCallable(functions, "editStudent")
export const getStudents = httpsCallable(functions, "getStudents")
export const getTeachers = httpsCallable(functions, "getTeachers")

import { Request, Response } from 'express'
import { StudentDatabase } from '../database/StudentDatabase'
import { Student } from '../models/Student'
import { StudentDB } from '../types'

export class StudentController {
    public getUsers = async (req: Request, res: Response) => {
        try {
            const q = req.query.q as string | undefined

            const studentDatabase = new StudentDatabase()
            const studentDB = await studentDatabase.findStudents(q)

            const students: Student[] = studentDB.map((studentDB) => new Student(
                studentDB.id,
                studentDB.name,
                studentDB.email,
                studentDB.classroom,
                studentDB.created_at
            ))

            res.status(200).send(students)
        } catch (error) {
            console.log(error)

            if (req.statusCode === 200) {
                res.status(500)
            }

            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public postStudent = async (req: Request, res: Response) => {
        try {
            const { id, name, email, classroom } = req.body

            if (typeof id !== "string") {
                res.status(400)
                throw new Error("'id' deve ser string")
            }

            if (typeof name !== "string") {
                res.status(400)
                throw new Error("'name' deve ser string")
            }

            if (typeof email !== "string") {
                res.status(400)
                throw new Error("'email' deve ser string")
            }

            if (typeof classroom !== "string") {
                res.status(400)
                throw new Error("'classroom' deve ser string")
            }

            const studentDatabase = new StudentDatabase()
            const studentDBExists = await studentDatabase.findStudentById(id)

            if (studentDBExists) {
                res.status(400)
                throw new Error("'id' já existe")
            }

            const newStudent = new Student(
                id,
                name,
                email,
                classroom,
                new Date().toISOString()
            )

            const newStudentDB: StudentDB = {
                id: newStudent.getId(),
                name: newStudent.getName(),
                email: newStudent.getEmail(),
                classroom: newStudent.getClassroom(),
                created_at: newStudent.getCreatedAt()
            }

            await studentDatabase.insertStudent(newStudentDB)

            const result = {
                message: "Aluno(a) cadastrado(a) com sucesso!",
                newStudent
            }

            res.status(201).send(result)
        } catch (error) {
            console.log(error)

            if (req.statusCode === 200) {
                res.status(500)
            }

            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public putStudentById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const newName = req.body.name
            const newEmail = req.body.email
            const newClassroom = req.body.classroom

            if (!newName && !newEmail && !newClassroom) {
                res.status(400);
                throw new Error("'name, email e classroom' deve ser string")
            }

            if (id !== undefined) {
                if (typeof id !== "string") {
                    res.status(400);
                    throw new Error("'id' deve ser string")
                }
            }

            if (newName !== undefined) {
                if (typeof newName !== "string") {
                    res.status(400);
                    throw new Error("'name' deve ser string")
                }
            }

            if (newEmail !== undefined) {
                if (typeof newEmail !== "string") {
                    res.status(400)
                    throw new Error("'email' deve ser string")
                }
            }

            if (newClassroom !== undefined) {
                if (typeof newClassroom !== "string") {
                    res.status(400)
                    throw new Error("'classroom' deve ser string")
                }
            }

            const studentDatabase = new StudentDatabase()
            const student = await studentDatabase.findStudentById(id)

            if (!student) {
                res.status(404);
                throw new Error("Aluno(a) não encontrado")
            }

            const updateStudent = {
                id: id || student.id,
                name: newName || student.name,
                email: newEmail || student.email,
                classroom: newClassroom || student.classroom,
                created_at: student.created_at,
            }

            await studentDatabase.updatedStudent(id, updateStudent)

            res.status(200).send({
                message: "Dados do aluno(a) atualizado com sucesso!"
            })
        } catch (error) {
            console.error(error)

            if (req.statusCode === 200) {
                res.status(500)
            }

            if (error instanceof Error) {
                res.send({
                    message: error.message,
                })
            } else {
                res.send({
                    message: "Erro inesperado",
                })
            }
        }
    }

    public deleteStudentById = async (req: Request, res: Response) => {
        try {
            const idToDelete = req.params.id;

            if (typeof idToDelete !== "string") {
                res.status(400);
                throw new Error("'id' deve ser string");
            }

            const studentDatabase = new StudentDatabase();
            await studentDatabase.deleteStudentById(idToDelete);

            res.status(201).send("Aluno(a) deletado(a) com sucesso!");
        } catch (error) {
            console.log(error);

            if (req.statusCode === 200) {
                res.status(500);
            }

            if (error instanceof Error) {
                res.send(error.message);
            } else {
                res.send("Erro inesperado");
            }
        }
    }
}
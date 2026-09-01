import express from 'express'
import cors from 'cors'
import todoRouter from './routes/todoRouter.js'
import userRouter from "./routes/userRouter.js"
import { pool } from '../helper/db.js'
import { auth } from '../helper/auth.js'
import { Router } from 'express'
import { getTasks } from '../controllers/TaskController.js'
const router = Router()
router.get("/",getTasks)


const port = process.env.PORT || 3001
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/tasks',todoRouter)
app.use('/users',userRouter)

app.listen(port)

app.use((err,req,res,next) => {
 const statusCode = err.status || 500
 res.status(statusCode).json({
 error: {
 message: err.message,
 status: statusCode
 }
 })
})

app.get('/tasks', (req, res) => {
pool.query('SELECT * FROM task', (err, result) => {
if (err) {
return res.status(500).json({ error: 'Internal server error' })
}
res.status(200).json(result.rows)
})
})
app.listen(port, () => {
})
app.post('/tasks', (req, res) => {
const pool = openDb()
const { task } = req.body
if (!task) {
return res.status(400).json({error: 'Task is required'})
}
pool.query('insert into task (description) values ($1) returning *',
[task.description],
(err, result) => {
if (err) {
return res.status(500).json({ error: 'Internal server error' })
}
res.status(201).json({id: result.rows[0].id, description: task.description})
})
})
app.delete('/tasks/:id', (req, res) => {
const pool = openDb()
const { id } = req.params
console.log(`Deleting task with id: ${id}`)
pool.query('delete from task WHERE id = $1',
[id], (err, result) => {
if (err) {
console.error(err.message)
return res.status(500).json({ error: 'Internal server error' })
}
if (result.rowCount === 0) {
return res.status(404).json({error: 'Task not found'})
}
return res.status(200).json({id:id})
})
})
router.delete('/:id', (req, res,next) => {
 const { id } = req.params
 pool.query('delete from task WHERE id = $1',
 [id],
 (err, result) => {
 if (err) {
 return next(err)
 }
 if (result.rowCount === 0) {
 const error = new Error('Task not found')
 error.status = 404
 return next(error)
 }
 return res.status(200).json({id:id})
 })
})
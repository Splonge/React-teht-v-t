import { Router } from 'express'
import {
  getTasks,
  createTask,
  deleteTask
} from '../controllers/TaskController.js'
import { auth } from '../helper/auth.js'

const router = Router()

router.get('/', getTasks)
router.post('/', auth, createTask)
router.delete('/:id', auth, deleteTask)

export default router
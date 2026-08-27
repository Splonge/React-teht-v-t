import { pool } from '../helper/db.js'
import { Router } from 'express'
const router = Router()
router.get('/', (req, res) => {
pool.query('SELECT * FROM task', (err, result) => {
if (err) {
return res.status(500).json({ error: 'Internal server error' })
}
res.status(200).json(result.rows)
})
})
// Other routes (create, delete) here
export default router
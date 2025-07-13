import express from 'express'
import db from '../db.js'

const router = express.Router()

// Get all todos for logged-in user
router.get('/', (req, res) => { 
    const getToDos = db.prepare('SELECT * FROM todo WHERE user_id = ?')
    const todos = getToDos.all(req.userId)
    res.json(todos)
})

// Create a new todo
router.post('/', (req, res) => { })

// Update a todo
router.put('/:id', (req, res) => { })

// Delete a todo
router.delete('/:id', (req, res) => { })

export default router
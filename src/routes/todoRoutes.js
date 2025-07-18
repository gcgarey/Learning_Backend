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
router.post('/', (req, res) => { 
    const { task } = req.body
    const insertTodo = db.prepare(`INSERT INTO todo (user_id, task) VALUES (?, ?)`)
    const result = insertTodo.run(req.userId, task)

    res.json({id: result.lastInsertRowid, task, completed: 0})
})

// Update a todo
router.put('/:id', (req, res) => { 
    const { completed } = req.body 
    const { id } = req.params
    const { page } = req.query

    const updatedTodo = db.prepare(`UPDATE todo SET completed = ? WHERE id = ?`)
    updatedTodo.run(completed, id)

    res.json({message: "Todo completed"})
})

// Delete a todo
router.delete('/:id', (req, res) => {
    const { id } = req.params
    const userId = req.userId
    const deleteTodo = db.prepare(`DELETE FROM todo WHERE id = ? AND user_id = ?`)
    deleteTodo.run(id, userId)

    res.send({ message: "Todo completed!"})
 })

export default router
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

// Register a new user endpoint /auth/register
router.post('/register', (req, res) => {
    const { username, password } = req.body
    // Save username and an irreversibly encrypted password to the database
    // save bree@gmail.com | fjskadjfsajf;oajsfwfij0i3u0w

    //encrypt the password
    const hashedPassword = bcrypt.hashSync(password, 8)

    // save the new user and hashed password to db
    try {
        const insertUser = db.prepare(`INSERT INTO users (username, password)
            VALUES (?, ?)`)
            const result = insertUser.run(username, hashedPassword)

            // now that we have a user, I want to add their first todo for them
            const defaultToDo = 'Hello! Add your first todo!'
            const insertToDo = db.prepare(`INSERT INTO todo (user_id, task)
                VALUES (?, ?)`)
            insertToDo.run(result.lastInsertRowid, defaultToDo)

            // create a token that we can use later to confirm they are the correct user
            const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, 
                { expiresIn: '24h' })
            res.json({ token })

    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

router.post('/login', (req, res) => {
    // we get their email and we look up the password associated with that email in the database
    // but we get it back and see it's encrypted, which means that we cannot compare it to the 
    // one the user just used trying to login
    // What can we do??? one way encrypt the password the password the user just entered

    const {username, password} = req.body

    try {
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?')
        const user = getUser.get(username)

        // if we cannot find a user associated with that username, return out from function
        if (!user) {return res.status(404).send({ message: "User not found" })}

        const passwordIsValid = bcrypt.compareSync(password, user.password)
        // If the password does not match, return out of the function
        if (!passwordIsValid) {return res.status(401).send({ message: "invalid password" })}
        console.log(user)

        // then we have a successful authentication!
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'})
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }

})

export default router
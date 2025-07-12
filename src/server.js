import express from 'express'

const app = express()
// check for port environment variable and use it. 5000 is a backup 
const PORT = process.env.PORT || 5003


app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`)
})
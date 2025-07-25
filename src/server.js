import express from 'express'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'

const app = express()
// check for port environment variable and use it. 5000 is a backup 
const PORT = process.env.PORT || 5003

// GET the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url)
// Get the directory name from the file path
const __dirname = dirname(__filename)


// Middleware 
app.use(express.json())
// serves the HTML file from the /public directory
// Tells express to serve all files from the public folder as static assets/ files
// any requests for the css files will be resolved to the public directory
app.use(express.static(path.join(__dirname, '../public')))

// Serving up the HTML file from the /public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Routes
app.use('/auth', authRoutes)
app.use('/todos', authMiddleware, todoRoutes)

app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`)
})
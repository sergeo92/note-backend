const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')


const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('build'))

const generateId = () => {
	const maxId = notes.length > 0
		? Math.max(...notes.map(n => n.id))
		: 0
	return maxId + 1
}

//let notes = [
//	{
//		id: 1,
//		content: "HTML is easy",
//		important: true
//	},
//	{
//		id: 2,
//		content: "Browser can execute only JavaScript",
//		important: false
//	},
//	{
//		id: 3,
//		content: "GET and POST are the most important methods of HTTP protocol",
//		important: true
//	}
//]

const password = "RguBKRFtkBt23Vgp"
const url =
	`mongodb+srv://fullstack:${password}@cluster0.baf2zej.mongodb.net/netApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
	content: String,
	imporatnt: Boolean
})

noteSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Note = mongoose.model('Note', noteSchema)

app.get('/', (req, res) =>{
	res.send(`<h1>Welcome to development fullstack </h1>`)
})

app.get('/api/notes', (req, res) => {
	Note.find({}).then(notes => {
		res.json(notes)
	})
})

app.get('/api/notes/:id', (req, res) => {
	const id = Number(req.params.id)
	const note = notes.find(n => n.id === id)
	if (note) {
		res.json(note)
	} else {
		return res.status(400).end()
	}
})

app.delete('/api/notes/:id', (req, res) => {
	const id = Number(req.params.id)
	notes = notes.filter(n => n.id !== id)

	res.status(204).end()
})

app.post('/api/notes', (req, res) => {
	const body = req.body

	if (!body.content){
		return res.status(400).json({
			error: "missing content"
		})
	}

	const note = {
		"content": body.content,
		important: body.important || false,
		id: generateId()
	}

	notes = notes.concat(note)

	res.json(note)
})




const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
require('dotenv').config()
const express = require('express')
const path = require('path')
const { searchCard, newDeck, seedDb } = require('./controller')
const app = express()

app.use(express.json())


app.use(express.static('client'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'))
})

app.get('/seed', seedDb)
app.post('/search', searchCard)
app.post('/deckname', newDeck)

const server = process.env.PORT || 4000
app.listen(server, () => console.log(`Server is running on port ${server}`))
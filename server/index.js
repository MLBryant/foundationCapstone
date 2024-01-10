require('dotenv').config()
const express = require('express')
const path = require('path')
const { searchCard, getDecks, createDeck, editDeck, deleteDeck, getCards, addCard, updateCard, deleteCard, seedDb } = require('./controller')
const app = express()

app.use(express.json())


app.use(express.static('client'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'))
})

app.get('/seed', seedDb)
app.post('/search', searchCard)
app.get('/decks', getDecks)
app.post('/decks', createDeck)
app.put('/decks/:id', editDeck)
app.delete('/decks/:id', deleteDeck)
app.get('/cards', getCards)
app.post('/cards', addCard)
app.put('/cards/:id', updateCard)
app.delete('/cards/:id', deleteCard)

const server = 4000 || process.env.PORT 
app.listen(server, () => console.log(`Server is running on port ${server}`))
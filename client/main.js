const searchForm = document.getElementById('search')
const nameField = document.getElementById('name')
const typeField = document.getElementById('type')
const subtypeField = document.getElementById('subtype')
const whiteBox = document.getElementById('white')
const greenBox = document.getElementById('green')
const blueBox = document.getElementById('blue')
const redBox = document.getElementById('red')
const blackBox = document.getElementById('black')
const cmcField = document.getElementById('cmc')
const textField = document.getElementById('text')
const powerField = document.getElementById('power')
const toughnessField = document.getElementById('toughness')
const loyaltyField = document.getElementById('loyalty')
const cardsDiv = document.getElementById('cards')
const prevBtn = document.getElementById('previous')
const nextBtn = document.getElementById('next')
const decksDiv = document.getElementById('decks')
const deckNameField = document.getElementById('deckname')
const deckNameBtn = document.getElementById('decknamebtn')
const deckForm = document.getElementById('createdeck')
const deckDiv = document.getElementById('deck')
const deckTitleDiv = document.getElementById('decktitlediv')
const deckTitle = document.getElementById('decktitle')
const deckSelect = document.getElementById('deckselect')
const hoverImg = document.getElementById('cardhoverimg')
const confirmModal = document.getElementById('confirmmodal')
const confirmDelete = document.getElementById('confirmdelete')
const cancelDelete = document.getElementById('canceldelete')
const editModal = document.getElementById('editmodal')
const editDeckForm = document.getElementById('editdeckform')
const editDeckField = document.getElementById('editdeckfield')
const cancelEditBtn = document.getElementById('editcancel')

let searchInput = {}
let cardsArr = []
let decksArr = []
let deckCardsArr = []
let deckId = 0
let pageNumber = 1

const searchCard = event => {
    event.preventDefault()
    cardsDiv.innerHTML = ''
    if (!prevBtn.classList.contains('hide')) {
        prevBtn.classList.add('hide')
    }
    if (!nextBtn.classList.contains('hide')) {
        nextBtn.classList.add('hide')
    }
    pageNumber = 1
    searchInput = {}
    if (nameField.value) {
        searchInput.name = nameField.value
    }
    if (typeField.value) {
        searchInput.types = typeField.value
    }
    if (subtypeField.value) {
        searchInput.subtypes = subtypeField.value
    }
    if (whiteBox.checked == true && searchInput.hasOwnProperty('colors')) {
        searchInput.colors += `,${whiteBox.value}`
    } else if (whiteBox.checked == true) {
        searchInput.colors = whiteBox.value
    }
    if (greenBox.checked == true && searchInput.hasOwnProperty('colors')) {
        searchInput.colors += `,${greenBox.value}`
    } else if (greenBox.checked == true) {
        searchInput.colors = greenBox.value
    }
    if (blueBox.checked == true && searchInput.hasOwnProperty('colors')) {
        searchInput.colors += `,${blueBox.value}`
    } else if (blueBox.checked == true) {
        searchInput.colors = blueBox.value
    }
    if (redBox.checked == true && searchInput.hasOwnProperty('colors')) {
        searchInput.colors += `,${redBox.value}`
    } else if (redBox.checked == true) {
        searchInput.colors = redBox.value
    }
    if (blackBox.checked == true && searchInput.hasOwnProperty('colors')) {
        searchInput.colors += `,${blackBox.value}`
    } else if (blackBox.checked == true) {
        searchInput.colors = blackBox.value
    }
    if (cmcField.value) {
        searchInput.cmc = cmcField.value
    }
    if (textField.value) {
        searchInput.text = textField.value
    }
    if (powerField.value) {
        searchInput.power = powerField.value
    }
    if (toughnessField.value) {
        searchInput.toughness = toughnessField.value
    }
    if (loyaltyField.value) {
        searchInput.loyalty = loyaltyField.value
    }
    searchInput.page = pageNumber
    axios.post(`/search`, searchInput)
    .then(createCards)
}

const nextPage = event => {
    event.preventDefault()
    cardsDiv.innerHTML = ''
    if (!prevBtn.classList.contains('hide')) {
        prevBtn.classList.add('hide')
    }
    if (!nextBtn.classList.contains('hide')) {
        nextBtn.classList.add('hide')
    }
    pageNumber++
    searchInput.page = pageNumber
    axios.post('/search', searchInput)
    .then(createCards)
}

const previousPage = event => {
    event.preventDefault()
    cardsDiv.innerHTML = ''
    if (!prevBtn.classList.contains('hide')) {
        prevBtn.classList.add('hide')
    }
    if (!nextBtn.classList.contains('hide')) {
        nextBtn.classList.add('hide')
    }
    pageNumber--
    searchInput.page = pageNumber
    axios.post('/search', searchInput)
    .then(createCards)
}

const addCard = event => {
    event.preventDefault()
    let cardInDeck = false
    let existingCard = {}
    deckCardsArr.forEach(elem => {
        if (cardsArr[event.target.id].name == elem.name) {
            cardInDeck = true
            existingCard = elem
        }
    })
    if (deckSelect.value == 0) {
        alert('Please select a Deck')
    } else if (cardInDeck == true) {
        updateCard(existingCard.cardId, existingCard.basicLand, existingCard.count, 'plus')
    } else {
        cardsArr[event.target.id].deckId = deckSelect.value
        axios.post('/cards', cardsArr[event.target.id])
        .then(res => {
            getCards()
        })
    }
}

const selectDeck = event => {
    event.preventDefault()
    deckTitle.textContent = ''
    deckId = deckSelect.options[deckSelect.selectedIndex].value
    deckTitle.textContent = deckSelect.options[deckSelect.selectedIndex].textContent + ' Deck'
    getCards()
}

const getDecks = () => {
    decksArr = []
    axios.get('/decks')
    .then(res => {
        deckSelect.innerHTML = ''
        let nullOption = document.createElement('option')
        nullOption.value = 0
        nullOption.textContent = 'Select Deck'
        deckSelect.appendChild(nullOption)
        res.data.forEach(elem => {
            const deck = document.createElement('option')
            deck.value = elem.deck_id
            deck.textContent = elem.name
            deckSelect.appendChild(deck)
            decksArr.push(elem.name)
        })
    })
}

const getCards = () => {
    deckCardsArr = []
    let totalCount = 0
    axios.get('/cards')
    .then(res => {
        deckDiv.innerHTML = ''
        let creatureDiv = document.createElement('div')
        let creatureTitle = document.createElement('h3')
        creatureTitle.textContent = "Creatures:"
        creatureDiv.appendChild(creatureTitle)
        deckDiv.appendChild(creatureDiv)
        let spellDiv = document.createElement('div')
        let spellTitle = document.createElement('h3')
        spellTitle.textContent = "Spells:"
        spellDiv.appendChild(spellTitle)
        deckDiv.appendChild(spellDiv)
        let artifactDiv = document.createElement('div')
        let artifactTitle = document.createElement('h3')
        artifactTitle.textContent = "Artifacts:"
        artifactDiv.appendChild(artifactTitle)
        deckDiv.appendChild(artifactDiv)
        let landDiv = document.createElement('div')
        let landTitle = document.createElement('h3')
        landTitle.textContent = "Lands:"
        landDiv.appendChild(landTitle)
        deckDiv.appendChild(landDiv)
        res.data.sort((a, b) => a.name.localeCompare(b.name))
        res.data.forEach(elem => {
            if (elem.deck_id == deckId) {
                totalCount += elem.count
                let {card_id, name, imageurl, types, manacost, deck_id, deckname, count, basic_land} = elem
                let deckCardObj = {
                    cardId: card_id,
                    name: name,
                    imageurl: imageurl,
                    types: types,
                    manacost: manacost,
                    deckId: deck_id,
                    deckname: deckname,
                    count: count,
                    basicLand: basic_land
                }
                deckCardsArr.push(deckCardObj)
                if (elem.types.includes('Creature') || elem.types.includes('Summon')) {
                    let newDeckCardDiv = document.createElement('div')
                    newDeckCardDiv.innerHTML = `<p class = 'deckcardname' onmouseover = 'mouseoverImg("${elem.imageurl}")' onmouseout = 'mouseoutImg()'>${elem.name}</p>
                    <p class = 'deckcardmc'>    ${elem.manacost}</p>
                    <div class = 'deckcardbtns'>
                    <button class = 'deckcardbtn' onclick = 'updateCard(${elem.card_id}, ${elem.basic_land}, ${elem.count}, "minus")'>-</button>
                    <p>${elem.count}</p>
                    <button class = 'deckcardbtn' onclick = 'updateCard(${elem.card_id}, ${elem.basic_land}, ${elem.count}, "plus")'>+</button>
                    <button class = 'deckcardremovebtn' onclick = 'deleteCard(${elem.card_id})'>Remove</button>
                    </div>`
                    newDeckCardDiv.classList.add('deckcarddiv')
                    creatureDiv.appendChild(newDeckCardDiv)
                    } else if (elem.types.includes('Instant') || elem.types.includes('Sorcery') || elem.types.includes('Enchantment')) {
                        let newDeckCardDiv = document.createElement('div')
                        newDeckCardDiv.innerHTML = `<p class = 'deckcardname' onmouseover = 'mouseoverImg("${elem.imageurl}")' onmouseout = 'mouseoutImg()'>${elem.name}</p>
                        <p class = 'deckcardmc'>    ${elem.manacost}</p>
                        <div class = 'deckcardbtns'>
                        <button class = 'deckcardbtn' onclick = 'updateCard(${elem.card_id}, ${elem.basic_land}, ${elem.count}, "minus")'>-</button>
                        <p>${elem.count}</p>
                        <button class = 'deckcardbtn' onclick = 'updateCard(${elem.card_id}, ${elem.basic_land}, ${elem.count}, "plus")'>+</button>
                        <button class = 'deckcardremovebtn' onclick = 'deleteCard(${elem.card_id})'>Remove</button>
                        </div>`
                        newDeckCardDiv.classList.add('deckcarddiv')
                        spellDiv.appendChild(newDeckCardDiv)
                        } else if (elem.types.includes('Artifact')) {
                            let newDeckCardDiv = document.createElement('div')
                            newDeckCardDiv.innerHTML = `<p class = 'deckcardname' onmouseover = 'mouseoverImg("${elem.imageurl}")' onmouseout = 'mouseoutImg()'>${elem.name}</p>
                            <p class = 'deckcardmc'>    ${elem.manacost}</p>
                            <div class = 'deckcardbtns'>
                            <button class = 'deckcardbtn' onclick = 'updateCard(${elem.card_id}, ${elem.basic_land}, ${elem.count}, "minus")'>-</button>
                            <p>${elem.count}</p>
                            <button class = 'deckcardbtn' onclick = 'updateCard(${elem.card_id}, ${elem.basic_land}, ${elem.count}, "plus")'>+</button>
                            <button class = 'deckcardremovebtn' onclick = 'deleteCard(${elem.card_id})'>Remove</button>
                            </div>`
                            newDeckCardDiv.classList.add('deckcarddiv')
                            artifactDiv.appendChild(newDeckCardDiv)
                            } else if (elem.types.includes('Land')) {
                                let newDeckCardDiv = document.createElement('div')
                                newDeckCardDiv.innerHTML = `<p class = 'deckcardname' onmouseover = 'mouseoverImg("${elem.imageurl}")' onmouseout = 'mouseoutImg()'>${elem.name}</p>
                                <div class = 'deckcardbtns'>
                                <button class = 'deckcardbtn' onclick = 'updateCard(${elem.card_id}, ${elem.basic_land}, ${elem.count}, "minus")'>-</button>
                                <p>${elem.count}</p>
                                <button class = 'deckcardbtn' onclick = 'updateCard(${elem.card_id}, ${elem.basic_land}, ${elem.count}, "plus")'>+</button>
                                <button class = 'deckcardremovebtn' onclick = 'deleteCard(${elem.card_id})'>Remove</button>
                                </div>`
                                newDeckCardDiv.classList.add('deckcarddiv')
                                landDiv.appendChild(newDeckCardDiv)
                            }
            }
        })
        let deckTotal = document.createElement('h3')
        deckTotal.textContent = `Total Cards:   ${totalCount}`
        deckDiv.appendChild(deckTotal)
        let editDeckBtn = document.createElement('button')
        let deleteDeckBtn = document.createElement('button')
        editDeckBtn.textContent = 'Edit Deck Name'
        deleteDeckBtn.textContent = 'Delete Deck'
        editDeckBtn.id = 'editdeckbtn'
        deleteDeckBtn.id = 'deletedeckbtn'
        editDeckBtn.addEventListener('click', confirmEdit)
        deleteDeckBtn.addEventListener('click', deleteDeckConfirm)
        deckDiv.appendChild(editDeckBtn)
        deckDiv.appendChild(deleteDeckBtn)
    })
}

const createDeck = event => {
    event.preventDefault()
    if (deckNameField.value) {
        if (decksArr.includes(deckNameField.value) == false) {
            decksArr.push(deckNameField.value)    
            let newDeck = {
                deckName: deckNameField.value
            }
            axios.post(`/decks`, newDeck)
            .then(res => {
                getDecks()  
                setTimeout(function(){for (i = 0; i <= decksArr.length; i++) {
                    if(deckSelect.options[i].textContent == decksArr[decksArr.length - 1]) {
                        deckSelect.selectedIndex = i
                    }
                    deckTitle.textContent = ''
                    deckId = deckSelect.options[deckSelect.selectedIndex].value
                    deckTitle.textContent = deckSelect.options[deckSelect.selectedIndex].textContent + ' Deck'
                } getCards()}, 500)
            })
        } else {
            alert('Deck name already exists')
        }
    } else {
        alert('Must enter a Deck Name')
    }
    deckNameField.value = ''
}

const editDeckName = event => {
    event.preventDefault()
    let name = editDeckField.value
    axios.put(`/decks/${deckId}`, {name})
    .then(res => {
        getDecks()  
        setTimeout(function(){for (i = 0; i <= decksArr.length; i++) {
            if(deckSelect.options[i].textContent == name) {
                deckSelect.selectedIndex = i
            }
            deckTitle.textContent = ''
            deckId = deckSelect.options[deckSelect.selectedIndex].value
            deckTitle.textContent = deckSelect.options[deckSelect.selectedIndex].textContent + ' Deck'
        } getCards()}, 500)
        editModal.style.display = 'none'
        editDeckForm.removeEventListener('submit', editDeckName)
        cancelEditBtn.removeEventListener('click', cancelEdit)
    })
}

const createCards = res => {
    console.log(res.data.cards);
    if (res.data.cards.length == 0) {
        cardsDiv.textContent = 'No Cards Match Your Search'
    } else {
        cardsArr = []
        res.data.cards.forEach((elem, i) => {
            let {name, imageUrl, types, subtypes, manaCost, cmc, multiverseid, basicLand} = elem
            let cardsArrObj = {
                name: name,
                imageUrl: imageUrl,
                types: types,
                subtypes: subtypes,
                manaCost: manaCost,
                cmc: cmc,
                multiverseid: multiverseid,
                basicLand: basicLand,
                count: 1
            }
            if (elem.hasOwnProperty('power')) {
                cardsArrObj.power = elem.power
                cardsArrObj.toughness = elem.toughness
            }
            if (elem.hasOwnProperty('loyalty')) {
                cardsArrObj.loyalty = elem.loyalty
            }
            cardsArr.push(cardsArrObj)
            let cardDiv = document.createElement('div')
            cardDiv.innerHTML = `<img src = '${imageUrl}' onmouseover = 'mouseoverImg("${imageUrl}")' onmouseout = 'mouseoutImg()'>`
            cardDiv.classList.add('carddiv')
            // let newCard = document.createElement('img')
            let newCardBtn = document.createElement('button')
            // newCard.src = imageUrl
            newCardBtn.id = i
            newCardBtn.textContent = 'Add Card to Deck'
            newCardBtn.addEventListener('click', addCard)
            // cardDiv.appendChild(newCard)
            cardDiv.appendChild(newCardBtn)
            cardsDiv.appendChild(cardDiv)
        })
        if (res.data.morePages == true) {
            nextBtn.classList.remove('hide')
        }
        if (pageNumber != 1) {
            prevBtn.classList.remove('hide')
        }
    }
}

const updateCard = (cardId, basicLand, count, type) => {
    axios.put(`/cards/${cardId}`, {count, basicLand, type})
    .then(res => {
        getCards()
    })
    .catch(error => console.log(error))
}

const deleteCard = cardId => {
    axios.delete(`/cards/${cardId}`)
    .then(res => {
        getCards()
    })
}

const deleteDeckCancel = event => {
    event.preventDefault()
    confirmModal.style.display = 'none'
    confirmDelete.removeEventListener('click', deleteDeck)
    cancelDelete.removeEventListener('click', deleteDeckCancel)
}

const deleteDeckConfirm = event => {
    event.preventDefault()
    confirmModal.style.display = 'block'
    confirmDelete.addEventListener('click', deleteDeck)
    cancelDelete.addEventListener('click', deleteDeckCancel)
}

const cancelEdit = event => {
    event.preventDefault()
    editModal.style.display = 'none'
    editDeckForm.removeEventListener('click', editDeckName)
    cancelEditBtn.removeEventListener('click', cancelEdit)
}

const confirmEdit = event => {
    event.preventDefault()
    editModal.style.display = 'block'
    editDeckForm.addEventListener('submit', editDeckName)
    cancelEditBtn.addEventListener('click', cancelEdit)
}

const deleteDeck = event => {
    event.preventDefault()
    axios.delete(`/decks/${deckId}`)
    .then(res => {
        deckDiv.innerHTML = ''
        deckTitle.textContent = ''
        getDecks()
        confirmModal.style.display = 'none'
        confirmDelete.removeEventListener('click', deleteDeck)
        cancelDelete.removeEventListener('click', deleteDeckCancel)
    })
}

const mouseoverImg = (source) => {
    hoverImg.style.width = '26vw'
    hoverImg.src = source
    hoverImg.classList.remove('hide')
}

const mouseoutImg = () => {
    hoverImg.classList.add('hide')
    hoverImg.style.width = '0vw'
    hoverImg.src = ''
}

getDecks()

searchForm.addEventListener('submit', searchCard)
prevBtn.addEventListener('click', previousPage)
nextBtn.addEventListener('click', nextPage)
deckForm.addEventListener('submit', createDeck)
deckSelect.addEventListener('change', selectDeck)

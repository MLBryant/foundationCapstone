const search = document.getElementById('search')
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
const cardDiv = document.getElementById('cards')
const prevBtn = document.getElementById('previous')
const nextBtn = document.getElementById('next')

let searchInput = {}
let cardsArr = []
let pageNumber = 1

const searchCard = event => {
    event.preventDefault()
    cardDiv.innerHTML = ''
    if (!prevBtn.classList.contains('hide')) {
        prevBtn.classList.add('hide')
    }
    if (!nextBtn.classList.contains('hide')) {
        nextBtn.classList.add('hide')
    }
    pageNumber = 1
    cardsArr = []
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
    .then(res => {
        console.log(res.data);
        for (i = 0; i < res.data.cards.length; i++) {
            let {name, imageUrl, types, manacost} = res.data.cards[i]
            let cardsArrObj = {
                id: i,
                name: name,
                imageUrl: imageUrl,
                types: types,
                manacost: manacost
            }
            cardsArr.push(cardsArrObj)
            let newCard = document.createElement('img')
            newCard.src = imageUrl
            newCard.id = i
            cardDiv.appendChild(newCard)
        }
        if (res.data.morePages == true) {
            nextBtn.classList.remove('hide')
        }
    })
}

const nextPage = event => {
    event.preventDefault()
    cardDiv.innerHTML = ''
    if (!prevBtn.classList.contains('hide')) {
        prevBtn.classList.add('hide')
    }
    if (!nextBtn.classList.contains('hide')) {
        nextBtn.classList.add('hide')
    }
    pageNumber++
    cardsArr = []
    searchInput.page = pageNumber
    axios.post('/search', searchInput)
    .then(res => {
        for (i = 0; i < res.data.cards.length; i++) {
            let {name, imageUrl, types, manacost} = res.data.cards[i]
            let cardsArrObj = {
                id: i,
                name: name,
                imageUrl: imageUrl,
                types: types,
                manacost: manacost
            }
            let newCard = document.createElement('img')
            newCard.src = imageUrl
            newCard.id = i
            cardDiv.appendChild(newCard)
        }
        prevBtn.classList.remove('hide')
        if (res.data.morePages == true) {
            nextBtn.classList.remove('hide')
        }
    })
}

const previousPage = event => {
    event.preventDefault()
    cardDiv.innerHTML = ''
    if (!prevBtn.classList.contains('hide')) {
        prevBtn.classList.add('hide')
    }
    if (!nextBtn.classList.contains('hide')) {
        nextBtn.classList.add('hide')
    }
    pageNumber--
    cardsArr = []
    searchInput.page = pageNumber
    axios.post('/search', searchInput)
    .then(res => {
        for (i = 0; i < res.data.cards.length; i++) {
            let {name, imageUrl, types, manacost} = res.data.cards[i]
            let cardsArrObj = {
                id: i,
                name: name,
                imageUrl: imageUrl,
                types: types,
                manacost: manacost
            }
            let newCard = document.createElement('img')
            newCard.src = imageUrl
            newCard.id = i
            cardDiv.appendChild(newCard)
        }
        if (pageNumber != 1) {
            prevBtn.classList.remove('hide')
        }
        nextBtn.classList.remove('hide')
    })
}

const addCardToDeck = event => {
    event.preventDefault()
    
}

search.addEventListener('submit', searchCard)
prevBtn.addEventListener('click', previousPage)
nextBtn.addEventListener('click', nextPage)

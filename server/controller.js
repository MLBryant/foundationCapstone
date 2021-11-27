const axios = require('axios')
const URL = `https://api.magicthegathering.io/v1/cards?`

module.exports = {
    searchCard: (req, res) => {
        let searchString = ''
        let resArr = []
        let areMorePages = false
        for (key in req.body) {
            if (searchString.length == 0) {
                searchString += `${key}=${req.body[key]}`
            } else {
                searchString += `&${key}=${req.body[key]}`
            }  
        }
        axios.get(`${URL}${searchString}`)
        .then(dbRes => {
            console.log(dbRes.data.cards.length);
            if (dbRes.data.cards.length == 100) {
                areMorePages = true
            }
            let namesArr = []
            dbRes.data.cards.forEach(elem => {
                if (elem.hasOwnProperty('imageUrl')) {
                    let {name, imageUrl, types, subtypes, manacost, cmc, multiverseid} = elem
                    if (namesArr.indexOf(name) == -1) {
                        let cardObj = {
                            name: name,
                            imageUrl: imageUrl,
                            types: types,
                            subtypes: subtypes,
                            manacost: manacost,
                            cmc: cmc,
                            multiverseid: multiverseid
                        }
                        if(elem.hasOwnProperty('power')) {
                            cardObj.power = elem.power
                            cardObj.toughness = elem.toughness
                        }
                        if (elem.hasOwnProperty('loyalty')) {
                            cardObj.loyalty = elem.loyalty
                        }
                        namesArr.push(name)
                        resArr.push(cardObj)
                    }
                }
            })
            resArr.sort((a, b) => a.name.localeCompare(b.name))
            res.status(200).send({cards: resArr, morePages: areMorePages})
        })
    }
}
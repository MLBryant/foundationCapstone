const axios = require('axios')
const URL = `https://api.magicthegathering.io/v1/cards?`
require("dotenv").config();
const { CONNECTION_STRING } = process.env;

const Sequelize = require("sequelize");
const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
});

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
                    let {name, imageUrl, types, subtypes, manaCost, cmc, multiverseid} = elem
                    if (namesArr.indexOf(name) == -1) {
                        let cardObj = {
                            name: name,
                            imageUrl: imageUrl,
                            types: types,
                            subtypes: subtypes,
                            manaCost: manaCost,
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
    },
    newDeck: (req, res) => {
        let {deckName} = req.body
        sequelize.query(`
            INSERT INTO decks (name)
            VALUES (${deckName});
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
    },
    seedDb: (req, res) => {
        sequelize.query(`
            drop table if exists decks;
            drop table if exists deckcards;

            create table decks (
                deck_id serial primary key, 
                name varchar
            );

            create table deckcards (
                card_id serial primary key,
                name varchar,
                imageUrl varchar,
                types varchar, 
                subtypes varchar,
                manaCost varchar,
                deck_id integer references decks(deck_id)
            );
            `)
            .then(() => {
                console.log('Db seeded');
                res.sendStatus(200)
            })
    }
}
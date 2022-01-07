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
            if (dbRes.data.cards.length == 100) {
                areMorePages = true
            }
            let namesArr = []
            dbRes.data.cards.forEach(elem => {
                if (elem.hasOwnProperty('imageUrl')) {
                    let {name, imageUrl, types, subtypes, manaCost, cmc, multiverseid,} = elem
                    if (namesArr.indexOf(name) == -1) {
                        let cardObj = {
                            name: name,
                            imageUrl: imageUrl,
                            types: types,
                            subtypes: subtypes,
                            manaCost: manaCost,
                            cmc: cmc,
                            multiverseid: multiverseid,
                        }
                        if(elem.hasOwnProperty('power')) {
                            cardObj.power = elem.power
                            cardObj.toughness = elem.toughness
                        }
                        if (elem.hasOwnProperty('loyalty')) {
                            cardObj.loyalty = elem.loyalty
                        }
                        if (elem.hasOwnProperty('supertypes') && elem.supertypes.includes('Basic')) {
                            cardObj.basicLand = true
                        } else {
                            cardObj.basicLand = false
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
    getDecks: (req, res) => {
        sequelize.query(`
            SELECT * FROM decks
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
    },
    createDeck: (req, res) => {
        let {deckName} = req.body
        sequelize.query(`
            INSERT INTO decks (name)
            VALUES ('${deckName}');
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
    },
    editDeck: (req, res) => {
        let {id} = req.params
        let {name} = req.body
        sequelize.query(`
            UPDATE decks
            SET name = '${name}'
            WHERE deck_id = ${id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
    },
    deleteDeck: (req, res) => {
        let {id} = req.params
        sequelize.query(`
            DELETE FROM cards
            WHERE deck_id = ${id};
            DELETE FROM decks
            WHERE deck_id = ${id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
    },
    getCards: (req, res) => {
        sequelize.query(`
            SELECT cards.card_id, cards.name, cards.imageUrl, cards.types, cards.manaCost, cards.count, cards.basic_land, decks.deck_id, decks.name deckName
            FROM cards
                JOIN decks
                    ON cards.deck_id = decks.deck_id
                    ORDER BY types desc
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
    },
    addCard: (req, res) => {
        let {name, imageUrl, types, subtypes, manaCost, cmc, multiverseid, deckId, basicLand, count} = req.body
        if (name.includes(`'`)) {
            name = name.slice(0, name.indexOf(`'`)) + `'` +name.slice(name.indexOf(`'`))
        }
        sequelize.query(`
            INSERT INTO cards (name, imageUrl, types, subtypes, manaCost, basic_land, deck_id, count)
            VALUES ('${name}', '${imageUrl}', '${types}', '${subtypes}', '${manaCost}', '${basicLand}', '${deckId}', '${count}')
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
    },
    updateCard: (req, res) => {
        let {id} = req.params
        let {count, basicLand, type} = req.body
        if (count == 1 && type == 'minus') {
            res.status(400).send('cannot reduce below 1')
        } else if (type == 'minus') {
            count--
            sequelize.query(`
                UPDATE cards
                SET count = ${count}
                WHERE card_id = ${id}
            `)
            .then(dbRes => res.status(200).send(dbRes[0]))
        } else if (count == 4 && type == 'plus' && basicLand == false) {
            res.status(400).send('cannot have more than 4 of one card')
        } else {
            count++
            sequelize.query(`
                UPDATE cards
                SET count = ${count}
                WHERE card_id = ${id}
            `)
            .then(dbRes => res.status(200).send(dbRes[0]))
        }
    },
    deleteCard: (req, res) => {
        let {id} = req.params
        sequelize.query(`
            DELETE FROM cards
            WHERE card_id = ${id}
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
    },
    seedDb: (req, res) => {
        sequelize.query(`
        drop table if exists decks;
        drop table if exists cards;

            create table decks (
                deck_id serial primary key, 
                name varchar
            );

            create table cards (
                card_id serial primary key,
                name varchar,
                imageUrl varchar,
                types varchar, 
                subtypes varchar,
                manaCost varchar,
                basic_land boolean,
                deck_id integer references decks(deck_id),
                count integer
            );
            `)
            .then(() => {
                console.log('Db seeded');
                res.sendStatus(200)
            })
    }
}
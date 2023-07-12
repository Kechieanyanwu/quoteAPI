const express = require('express');
const app = express();

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

const PORT = process.env.PORT || 4001;

app.use(express.static('public'));

app.listen(PORT, ()=> {
    console.log('Server is listening on ' + PORT);
})

app.get('/api/quotes/random', (req, res, next) => {
    const randomQuote = getRandomElement(quotes);
    res.status(200).send({
        "quote": randomQuote
    });
})

app.get('/api/quotes', (req, res, next) => {
    if (JSON.stringify(req.query) !== '{}') { //if there is a query for a particular person, find their quote
        const query = req.query;
        const respArray = [];
        if (query.person) {
            for (quote in quotes) {
                if (quotes[quote].person === query.person) {
                    respArray.push(quotes[quote]);
                }
            }
            res.status(200).send({
                "quotes": respArray
            });
        } else {
            res.status(404).send('Query using a name');
        }
    } else { //return entire array if no specific person is queried
            res.status(200).send({
                "quotes": quotes
            })
    }
})

app.post('/api/quotes', (req, res, next) => {
    const query = req.query;
    if (('person' in query) && ('quote' in query)) { //check if req.query has person and quote keys
        quotes.push(query); //if yes, create object and push to array
        const index = quotes.indexOf(query);
        res.status(201).send({ //send newly created quote as response
            quote: quotes[index] 
        })
    } else {
        res.status(400).send('Keys are Person and Quote'); 
    }
})


//to include app.delete and app.post in future updates.
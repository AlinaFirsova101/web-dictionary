const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://mongo:27017';
const _ = require('lodash');
const path = require('path');
const fs = require('fs')

MongoClient.connect(url, function (err, client) {
	const db = client.db('terms');
	const collection = db.collection('terms');

	collection.drop()

	fs.readFile('./glossary.json', 'utf8', (err, json) => {
		const glossary = JSON.parse(json)
		collection.insertMany(glossary);
	})

	app.set('views', './views');
	app.set('view engine', 'pug');

	app.get('/', async function (req, res) {
		res.render('index', { title: 'Добро пожаловать!', message: 'Добавьте к URL понятие через слеш для получения определения' });
	});

	app.get('/mindmap', (req, res) => {fd
		res.sendFile(path.join(__dirname, 'mindmap.png'));
	})

	app.get('/:term', async function (req, res) {
		const [ data ] = await collection.find({ term: req.params.term }).toArray();

		if (!_.isEmpty(data)) {
			const { term, definition } = data;

			res.render('index', { title: term, message: definition });
		} else {
			res.render('index', { title: "Ошибка", message: `${req.params.term} - к сожалению, термин не найден` });
		}
	});

	app.listen(9000)
})

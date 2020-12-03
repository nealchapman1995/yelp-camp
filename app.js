const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views')
app.set('views', path.join(__dirname, 'views'));

app.listen(3000, () => {
	console.log('serving on port 3000');
})

app.get('/', (req, res) => {
	res.render('home');
})
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser: true,
	useCreateIndex:true,
	useUnifiedTopology:true
});

mongoose.connection.on('error', console.log.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
	console.log('Database connected')
});

app.set('view engine', 'ejs');
app.set('views')
app.set('views', path.join(__dirname, 'views'));

app.listen(3000, () => {
	console.log('serving on port 3000');
})

app.get('/', (req, res) => {
	res.render('home');
})

app.get('/makecampground', async (req, res) => {
	const camp = new Campground({title: 'my backyard', description: 'cheap camping'});
	await camp.save();
	res.send(camp);
})

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
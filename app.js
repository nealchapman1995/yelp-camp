const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const {campgroundSchema} = require('./schemas.js');



mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser: true,
	useCreateIndex:true,
	useUnifiedTopology:true
});

mongoose.connection.on('error', console.log.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
	console.log('Database connected')
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views')
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400)
	}
	next();
}

app.listen(3000, () => {
	console.log('serving on port 3000');
})

app.get('/', (req, res) => {
	res.render('home');
})

app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new');
})

app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
	const campground = new Campground(req.body.campground);
	await campground.save();
	res.redirect(`/campgrounds/${campground._id}`);
}))

app.get('/campgrounds/:id', catchAsync (async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	res.render('campgrounds/show', { campground })
}))

app.get('/campgrounds', catchAsync(async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/index', {campgrounds})
}))

app.get('/campgrounds/:id/edit', validateCampground, catchAsync(async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	res.render('campgrounds/edit', { campground })
}))

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
	const {id} = req.params;
	const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
	res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	res.redirect('/campgrounds');
}))

app.all('*', (req, res, next) => {
	next(new ExpressError('page not found', 404));
})

app.use((err, req, res, next) => {
	const {statusCode = 500, message = 'Something went wrong'} = err;
	if(!err.message) err.message = 'Oh No, Something went wrong'
	res.status(statusCode).render('errors', { err }) 
})
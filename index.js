let express = require('express');
let app = express();

//Set Public Static Folder
app.use(express.static(__dirname + '/public'));

//Use View Engine
let expressHbs = require('express-handlebars');
let helper = require('./controllers/helper');
let paginateHelper = require('express-handlebars-paginate')
let hbs = expressHbs.create({
	extname: 'hbs',
	defaultLayout: 'layout',
	layoutsDir: __dirname + '/views/layouts',
	partialsDir: __dirname + '/views/partials',
	helpers: {
		createStarList: helper.createStarList,
		createStars: helper.createStars,
		createPagination: paginateHelper.createPagination
	}
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

//body parser
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//cookie parser
let cookieParser = require('cookie-parser');
app.use(cookieParser());

//express session
let session = require('express-session');
app.use(session({
	cookie: { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000},
	secret: 'Secret',
	resave: false,
	saveUninitialized: false
}));

//Use cart Controller
let Cart = require('./controllers/cartController');
app.use((req, res, next) => {
	var cart= new Cart(req.session.cart ? req.session.cart : {});
	req.session.cart = cart;
	res.locals.totalQuantity = cart.totalQuantity;
	next();
});

// Define Your Routes Here
// / =>index
// /products => category
// /products/:id => single-product

app.use('/', require('./routes/indexRouter'));
app.use('/products', require('./routes/productRouter'));
app.use('/cart', require('./routes/cartRouter'));
app.use('/comments', require('./routes/commentRouter'));

app.get('/sync', (req, res) => {
	let models = require('./models');
	models.sequelize.sync().then(() => {
		res.send('database sync completed');
	});
});

//Create Params Route
app.get('/:page', (req, res) => {
	let banners = {
		blog: 'Our blog',
		category: 'Shop Category',
		cart: 'Shopping Cart',
		checkout: 'Checkout',
		confirmation: 'Shop Category',
		contact: 'Contact Us',
		login: 'Login/Register',
		register: 'Register',
		'single-blog': 'Blog Details',
		'single-product': 'Shop Single',
		'tracking-order': 'Order Tracking'
	};
	let page = req.params.page;
	res.render(page, { banner: banners[page] });
});

//Set Server Port & Start Server
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), () => {
	console.log(`Server is running at port ${app.get('port')}`);
});
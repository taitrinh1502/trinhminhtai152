let express = require('express')
let app = express()

//Project 1
//set Public Static Folder
app.use(express.static(__dirname + '/public'));

//use view engine
let expressHbs = require('express-handlebars');
let hbs = expressHbs.create({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

//define your routes here
app.get('/', (req, res) =>{
    res.render('index');
});

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

//set server port & start server
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), () => {
    console.log(`Server is running at port ${app.get('port')}`)
});
var express = require('express');
var path = require('path');
var router = express.Router();
var morgan = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');

function configureEndpoints(app) {
    app.use(session({
        secret: 'work hard',
        resave: true,
        saveUninitialized: false
    }));
    app.use(router);

    var pages = require('./pages');
    var api = require('./api');

    //Налаштування URL за якими буде відповідати сервер
    //Отримання списку піц
    app.post('/api/register/', api.registerUser);
    app.post('/api/login/', api.loginUser);
    app.post('/api/update/', api.updateProfile);
    app.post('/api/transfer/', api.transfer);
    app.post('/api/addCard/', api.addCard);
    app.post('/api/history/', api.getHistory);
    app.get('/api/logout/', api.logoutUser);
    app.get('/api/cards/',api.getCards);

    //Сторінки
    app.get('/', pages.loginPage);
    app.get('/login', pages.loginPage);
    app.get('/register', pages.registerPage);
    app.get('/profile', pages.profilePage);
    app.get('/phone', pages.phonePage);
    app.get('/settings', pages.settingsPage);
    app.get('/transfer', pages.transferPage);
    app.get('/history', pages.historyPage);

    //Якщо не підійшов жоден url, тоді повертаємо файли з папки www
    app.use(express.static(path.join(__dirname, '../Frontend/www')));
}

function startServer(port) {
    //Створюється застосунок
    var app = express();

    //Налаштування директорії з шаблонами
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    //Налаштування виводу в консоль списку запитів до сервера
    app.use(morgan('dev'));

    //Розбір POST запитів
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    //Налаштовуємо сторінки
    configureEndpoints(app);

    //Запуск додатка за вказаним портом
    app.listen(port, function () {
        console.log('Running on port '+port+'/');
    });
}

exports.startServer = startServer;
// import { Designer } from './attempt';

// let components = [
//     105,
//     75,
//     295,
//     163,
//     148,
//     218,
//     159,
//     159,
//     178,
//     243,
//     176,
//     383
// ];

// let evolver = new LazyGuy(components);
// let document = evolver.createDocument();

// console.log('document', document);

import { scrapeComponents } from './ComponentScraper/ComponentScraper';

let express = require('express'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    path = require('path');

let app = express();

let webpack = require("webpack"),
    webpackDevMiddleware = require("webpack-dev-middleware"),
    webpackHotMiddleware = require("webpack-hot-middleware"),
    clientConfig = require("../../webpack.client");

let compiler = webpack(clientConfig);

/*--- App ---*/

app.set('view engine', 'ejs');
app.set('views', path.resolve(process.cwd(), 'src/server/views'));


app.use(bodyParser.json());
app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: clientConfig.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));


app.post('/get-components', (req, res) => {
    let url = req.body.url,
        classNames = req.body.class_names;

    for (let className of classNames){
        console.log(`Getting Page Component Dimensions for Class Name ${className}`);
        scrapeComponents(url, className);
    }
});


let system = app.listen(3000, () => {
    console.log('App running on port 3000');
});
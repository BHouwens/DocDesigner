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
import { Designer } from './Designer/Designer';

let fs = require('fs'),
    path = require('path');

let configPath = path.join(process.cwd(), 'src', 'config.json'),
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

let url = config[0].url;
let classes = config[0].classes[0];

let phantom = require('node-phantom'),
    heightsOfChildren = [];

phantom.create((err, ph) => {
    ph.createPage((err, page) => {
        page.open(url, function (status) {

            setTimeout(function () {
                let numberOfChildren = page.evaluate(function () {
                    return document.querySelector(className).childNodes.length;
                });

                for (let i = 0; i < numberOfChildren; i++) {
                    let height = page.evaluate(i => {
                        let child = document.querySelector(className).childNodes[i],
                            height = child.offsetHeight;

                        height += parseInt(window.getComputedStyle(child).getPropertyValue('margin-top'));
                        height += parseInt(window.getComputedStyle(child).getPropertyValue('margin-bottom'));

                        return height;
                    }, i);

                    heightsOfChildren.push(height);
                }

                console.log(heightsOfChildren);

                phantom.exit();
            }, wait);

        });
    });
});
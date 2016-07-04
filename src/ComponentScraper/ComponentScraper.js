/**
 *  This component scraper is run via PhantomJS. It's malleable from project to project
 *  as IDs, classes and URLs will change
 */

export function scrapeComponents(url, className, wait = 6000) {
    let webpage = require('webpage'),
        page = webpage.create();

    page.open(url, function (status) {

        setTimeout(function () {
            let heightsOfChildren = [],
                numberOfChildren = page.evaluate(function () {
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
}
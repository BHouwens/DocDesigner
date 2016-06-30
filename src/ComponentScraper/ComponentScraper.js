var webpage = require('webpage'),
    page = webpage.create();

page.open('https://staging-api.kurtosys.io/tools/ksys339/fact-sheet/SEVF/en-GB#/?_k=j2iftj', function (status) {

    setTimeout(function () {
        var heightsOfChildren = [],
            numberOfChildren = page.evaluate(function () {
                return document.querySelector('.ksw__card--2-3').childNodes.length;
            });

        for (var i = 0; i < numberOfChildren; i++){
            var height = page.evaluate(function(i) {
                var child = document.querySelector('.ksw__card--2-3').childNodes[i],
                    height = child.offsetHeight;

                height += parseInt(window.getComputedStyle(child).getPropertyValue('margin-top'));
                height += parseInt(window.getComputedStyle(child).getPropertyValue('margin-bottom'));

                return height;
            }, i);

            heightsOfChildren.push(height);
        }

        console.log(heightsOfChildren);

        phantom.exit();
    }, 6000);

});
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var logger = require('morgan');
var app = express();

app.use(logger('dev'));

app.get('/scrape', function(req, res) {

    url = 'http://www.imdb.com/title/tt1935859/';

    request(url, function(error, response, html) {
        if (!error) {

            var $ = cheerio.load(html);

            var title, year, rating;
            var json = {
                title: "",
                year: "",
                rating: ""
            };

            $('h1').filter(function() {
                var data = $(this);
                title = data.text().split(' ');
                for (var i = 0; i < title.length; i++) {
                    if (!title[i].length) {
                        title.splice(i, 1);
                    }
                }
                console.log(title);
                year = data.children().last().children().text();

                json.title = title;
                json.year = year;
            })

            $('.star-box-giga-star').filter(function() {
                var data = $(this);
                rating = data.text();

                json.rating = rating;
            })
        }

        // To write to the system we will use the built in 'fs' library.
        // In this example we will pass 3 parameters to the writeFile function
        // Parameter 1 :  output.json - this is what the created filename will be called
        // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
        // Parameter 3 :  callback function - a callback function to let us know the status of our function

        fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err) {

            console.log('File successfully written! - Check your project directory for the output.json file');

        })

        // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
        res.send('Check your console!')

    });
})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;

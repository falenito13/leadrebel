const database = require('./db');
const express = require('express')
const app = express();
const sqlite3 = require('sqlite3').verbose();
var typeorm = require("typeorm");
var cheerio = require('cheerio');
var got = require('got');
var vgmUrl = 'https://www.europages.co.uk/companies/structural%20work.html';

var data = () => {

    return got(vgmUrl).then((response) => {
        const $ = cheerio.load(response.body);
        let categoryLinks = $('.by_category .domainfilter li a');
        let linkArray = [];
        for (let i = 0; i < categoryLinks.length; i++) {
            /**
             * Array of category links
             */
            linkArray.push($(categoryLinks)[i].attribs.href);
        }
        return linkArray;
    })

};

function redirectTo() {
    /**
     * This method will redirect to link and give html to parseHtml function
     */
    return data().then((ans) => {
        ans.forEach((el) => {
            got(el).then(r => r.body)
                .then(cheerio.load)
                .then(resp => {
                    return parseHtml(resp);
                })
        })
    });
}

function parseHtml(resp) {
    /**
     * title and description of a companies.
     */
    const companies = resp('.article-company .article-company__header');
    const companiesTitle = resp('.article-company .article-company__header div a');
    const companiesDescription = resp('.article-company .article-company__header p').text();
}

redirectTo();
app.listen(5000, function () {
    console.log('Server started!');
});
import {databaseConnection} from "./db.js";
import cheerio from 'cheerio';
import express from 'express';
import got from 'got';
const app = express();
var vgmUrl = 'https://www.europages.co.uk/business-directory-europe.html';
var data = () => {
    return got(vgmUrl).then((response) => {
        const $ = cheerio.load(response.body);
        let categoryLinks = $('.sectors-item__title a');
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

function gotTemplate(url) {
    return got(url).then(r => r.body)
        .then(cheerio.load)
}

function redirectTo() {
    var arr = [];
    return data().then((ans) => {
        ans.forEach((el, j) => {
            return gotTemplate(el)
                .then(resp => {
                    let sectors = resp('.domain-columns ul li input');
                    let i = 0;
                    for (let i = 0; i < sectors.length; i++) {
                        arr.push(`ih=${sectors[i].attribs.id}&`);
                        if (j === ans.length - 1) {
                            return companiesUrl(arr);
                        }
                    }
                })
        });
    });
}

function companiesUrl(ans) {
    let url = 'https://www.europages.co.uk/companies/results.html?';
    ans.forEach((el) => {
        url += el;
    });
    return gotTemplate(url)
        .then(resp => {
            return parseHtml(resp);
        })
}

function parseHtml(resp) {
    let companyLinks = resp('.company-info a');
    for (let i = 0; i < companyLinks.length; i++) {
        gotTemplate(companyLinks[i].attribs.href)
            .then(ans => {
                var name = ans('.company-baseline h1 span').text();
                let country = ans('.company-country span')[1].children[0].data;
                let address = ans('dd[itemprop="addressLocality"]').text();
                let vat = ans('dd span[itemprop="vatID"]').text();
                let categories = ans('.js-breadcrumb-back-heading a')[0].attribs.title;
                let head_count = ans('.data-list li .icon-key-people').text();
                let sales_staff = ans('.data-list li .icon-key-sales').text();
                let sales_turnover = ans('.data-list li .icon-key-ca').text();
                let phone_number = ans('.js-num-tel').text();
                // let website = ans('.page__layout-sidebar--container-desktop .page-action[itemprop="url"]')[0].attribs.title;
                let export_sales = ans('.data-list li .icon-key-export').text();
                let keyword_tags = ans('.keyword-tag li[itemprop="itemListElement"]');
                let description = ans('.company-description').text();
                let established_year = ans('.organisation-list li');
                let keywordsArray = [];
                for (let j = 0; j < keyword_tags.length; j++) {
                    keywordsArray.push(keyword_tags[j].children[0].data);
                }
                databaseConnection(name)
            })


    }
}

redirectTo();
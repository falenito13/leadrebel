import {createTable,insertTable} from "./db.js";
import cheerio from 'cheerio';
import express from 'express';
import got from 'got';
const app = express();
var vgmUrl = 'https://www.europages.co.uk/business-directory-europe.html';
createTable();
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

function check(test){
  return test === undefined ? 'null' : test;
}
function parseHtml(resp) {
    let companyLinks = resp('.company-info a');
        for (let i = 0; i < companyLinks.length; i++) {
            gotTemplate(companyLinks[i].attribs.href)
                .then(ans => {
                    var name = check(ans('.company-baseline h1 span').text());
                    var country = check(ans('.company-country span')[1].children[0].data);
                    var address = check(ans('dd[itemprop="addressLocality"]').text());
                    var vat = check(ans('dd span[itemprop="vatID"]').text());
                    var categories = check(ans('.js-breadcrumb-back-heading a')[0].attribs.title);
                    var head_count = check(ans('.data-list li .icon-key-people').text());
                    var sales_staff = check(ans('.data-list li .icon-key-sales').text());
                    var sales_turnover = check(ans('.data-list li .icon-key-ca').text());
                    var phone_number = check(ans('.js-num-tel').text().replace(/\s+/g, ''));
                    var website = check(ans('.page__layout-sidebar--container-desktop .page-action[itemprop="url"]')[0].attribs.title);
                    var export_sales = check(ans('.data-list li .icon-key-export').text());
                    var keyword_tags = check(ans('.keyword-tag li[itemprop="itemListElement"]'));
                    var description = check(ans('.company-description').text());
                    var established_year = check(ans('.organisation-list li .data--big').text());
                    var keywordsArray = [];
                    for (let j = 0; j < keyword_tags.length; j++) {
                        keywordsArray.push(keyword_tags[j].children[0].data);
                    }
                    insertTable(name, address, website, categories, country, vat, head_count, sales_staff, sales_turnover, phone_number, description, established_year, export_sales, keywordsArray);
                })
        }
}

redirectTo();
import {createTable, insertTable} from "./db.js";
import cheerio from 'cheerio';
import express from 'express';
import got from 'got';

const app = express();
var vgmUrl = 'https://www.europages.co.uk/business-directory-europe.html';
createTable();

var data = async () => {
    /**
     * This method returns links of a sectors.
     */
    try {
        return await got(vgmUrl, {decompress: false}).then((response) => {
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
    } catch (err) {
        console.log(err.message, 'data');
    }
};

async function gotTemplate(url) {
    /**
     * This method loads html
     */
    try {
        return await got(url).then(r => r.body)
            .then(cheerio.load)
    } catch (err) {
        console.log(err.message, 'gotTemplate');
    }
}

async function redirectTo() {
    /**
     * This method gives sector ids of all category.
     */
    try {
        return await data().then((ans) => {
            ans.forEach((el, j) => {
                return gotTemplate(el)
                    .then(resp => {
                        let sectors = resp('.domain-columns ul li input');
                        var arr = [];
                        for (let i = 0; i < sectors.length; i++) {
                            arr.push(`ih=${sectors[i].attribs.id}&`);
                        }
                        companiesUrl(arr);
                    })
            });
        });
    } catch (err) {
        console.log(err.message, 'redirectTo');
    }
}

function companiesUrl(ans) {
    /**
     * This method gives sectors url
     */
    try {
        let url = 'https://www.europages.co.uk/companies/results.html?';
        ans.forEach((el) => {
            url += el;
        });
        parseHtml(url);
    } catch (err) {
        console.log(err.message, 'companiesUrl');
    }
}

function check(test) {
    /**
     * it checks if variable is undefined
     */
    try {
        return typeof (test) === undefined ? test = 'null' : test;
    } catch (err) {
        console.log(err.message, 'check');
    }
}

function parseHtml(url) {
    /**
     * It takes each sector url and send all page url of each sector to getRequests method
     */
    try {
        return gotTemplate(url, {decompress: false})
            .then(resp => {
                let pageArray = [];
                let selector = resp('.pagination-nav a');
                for (let i = 0; i < resp('.pagination-nav a').length; i++) {
                    if (!selector[i].children[0].data.includes('\n')) {
                        pageArray.push(selector[i].children[0].data);
                    }
                }
                const maxPage = Math.max(...pageArray);
                return maxPage;
            }).then(async (max) => {
                String.prototype.splice = function (start, delCount, newSubStr) {
                    return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
                };
                var regex = /companies/g;
                if (regex.test(url) == true) {

                    var index = regex.lastIndex + 1;
                    let requestArray = [];
                    for (let i = 1; i < max + 1; i++) {
                        var newUrl = url.splice(index, 0, `pg-${i}/`);
                        await getRequests(newUrl);
                    }
                }
            })
    } catch (err) {
        console.log(err.message, 'parseHtml');
    }
}

async function getRequests(request) {
    /**
     * It send only 5 request at once simultaneously
     */
    try {
        return await gotTemplate(request, {decompress: false})
            .then(async resp => {
                let companyLinks = resp('.company-info a');
                let companiesArray = [];
                for (let i = 0; i < companyLinks.length; i++) {
                    companiesArray.push(companyLinks[i].attribs.href);
                    if (companiesArray.length >= 5) {
                        await sendRequest(companiesArray);
                        companiesArray = [];
                    }
                }
            });
    } catch (err) {
        console.log(err.message, 'getRequests');
    }
}

async function sendRequest(url) {
    /**
     * This method extract data from appropriate url and insert it into companies table
     */
    try {
        for (let x of url) {
            await gotTemplate(x, {decompress: false})
                .then(ans => {
                        var name = check(ans('.company-baseline h1 span').text());
                        if (ans('.company-country span').length > 1) {
                            var country = check(ans('.company-country span')[1].children[0].data);
                        } else {
                            var country = 'null';
                        }
                        var address = check(ans('dd[itemprop="addressLocality"]').text());
                        var vat = check(ans('dd span[itemprop="vatID"]').text());
                        if (ans('.js-breadcrumb-back-heading a').length > 0) {
                            var categories = check(ans('.js-breadcrumb-back-heading a')[0].attribs.title);
                        } else {
                            var categories = 'null';
                        }
                        var head_count = check(ans('.data-list li .icon-key-people').text());
                        var sales_staff = check(ans('.data-list li .icon-key-sales').text());
                        var sales_turnover = check(ans('.data-list li .icon-key-ca').text());
                        var phone_number = check(ans('.js-num-tel').text().replace(/\s+/g, ''));
                        if (ans('.page__layout-sidebar--container-desktop .page-action[itemprop="url"]').length > 0) {
                            var website = ans('.page__layout-sidebar--container-desktop .page-action[itemprop="url"]')[0].attribs.title;
                        } else {
                            var website = 'null';
                        }
                        var export_sales = check(ans('.data-list li .icon-key-export').text());
                        var keyword_tags = check(ans('.keyword-tag li[itemprop="itemListElement"]'));
                        var description = check(ans('.company-description').text());
                        var established_year = check(ans('.organisation-list li .data--big').text());
                        var keywordsArray = [];
                        for (let j = 0; j < keyword_tags.length; j++) {
                            keywordsArray.push(keyword_tags[j].children[0].data);
                        }
                        insertTable(name, country, website, categories, address, vat, head_count, sales_staff, sales_turnover, phone_number, description, established_year, export_sales, keywordsArray);
                    }
                );
        }
    } catch (err) {
        console.log(err.message, 'sendRequest');
    }
}

await redirectTo();
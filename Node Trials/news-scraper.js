const request = require('request')
const cheerio = require('cheerio')

function newsPCGamer(URL, articleCount) {
    request(URL, (error, response, html) => {
        if (!error && response.statusCode === 200) {
            const $ = cheerio.load(html)

            $('.listingResult.small').each((i, elem) => {
                if (i > 0) {
                    console.log('\n' + ++articleCount)
                    console.log('Title: ' + $(elem).find('h3.article-name').text())
                    console.log('Author: ' + $(elem).find('span.by-author').children().text().trim())
                    console.log('Link: ' + $(elem).find('a.article-link').attr('href'))
                    if (articleCount >= maxArticle) return false
                }
            })

            if (articleCount < maxArticle) newsPCGamer($('link[rel=next]').attr('href'), articleCount);
        }
    })
}

const maxArticle = 50;
newsPCGamer('https://www.pcgamer.com/news/', 0)
const request = require('request')
const cheerio = require('cheerio')

function newsPCGamer(URL, articleCount) {
    request(URL, (error, response, html) => {
        if (!error && response.statusCode === 200) {
            const $ = cheerio.load(html)

            console.log()
            $('.listingResult.small').each((i, elem) => {
                console.log(++articleCount)
                console.log($(elem).html().trim())
                if (articleCount >= 50) return false
            })

            if (articleCount < 50) newsPCGamer($('link[rel=next]').attr('href'), articleCount);
        }
    })
}

newsPCGamer('https://www.pcgamer.com/news/', 0)
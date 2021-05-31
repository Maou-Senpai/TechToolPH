const request = require('request');
const cheerio = require('cheerio');

function test() {
    var options = {
        headers: {'user-agent': 'node.js'}
    }
    for(let i=1; i<100; i++){
        request('https://sea.pcmag.com/article/news/?page='+ i + '&ist=broll', options, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                $(".articlewrapper").each((i, el) => {
                    const news = $(el).find("a")
                    const title = news.text().replace(/\s\s+/g, "");
                    const link = news.attr("href");
                    request('https://sea.pcmag.com'+link, options, function (error2, response2, html2) {
                        if (!error2 && response2.statusCode == 200) {
                            const $2 = cheerio.load(html2);
                            $2(".splashImg").each((i2, el2) => {
                                const tag = $2(el2).find("img")
                                const image = tag.attr("src")
                                console.log(title)
                                console.log(link)
                                console.log(image)
                            });
                        }
                    });
                });
            }

        });
    }

}

test()
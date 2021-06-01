import puppeteer from 'puppeteer';

const search = async (req, res) => {
    // const search = "grand  theft";
    const search = req.params.id;
    const query = search.split(/\s+/).join("+");

    const baseURL = "https://game-debate.com/search/games?search=";
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(baseURL + query);

    let results = await page.$$eval("div.gameSearchResultWrapper.searchResultWrapper", val => {

    });

    // await browser.close();

    console.log(req.params.id);
    return res.json("Done");
};

export default {
    search
}
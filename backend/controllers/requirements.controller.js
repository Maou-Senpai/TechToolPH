import fetch from 'node-fetch';
import htmlParser from 'node-html-parser';
const {parse} = htmlParser;

const search = async (req, res) => {
    const query = req.params.id.split(/\s+/).join("+");
    const baseURL = "https://game-debate.com";
    const html = await fetch(baseURL + "/search/games?search=" + query)
        .then(res => res.text());
    const doc = parse(html);

    const rtn = [];
    doc.querySelectorAll('div.gameSearchResultWrapper.searchResultWrapper').forEach(val => {
        if (val.querySelector('img.compatiblePlatformIcon[title*=PC]') === null) return;
        const title = val.querySelector("a.gameResultHeader").textContent;
        const link = baseURL + val.querySelector("a.gameResultHeader").getAttribute("href");
        const image = baseURL + val.querySelector("img").getAttribute("src");
        rtn.push({
            "title": title,
            "link": link,
            "image": image
        })
    });

    if (rtn.length > 0) return res.json(rtn);
    else res.json("Error");
};

export default {
    search
}
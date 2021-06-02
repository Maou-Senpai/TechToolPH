import fetch from 'node-fetch';
import htmlParser from 'node-html-parser';
const {parse} = htmlParser;

const search = async (req, res) => {
    const query = req.params.id.split(/\s+/).join("+");
    const baseURL = "https://game-debate.com";
    let html = await fetch(baseURL + "/search/games?search=" + query)
        .then(res => res.text());
    let doc = parse(html);

    let rtn = [];
    await doc.querySelectorAll('div.gameSearchResultWrapper.searchResultWrapper').forEach(val => {
        if (val.querySelector('img.compatiblePlatformIcon[title*=PC]') === null) return;
        const title = val.querySelector("a.gameResultHeader").textContent;
        const link = baseURL + val.querySelector("a.gameResultHeader").getAttribute("href");
        const image = baseURL + val.querySelector("img[alt]").getAttribute("src");

        rtn.push({
            "title": title,
            "link": link,
            "image": image
        })
    })

    rtn = rtn.slice(0, 5);
    for (let game of rtn) {
        console.log(game);
        await scrapeReco(game);
    }

    if (rtn.length > 0) return res.json(rtn);
    else res.json("Error");
};

async function scrapeReco(game) {
    const html = await fetch(game.link)
        .then(res => res.text());
    const doc = await parse(html);

    const types = ["cpu", "gpu"];
    // noinspection JSUnresolvedFunction
    const partsDivs = doc.querySelectorAll('div.systemRequirementsLink');
    for (let i = partsDivs.length - 2; i < partsDivs.length; i++) {
        const val = partsDivs[i];
        const parts = [];
        const partsElems = val.querySelectorAll("a");
        for (let i = 0; i < partsElems.length; i++) {
            parts.push(partsElems[i].textContent);
        }
        game[types.shift()] = parts;
    }
}

export default {
    search
}
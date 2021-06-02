import fetch from 'node-fetch';
import htmlParser from 'node-html-parser';
const {parse} = htmlParser;

const search = async (req, res) => {
    const query = req.params.id.split(/\s+/).join("+");
    const baseURL = "https://game-debate.com";
    let html = await fetch(baseURL + "/search/games?search=" + query).then(res => res.text());
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
            "image": image,
            "cpu": [],
            "gpu": [],
            "recoCPU": [],
            "recoGPU": []
        })
    })

    if (rtn.length > 0) return res.json(rtn.slice(0, 5));
    else res.json("Error");
};

const scrape = async (req, res) => {
    const html = await fetch(req.body.link).then(res => res.text());
    const doc = await parse(html);

    const types = ["cpu", "gpu"];
    const reco = {};
    // noinspection JSUnresolvedFunction
    const partsDivs = doc.querySelectorAll('div.systemRequirementsLink');
    if (partsDivs.length === 0) return res.json({"cpu": ["N/A"], "gpu": ["N/A"]});

    for (let i = partsDivs.length - 2; i < partsDivs.length; i++) {
        const val = partsDivs[i];
        const parts = [];
        const partsElems = val.querySelectorAll("a");
        for (let i = 0; i < partsElems.length; i++) {
            parts.push(partsElems[i].textContent);
        }
        reco[types.shift()] = parts;
    }

    return res.json(reco);
}

export default {
    search,
    scrape
}
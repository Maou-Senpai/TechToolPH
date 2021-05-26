import Benchmark from '../models/benchmarks.model.js';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const getCPU = (req, res) => {
    Benchmark.find({"type": "cpu"})
        .then(product => res.json(product))
        .catch(() => res.json('Cannot Find Products'));
    return res;
};

const getGPU = (req, res) => {
    Benchmark.find({"type": "gpu"})
        .then(product => res.json(product))
        .catch(() => res.json('Cannot Find Products'));
    return res;
};

const scrape = async (req, res) => {
    await Benchmark.deleteMany({})
        .then(() => console.log("Collection Cleared"))
        .catch(() => console.log("Collection Failed to Clear"));

    let sites = {
        cpu: 'https://www.cpubenchmark.net/high_end_cpus.html',
        gpu: 'https://www.videocardbenchmark.net/high_end_gpus.html'
    }

    let rtn = {}, n = 0;

    for (let site of Object.entries(sites)) {
        let response = await fetch(site[1]).then(res => res);
        let body = await response.text();
        let $ = await cheerio.load(body);

        $('li[id^=rk]').each((i, el) => {
            const type = site[0];
            const item = $(el).find('span.prdname').text();
            const score = $(el).find('span.count').text().replace(',', '');

            const newBenchmark = new Benchmark({
                type, item, score
            });

            newBenchmark.save()
                .then(() => {
                    rtn[n++] = "Added: " + item
                    console.log(item);
                })
                .catch((e) => {
                    rtn[n++] = e;
                    console.log(e);
                });
        });
    }

    return res.json(rtn);
};

export default {
    scrape,
    getCPU,
    getGPU
}
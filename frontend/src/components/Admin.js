import React, {Component} from 'react';
import axios from "axios";

export default class Admin extends Component {
    constructor(p){
        super(p);
        this.scrapeNews = this.scrapeNews.bind(this);
        this.scrapeProduct = this.scrapeProduct.bind(this);
        this.scrapeBenchmark = this.scrapeBenchmark.bind(this);
        this.state = {
            response: ""
        }
    }

    scrapeNews()
    {
        axios.get('http://localhost:5000/news/scrape')
            .then(res => {
                console.log(res.data);
                this.setState({response: "News Updated"})
            })
            .catch(err => {
                console.log(err);
                this.setState({response: "News Failed to Update"})
            })
    }

    scrapeProduct()
    {
        axios.get('http://localhost:5000/products/scrape')
            .then(res => {
                console.log(res.data);
                this.setState({response: "Product Updated"})
            })
            .catch(err => {
                console.log(err);
                this.setState({response: "Product Failed to Update"})
            })
    }

    scrapeBenchmark()
    {
        axios.get('http://localhost:5000/benchmarks/scrape')
            .then(res => {
                console.log(res.data);
                this.setState({response: "Benchmark Updated"})
            })
            .catch(err => {
                console.log(err);
                this.setState({response: "Benchmark Failed to Update"})
            })
    }

    render(){
        return (
            <div className='Admin' style={{marginLeft: "14rem"}}>
                <h1>Admin Settings</h1>
                <button className="News" type="button" onClick={this.scrapeNews}>
                    News
                </button>
                <button className="Product" type="button" onClick={this.scrapeProduct}>
                    Product
                </button>
                <button className="Benchmarks" type="button" onClick={this.scrapeBenchmark}>
                    Benchmarks
                </button>
                <h1>{this.state.response}</h1>
            </div>
        )
    }
}
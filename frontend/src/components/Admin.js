import React, {Component} from 'react';
import axios from "axios";
import Users from '../components/admin/Users';

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

    baseURL = process.env.REACT_APP_API || "http://localhost:5000";

    scrapeNews()
    {
        axios.get(this.baseURL + '/news/scrape')
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
        axios.get(this.baseURL + '/products/scrape')
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
        axios.get(this.baseURL + '/benchmarks/scrape')
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
                <Users style={{marginTop: "5rem"}}/>
            </div>
        )
    }
}
import React, {Component} from 'react';
import axios from "axios";
import Users from '../components/admin/Users';
import {Button, Modal} from "semantic-ui-react";
import {Link} from "react-router-dom";

export default class Admin extends Component {
    constructor(p){
        super(p);
        this.scrapeNews = this.scrapeNews.bind(this);
        this.scrapeProduct = this.scrapeProduct.bind(this);
        this.scrapeBenchmark = this.scrapeBenchmark.bind(this);
        this.state = {
            response: "",
            click: 0
        }
        this.responseModal = this.responseModal.bind(this);
        this.updated = this.updated.bind(this);
    }

    baseURL = process.env.REACT_APP_API || "http://localhost:5000";


    scrapeNews()
    {
        this.setState({click: 1})
        axios.get(this.baseURL + '/news/scrape')
            .then(res => {
                console.log(res.data);
                this.setState({response: "News Updated", click:0})
            })
            .catch(err => {
                console.log(err);
                this.setState({response: "News Failed to Update", click:0})
            })
    }

    scrapeProduct()
    {
        this.setState({click: 1})
        axios.get(this.baseURL + '/products/scrape')
            .then(res => {
                console.log(res.data);
                this.setState({response: "Product Updated", click:0})
            })
            .catch(err => {
                console.log(err);
                this.setState({response: "Product Failed to Update",click:0})
            })
    }

    scrapeBenchmark()
    {
        this.setState({click: 1})
        axios.get(this.baseURL + '/benchmarks/scrape')
            .then(res => {
                console.log(res.data);
                this.setState({response: "Benchmark Updated", click:0})
            })
            .catch(err => {
                console.log(err);
                this.setState({response: "Benchmark Failed to Update", click:0})
            })
    }

    updated(){
        this.setState({response:""});
    }

    responseModal(){
        return(
            <Modal open dimmer="blurring" className='modal' size="mini" >

                <Modal.Header>Updated</Modal.Header>
                <Modal.Content scrolling style={{width: "100%", marginLeft:"0rem", marginTop:"0rem"}}>
                    {this.state.response}
                </Modal.Content>
                <Modal.Actions>
                    <Link to="/admin-settings"><Button type="button" onClick={this.updated}>Close</Button></Link>
                </Modal.Actions>
            </Modal>
        )

    }

    render(){
        if (this.state.response === "" && this.state.click === 1) {
            return(
            <Modal open dimmer="blurring" className='modal' size="mini" >

                <Modal.Header>Updating...</Modal.Header>
                <Modal.Content scrolling style={{width: "100%", marginLeft:"0rem", marginTop:"0rem"}}>
                    Please Wait
                </Modal.Content>
            </Modal>
            )
        }

        return (
            <div className='Admin' style={{marginLeft: "14rem", width: "100%"}}>
                <div style={{textAlign: "center", marginTop: 30}}>
                    {this.state.response!==""?(this.responseModal()):(<></>)}
                    <h1 style={{marginBottom: 40}}>ADMIN SETTINGS</h1>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <Button className="News" type="button" onClick={this.scrapeNews}>
                            Scrape News
                        </Button>
                        <Button className="Product" type="button" onClick={this.scrapeProduct}
                                style={{marginLeft: 30, marginRight: 30}}>
                            Scrape Product
                        </Button>
                        <Button className="Benchmarks" type="button" onClick={this.scrapeBenchmark}>
                            Scrape Benchmarks
                        </Button>
                    </div>
                </div>
                <Users />
            </div>
        )
    }
}
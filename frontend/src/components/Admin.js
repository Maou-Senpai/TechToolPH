import React, {Component} from 'react';
import axios from "axios";
import Users from '../components/admin/Users';
import {Button, Modal} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {LoopCircleLoading} from "react-loadingg";

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
        if(this.state.response=="" && this.state.click==1){
            return(
            <Modal open dimmer="blurring" className='modal' size="mini" >

                <Modal.Header>Updating..</Modal.Header>
                <Modal.Content scrolling style={{width: "100%", marginLeft:"0rem", marginTop:"0rem"}}>
                    Please wait
                    <LoopCircleLoading/>
                </Modal.Content>
            </Modal>
            )
        }

        return (
            <div className='Admin' style={{marginLeft: "20rem", marginTop:"2rem", width:"100%"}}>
                {this.state.response!==""?(this.responseModal()):(<></>)}
                <h1> ADMIN SETTINGS</h1>
                <Button className="News" type="button" onClick={this.scrapeNews}>
                    News
                </Button>
                <Button className="Product" type="button" onClick={this.scrapeProduct}>
                    Product
                </Button>
                <Button className="Benchmarks" type="button" onClick={this.scrapeBenchmark}>
                    Benchmarks
                </Button>
                <Users style={{marginTop: "5rem"}}/>
            </div>
        )
    }
}
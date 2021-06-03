import React, {Component} from 'react';
import axios from 'axios';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {Button, Modal} from "semantic-ui-react";
import SearchIcon from "@material-ui/icons/Search";

import '../resources/News.css';

// noinspection DuplicatedCode
export default class News extends Component {
    constructor(p) {
        super(p);
        this.state = {
            loaded : false ,
            searchTerm: "",
            page: 0,
            selected: null
        }
        this.filter = this.filter.bind(this);
        this.actualFilter = this.actualFilter.bind(this);
        this.back = this.back.bind(this);
        this.next = this.next.bind(this);
        this.filterKey = this.filterKey.bind(this);
    }

    componentDidMount() {
        let baseUrl = process.env.REACT_APP_API || "http://localhost:5000";
        axios.get(baseUrl + "/news/")
            .then(res => {
                this.setState({
                    news: res.data,
                    allNews: res.data,
                    loaded: true
                });
            })
            .catch(e => console.log(e));
    }

    filter(event) {
        this.setState({
            searchTerm: event.target.value
        })
    }

    back() {
        if (this.state.page > 0) {
            window.scrollTo(0, 0);
            this.setState({
                page: this.state.page - 1
            });
        }
    }

    next() {
        if (this.state.page * 20 + 20 < this.state.news.length) {
            window.scrollTo(0, 0);
            this.setState({
                page: this.state.page + 1
            });
        }
    }

    redirect(e) {
        this.setState({
            selected: e,
        })
    }

    popUp() {
        if (this.state.selected === null) return null;
        return (
            <Modal open dimmer="blurring" className='modal'>
                <Modal.Content style={{width: "100%", marginLeft:"0rem", marginTop:"0rem"}}>
                    <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                        <img src={this.state.selected.thumbnail} style={{width: "80%"}}  alt={"Article Thumbnail"}/>
                    </div>
                    <h2 style={{textAlign: "center", marginTop: 20}}>You Clicked: {this.state.selected.title}</h2>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => this.setState({selected: null})}>Back</Button>
                    <a target="_blank" href={this.state.selected.link} rel="noreferrer">
                        <Button onClick={() => this.setState({selected: null})}>
                            Redirect to {this.state.selected.source}
                        </Button>
                    </a>
                </Modal.Actions>
            </Modal>
        )
    }

    actualFilter() {
        const newNews = this.state.allNews.filter((val) => {
            return ((this.state.searchTerm === "") ||
                (val.title.toLowerCase().includes(this.state.searchTerm.toLowerCase())) ||
                (val.source.toLowerCase().includes(this.state.searchTerm.toLowerCase())));
        });

        this.setState({
            news: newNews,
            page: 0
        })
    }

    pageDivider() {
        return this.state.news.slice(this.state.page * 10, (this.state.page + 1) * 10);
    }

    filterKey(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            this.actualFilter();
        }
    }

    render() {
        if (this.state.news === undefined) return (
            <div className="advisory-div">
                <p className="advisory">
                    If you can see this, the backend server may be on sleep due to free trial limitations. It sleeps
                    upon 20 minutes of inactivity. Since you visited this website, this will trigger the server to start.
                    Please wait for a few seconds to a minute before refreshing the page.
                </p>
            </div>
        )

        return (
            <div className="content" style={{width: "100%"}}>
                {this.popUp()}

                {/*Top Bar*/}
                <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                    <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                        <div className="input-group">
                            <input className="form-control bg-light border-0 small" type="text" onKeyPress={this.filterKey}
                                   placeholder="Search Keyword" value={this.state.searchTerm} onChange={this.filter}/>
                            <div className="input-group-append" onClick={this.actualFilter}>
                                <button className="btn btn-primary" type="button">
                                    <SearchIcon />
                                </button>
                            </div>
                        </div>
                    </form>
                    <button className="btn btn-primary" style={{marginRight: 20}} onClick={this.back}>
                        <ArrowBackIcon />
                    </button>
                    <button className="btn btn-primary" type="button" onClick={this.next}>
                        <ArrowForwardIcon />
                    </button>
                </nav>

                {/*Content*/}
                <div className="container-fluid">
                    {/*Left*/}
                    <div style={{width: "49%", float: "left"}}>
                        {this.state.loaded ? this.pageDivider().map((val, idx) => {
                            if (idx % 2 === 0) return (
                                <a href="javascript:void(0)" onClick={() => this.redirect(val)}>
                                    <div className="card shadow mb-4" style={{alignItems: "center",
                                        textAlign: "center", padding: 30}}>
                                        <img key={val.thumbnail.uniqueID} src={val.thumbnail}
                                             style={{maxWidth: "100%", paddingBottom: 20}} alt="thumbnail" />
                                        <span key={val.title.uniqueID} style={{fontSize: 20, fontWeight: "bold"}}>
                                            {val.source} --- {val.title}
                                        </span>
                                    </div>
                                </a>
                            ); else return null;
                        }) : null}
                    </div>

                    {/*Right*/}
                    <div style={{width: "49%", float: "right"}}>
                        {this.state.loaded ? this.pageDivider().map((val, idx) => {
                            if (idx % 2 !== 0) return (
                                <a href="javascript:void(0)" onClick={() => this.redirect(val)}>
                                    <div className="card shadow mb-4" style={{alignItems: "center", textAlign: "center", padding: 30}}>
                                        <img key={val.thumbnail.uniqueID} src={val.thumbnail}
                                             style={{maxWidth: "100%", paddingBottom: 20}} alt="thumbnail" />
                                        <span key={val.title.uniqueID} style={{fontSize: 20, fontWeight: "bold"}}>
                                            {val.source} --- {val.title}
                                        </span>
                                    </div>
                                </a>
                            ); else return null;
                        }) : null}
                    </div>
                </div>
            </div>
        )
    }
}
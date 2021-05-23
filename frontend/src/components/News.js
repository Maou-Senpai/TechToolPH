import React, { Component } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';

export default class News extends Component {
    constructor(p) {
        super(p);
        this.state = { loaded : false }
    }

    componentDidMount() {
        let baseUrl = process.env.baseURL || "http://localhost:5000";

        axios.get(baseUrl + "/news/")
            .then(res => {
                this.setState({ news : res.data })
                this.setState({ loaded : true });
            })
            .catch((e) => console.log(e));
    }

    render() {
        return (
            <div className="content" style={{width: "100%"}}>
                {/*Top Bar*/}
                <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                    <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                        <div className="input-group">
                            <input className="form-control bg-light border-0 small" type="text" placeholder="Search Keyword"/>
                            <div className="input-group-append">
                                <button className="btn btn-primary" type="button">
                                    <SearchIcon />
                                </button>
                            </div>
                        </div>
                    </form>
                </nav>

                {/*Content*/}
                <div className="container-fluid">
                    {/*Left*/}
                    <div style={{width: "49%", float: "left"}}>
                        {this.state.loaded ? this.state.news.map((val, idx) => {
                            if (idx % 2 === 0) return <a target="_blank" href={val.link}>
                                <div className="card shadow mb-4" style={{alignItems: "center", textAlign: "center", padding: 30}}>
                                <img src={val.thumbnail} style={{maxWidth: "100%", paddingBottom: 20}} alt="thumbnail" />
                                <span style={{fontSize: 20, fontWeight: "bold"}}>{val.title}</span>
                            </div>
                            </a>
                        }) : null}
                    </div>
                    {/*Right*/}
                    <div style={{width: "49%", float: "right"}}>
                        {this.state.loaded ? this.state.news.map((val, idx) => {
                            if (idx % 2 !== 0) return <a target="_blank" href={val.link}>
                                <div className="card shadow mb-4" style={{alignItems: "center", textAlign: "center", padding: 30}}>
                                <img src={val.thumbnail} style={{maxWidth: "100%", paddingBottom: 20}} alt="thumbnail" />
                                <span style={{fontSize: 20, fontWeight: "bold"}}>{val.title}</span>
                            </div>
                            </a>
                        }) : null}
                    </div>
                </div>
            </div>
        )
    }
}
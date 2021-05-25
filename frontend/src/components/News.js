import React, { Component } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import axios from 'axios';

export default class News extends Component {
    constructor(p) {
        super(p);
        this.state = {
            loaded : false ,
            searchTerm: "",
        }
        this.filter = this.filter.bind(this);
        this.clear = this.clear.bind(this);
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

    clear() {
        this.setState({
            searchTerm: ""
        })
    }

    filter(event) {
        this.setState({
            searchTerm: event.target.value
        })
    }

    render() {
        return (
            <div className="content" style={{width: "100%"}}>
                {/*Top Bar*/}
                <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                    <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                        <div className="input-group">
                            <input className="form-control bg-light border-0 small" type="text"
                                   placeholder="Search Keyword" value={this.state.searchTerm} onChange={this.filter}/>
                            <div className="input-group-append" onClick={this.clear}>
                                <button className="btn btn-primary" type="button">
                                    <ClearIcon />
                                </button>
                            </div>
                        </div>
                    </form>
                </nav>
                {/*Content*/}
                <div className="container-fluid">
                    {/*Left*/}
                    <div style={{width: "49%", float: "left"}}>
                        {this.state.loaded ? this.state.news.filter((val) =>{
                            return ((this.state.searchTerm === "") ||
                                (val.title.toLowerCase().includes(this.state.searchTerm.toLowerCase())))
                        }).map((val, idx) => {
                            if (idx % 2 === 0) return <a target="_blank" href={val.link} rel="noreferrer">
                                <div className="card shadow mb-4" style={{alignItems: "center", textAlign: "center", padding: 30}}>
                                    <img src={val.thumbnail} style={{maxWidth: "100%", paddingBottom: 20}} alt="thumbnail" />
                                    <span style={{fontSize: 20, fontWeight: "bold"}}>{val.title}</span>
                                </div>
                            </a>
                            else return null;
                        }) : null}
                    </div>
                    {/*Right*/}
                    <div style={{width: "49%", float: "right"}}>
                        {this.state.loaded ? this.state.news.filter((val) =>{
                            return ((this.state.searchTerm === "") ||
                                (val.title.toLowerCase().includes(this.state.searchTerm.toLowerCase())))
                        }).map((val, idx) => {
                            if (idx % 2 !== 0) return <a target="_blank" href={val.link} rel="noreferrer">
                                <div className="card shadow mb-4" style={{alignItems: "center", textAlign: "center", padding: 30}}>
                                    <img src={val.thumbnail} style={{maxWidth: "100%", paddingBottom: 20}} alt="thumbnail" />
                                    <span style={{fontSize: 20, fontWeight: "bold"}}>{val.title}</span>
                                </div>
                            </a>
                            else return null;
                        }) : null}
                    </div>
                </div>
            </div>
        )
    }
}
import React, { Component } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import {Button} from "@material-ui/core";
import axios from "axios";

export default class BuildAPC extends Component {
    partsType = {
        cpu: "CPU",
        gpu: "Graphics Card",
        motherboard: "Motherboard",
        ram: "Storage",
        psu: "PSU",
        case: "Case",
    }

    constructor(p) {
        super(p);
        this.state = {
            build: "",
            currentPage: "home",
            loadedProducts: null,
            catalog: {
                cpu: [],
                gpu: [],
                motherboard: [],
                ram: [],
                storage: [],
                psu: [],
                case: []
            }
        }

        this.rename = this.rename.bind(this);
        this.changeToProducts = this.changeToProducts.bind(this);
        this.changeToHome = this.changeToHome.bind(this);
    }

    rename(event) {
        this.setState({
            build: event.target.value
        });
    }

    changeToProducts(e) {
        this.setState({
            currentPage: e.currentTarget.value
        })

        let baseUrl = process.env.baseURL || "http://localhost:5000";

        axios.get(baseUrl + "/products/" + e.currentTarget["value"])
            .then(res => {
                this.setState({ loadedProducts: res.data })
            }).catch((e) => console.log(e));
    }

    changeToHome(e) {
        let selected = this.state.loadedProducts[e.currentTarget.value];
        let tempCat = this.state.catalog;
        tempCat[selected["type"]].push(selected["item_name"]);
        console.log(this.state.catalog)
        this.setState({
            currentPage: "home",
            // catalog[selected.type]: "hello"
        })
    }

    buildHome() {
        return (
            <div>
                {/*Top Bar*/}
                <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                    <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                        <div className="input-group">
                            <input className="form-control bg-light border-0 small" type="text"
                                   placeholder="Untitled Build" onChange={this.rename}/>
                            <div className="input-group-append">
                                <button type="button" style={{border: "none", backgroundColor: "transparent", marginLeft: 15}}>
                                    <SaveIcon />
                                </button>
                            </div>
                        </div>
                    </form>
                </nav>

                {/*Content*/}
                <div className="container-fluid" style={{width: "100%"}}>
                    {Object.entries(this.partsType).map((val) => {
                        return (
                            <div>
                                {/*Product Type*/}
                                <div className="card shadow mb-4" style={{margin: "auto", width: "90%", padding: 30}}>
                                    <span style={{fontSize: 20, fontWeight: "bold", width: "100%", paddingLeft: "1%"}}>
                                        {val[1]}
                                        <Button value={val[0]} onClick={this.changeToProducts} style={{float: "right"}}>
                                            <AddIcon />
                                        </Button>
                                    </span>
                                </div>

                                {/*Product Name*/}
                                {this.state.catalog[val[0]].map(spec => {
                                    return (
                                        <div className="card shadow mb-4" style={{margin: "auto", width: "70%", textAlign: "center", padding: 30}}>
                                            <span style={{fontSize: 20}}>{spec}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    buildSelect() {
        return (
            // Topbar
            <div>
                <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                    <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                        <div className="input-group">
                            <input className="form-control bg-light border-0 small" type="text"
                                   placeholder="Enter Keyword" onChange={this.rename}/>
                            <div className="input-group-append">
                                <button type="button" style={{border: "none", backgroundColor: "transparent", marginLeft: 15}}>
                                    {/*<SaveIcon />*/}
                                </button>
                            </div>
                        </div>
                    </form>
                </nav>

                {this.state.loadedProducts != null ? this.buildSelectContent() : null}
            </div>
        )
    }

    buildSelectContent() {
        return (
            // Content
            <div className="container-fluid" style={{width: "100%"}}>
                {Object.entries(this.state.loadedProducts).map((val) => {
                    console.log(val[0])
                    return (
                        <div className="card shadow mb-4" style={{margin: "auto", width: "90%", padding: 30}}>
                            <span style={{height: "min-content", display: "flex", alignItems: "center"}}>
                                <a style={{width: "80%", float: "left", marginBottom: 0}} target="_blank"
                                   href={val[1]["link"]} rel="noreferrer">
                                    {val[1]["item_name"]}
                                </a>
                                <span style={{width: "20%"}} />
                                <Button value={val[0]} onClick={this.changeToHome} style={{float: "right", width: 10}}>
                                    <AddShoppingCartIcon />
                                </Button>
                            </span>
                        </div>
                    )
                })}
            </div>
        )
    }

    render() {
        return (
            <div className="content" style={{width: "100%"}}>
                {this.state.currentPage === "home" ? this.buildHome() : this.buildSelect()}
            </div>
        )
    }
}
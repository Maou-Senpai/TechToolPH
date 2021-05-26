import React, { Component } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import DeleteIcon from '@material-ui/icons/Delete';
import {Button} from "@material-ui/core";
import axios from "axios";
import checkLoggedIn from "./Auth/UserAuth";
import '../resources/BuildAPC.css';

const initialState = {
    build: "",
    currentPage: "home",
    loadedProducts: null,
    total: 0,
    catalog: {
        cpu: [],
        gpu: [],
        motherboard: [],
        ram: [],
        storage: [],
        psu: [],
        case: []
    },
    userId: "",
    buildId: undefined
}

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
        this.state = initialState;

        this.rename = this.rename.bind(this);
        this.save = this.save.bind(this);
        this.changeToProducts = this.changeToProducts.bind(this);
        this.changeToHome = this.changeToHome.bind(this);
    }

    componentDidMount() {
        (async()=>{
            const data = await checkLoggedIn();

            this.state.userId = data.user.id;
        })();

        if(this.props.match.params){
            axios.get('http://localhost:5000/build/'+this.props.match.params.id)
                .then(res=>{
                    this.setState({
                        build: res.data.build_name,
                        catalog: res.data.build,
                        userId: res.data.userId,
                        buildId: res.data._id
                    })
                })
                .catch(err=>console.log(err));
        }
    }


    componentWillUnmount() {
        this.setState(initialState);
    }

    rename(event) {
        this.setState({
            build: event.target.value
        });
    }

    save() {
        console.log(localStorage.user);
        let baseUrl = process.env.baseURL || "http://localhost:5000";
        if(this.props.match.params.id){
            axios.post(baseUrl+"/build/update/"+this.props.match.params.id,[this.state.build,this.state.catalog,this.state.userId])
                .then((res)=>console.log(res));

        }
        else {
            if(localStorage.getItem('auth-token')!=="") {
                axios.post(baseUrl + "/build/add", [this.state.build, this.state.catalog, this.state.userId])
                    .then((res) => {
                        console.log(res);
                        this.state.buildId = res.data._id;
                        console.log(this.state.buildId);
                        window.location = "/build-pc/"+res.data._id;
                    });
            }
            else{
                console.log("Login first")
            }
        }
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
        const selected = JSON.parse(e.currentTarget.value);
        this.state.catalog[selected["type"]].push(selected);
        this.setState({
            currentPage: "home",
            total: this.state.total + parseFloat(selected["price"].replace(",", ""))
        })
    }

    buildHome() {
        return (
            <div>
                {/*Top Bar*/}
                <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                    <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                        <div className="input-group">
                            <input className="form-control bg-light border-0 small" type="text" placeholder="Untitled Build" onChange={this.rename}/>
                            <div className="input-group-append">
                                <button type="button" onClick={this.save} className="save-button">
                                    <SaveIcon />
                                </button>
                            </div>
                        </div>
                    </form>
                    <h3>{this.state.total}</h3>
                </nav>

                {/*Content*/}
                <div className="container-fluid" style={{width: "100%"}}>
                    {Object.entries(this.partsType).map((val) => {
                        return (
                            <div>
                                {/*Product Type*/}
                                <div className="card shadow mb-4 prod-type-div">
                                    <span style={{fontSize: 20, fontWeight: "bold", width: "100%", display: "flex"}}>
                                        <p key={val[1].uniqueID} className="prod-type-p">{val[1]}</p>
                                        <Button value={val[0]} onClick={this.changeToProducts}><AddIcon /></Button>
                                    </span>
                                </div>

                                {/*Product Name*/}
                                {this.state.catalog[val[0]].map(spec => {
                                    return (
                                        <div className="card shadow mb-4"
                                            style={{margin: "auto", width: "70%", textAlign: "center", padding: 30}}>
                                            <span style={{display: "flex"}}>
                                                <a key={spec["item_name"].uniqueID} href={spec["link"]} className="selected-a">{spec["item_name"]}</a>
                                                <h2 key={spec["price"].uniqueID} style={{width: "25%", margin: 0, alignSelf: "center"}}>{spec["price"]}</h2>
                                                <Button><DeleteIcon /></Button>
                                            </span>
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
                    <form className="navbar-search d-none d-sm-inline-block form-inline ml-md-3 my-2 my-md-0 mw-100" style={{width: "100%"}}>
                        <div className="input-group">
                            <input className="form-control bg-light border-0 small" type="text" style={{maxWidth: "20%"}}
                                   placeholder="Enter Keyword" onChange={this.rename}/>

                           <div className="input-group-append" style={{width: "20%"}}>
                                <input />
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
                    return (
                        <div className="card shadow mb-4" style={{margin: "auto", width: "90%", padding: 30}}>
                            <span style={{height: "min-content", display: "flex", alignItems: "center"}}>
                                <a className="prod-a" target="_blank" href={val[1]["link"]} rel="noreferrer">{val[1]["item_name"]}</a>
                                <span style={{width: "20%"}} />
                                <Button value={JSON.stringify(val[1])} onClick={this.changeToHome} style={{float: "right", width: 10}}><AddShoppingCartIcon /></Button>
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
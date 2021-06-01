import React, { Component } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import DeleteIcon from '@material-ui/icons/Delete';
import {Button, TextField} from "@material-ui/core";
import axios from "axios";
import checkLoggedIn from "./auth/UserAuth";
import '../resources/BuildAPC.css';

import {Autocomplete} from "@material-ui/lab";

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
    buildId: undefined,
    gpuBench: {},
    cpuBench: {},
    gpuOptions: [],
    cpuOptions: [],
    benchOne: null,
    benchTwo: null,
    searchTerm: "",
}

export default class BuildAPC extends Component {
    partsType = {
        cpu: "CPU",
        gpu: "Graphics Card",
        motherboard: "Motherboard",
        ram: "RAM",
        storage: "Storage",
        psu: "PSU",
        case: "Case",
    }

    baseURL = process.env.REACT_APP_API || "http://localhost:5000";

    constructor(p) {
        super(p);
        this.state = initialState;
        for (let part of Object.entries(this.state.catalog)) {
            this.state.catalog[part[0]] = [];
        }
        this.setState({
            cpuOptions: [],
            gpuOptions: []
        })

        this.rename = this.rename.bind(this);
        this.save = this.save.bind(this);
        this.changeToProducts = this.changeToProducts.bind(this);
        this.changeToHome = this.changeToHome.bind(this);
        this.delete = this.delete.bind(this);
        this.getBenchOne = this.getBenchOne.bind(this);
        this.getBenchTwo = this.getBenchTwo.bind(this);
        this.filter = this.filter.bind(this);

        axios.get(this.baseURL + "/benchmarks/gpu").then(res => {
            for (let bench of res.data) {
                this.state.gpuBench[bench.item] = bench.score;
                this.state.gpuOptions.push(bench);
            }
        })

        axios.get(this.baseURL + "/benchmarks/cpu").then(res => {
            for (let bench of res.data) {
                this.state.cpuBench[bench.item] = bench.score;
                this.state.cpuOptions.push(bench);
            }
        })
    }

    filter(event) {
        this.setState({
            searchTerm: event.target.value
        })
    }

    componentDidMount() {
        (async()=>{
            const data = await checkLoggedIn();

            this.state.userId = data.user.id;
        })();

        if(this.props.match.params){
            axios.get(this.baseURL + '/build/' + this.props.match.params.id)
                .then(res=>{
                    this.setState({
                        build: res.data.build_name,
                        catalog: res.data.build,
                        userId: res.data.userId,
                        buildId: res.data._id
                    })
                    const sum = this.state.catalog.cpu.reduce((a, b) => a + parseFloat(b.price.replace(",","")), 0)
                        +this.state.catalog.gpu.reduce((a, b) => a + parseFloat(b.price.replace(",","")), 0)
                        +this.state.catalog.motherboard.reduce((a, b) => a + parseFloat(b.price.replace(",","")), 0)
                        +this.state.catalog.ram.reduce((a, b) => a + parseFloat(b.price.replace(",","")), 0)
                        +this.state.catalog.storage.reduce((a, b) => a + parseFloat(b.price.replace(",","")), 0)
                        +this.state.catalog.psu.reduce((a, b) => a + parseFloat(b.price.replace(",","")), 0)
                        +this.state.catalog.case.reduce((a, b) => a + parseFloat(b.price.replace(",","")), 0);
                    this.setState({
                        total: sum
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

    delete(event) {
        const selected = JSON.parse(event.currentTarget.value)
        const temp = this.state.catalog;
        temp[selected["type"]] = this.state.catalog[selected["type"]].filter(val => {
            return val["_id"] !== selected ["_id"];
        })
        this.setState({
            catalog: temp,
            total: this.state.total - selected["price"].replace(',', '')
        })
    }

    save() {
        let baseUrl = process.env.baseURL || "http://localhost:5000";
        if (this.state===initialState) {

        }
        if (this.props.match.params.id ) {
            alert("Build updated!");
            axios.post(baseUrl+"/build/update/"+this.props.match.params.id,[this.state.build,this.state.catalog,this.state.userId])
                .then((res)=>console.log(res));

        }
        else {
            if(localStorage.getItem('auth-token')!=="") {

                if(this.state.build == ""){
                    alert("Rename your build first.")
                }
                else {
                    alert("Build saved!");
                }
                axios.post(baseUrl + "/build/add", [this.state.build, this.state.catalog, this.state.userId])
                    .then((res) => {
                        console.log(res);
                        this.state.buildId = res.data._id;
                        console.log(this.state.buildId);
                        window.location = "/build-pc/"+res.data._id;
                    });
            }
            else{
                alert("Save feature is only available if you have an account");
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
            total: this.state.total + parseFloat(selected["price"].replace(",", "")),
            benchOne: null,
            benchTwo: null
        })
    }



    getBenchOne(event, val) {
        if(val) {
            this.setState({
                benchOne: val.score
            })
        }
        else{
            this.setState({
                benchOne: null
            })
        }

    }

    getBenchTwo(event, val) {
        if(val) {
            this.setState({
                benchTwo: val.score
            })
        }
        else{
            this.setState({
                benchTwo: null
            })
        }
    }

    compare() {
        return [
            <div style={{display: "flex", justifyContent: "right", height: 75}}>
                <p style={{alignSelf: "center", margin: 50}}>{this.state.benchOne}</p>
                <Autocomplete
                    id="combo-box-demo"
                    options={this.state.currentPage === "cpu" ? this.state.cpuOptions : this.state.gpuOptions}
                    getOptionLabel={option => option.item}
                    onChange={this.getBenchOne}
                    style={{width: 300, alignSelf: "center", marginLeft: 10}}
                    renderInput={(params) => <TextField {...params} label="Compare Product 1 Benchmark" variant="outlined" />}
                />
            </div>
            ,
            <div style={{display: "flex", justifyContent: "right", height: 75}}>
                <p style={{alignSelf: "center", margin: 50}}>{this.state.benchTwo}</p>
                <Autocomplete
                    id="combo-box-demo"
                    options={this.state.currentPage === "cpu" ? this.state.cpuOptions : this.state.gpuOptions}
                    getOptionLabel={option => option.item}
                    onChange={this.getBenchTwo}
                    style={{width: 300, alignSelf: "center", marginLeft: 10}}
                    renderInput={(params) => <TextField {...params} label="Compare Product 2 Benchmark" variant="outlined" />}
                />
            </div>
        ]
    }

    buildHome() {
        return (
            <div>
                {/*Top Bar*/}
                <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                    <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                        <div className="input-group">
                            <input className="form-control bg-light border-0 small" type="text" placeholder={this.state.build !== ""?(this.state.build):("Untitled Build")} onChange={this.rename}/>
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
                                                <h2 key={spec["price"].uniqueID} style={{width: "45%", margin: 0, alignSelf: "center"}}>{spec["price"]}</h2>
                                                <Button onClick={this.delete} value={JSON.stringify(spec)}><DeleteIcon /></Button>
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
                <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow" style={{height: "20%"}}>
                    <form className="navbar-search d-none d-sm-inline-block form-inline ml-md-3 my-2 my-md-0 mw-100"
                          style={{width: "100%", height: "100%"}}>
                        <div className="input-group" style={{height: "100%"}}>
                            <input className="form-control bg-light border-0 small" type="text" style={{maxWidth: "20%", height: 70, alignSelf: "center"}}
                                   placeholder="Enter Keyword" onChange={this.filter}/>
                            <div className="input-group-append" style={{width: "80%", display: "block"}}>
                                {this.state.currentPage === "cpu" || this.state.currentPage === "gpu" ? this.compare() : null}
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
                {Object.entries(this.state.loadedProducts).filter((val) =>{
                    return ((this.state.searchTerm === "") ||
                        (val[1]["item_name"].toLowerCase().includes(this.state.searchTerm.toLowerCase())))
                }).map((val) => {
                    return (
                        <div className="card shadow mb-4" style={{margin: "auto", width: "90%", padding: 30}}>
                            <span style={{height: "min-content", display: "flex", alignItems: "center"}}>
                                <a className="prod-a" target="_blank" href={val[1]["link"]} rel="noreferrer">{val[1]["item_name"]}</a>
                                <span style={{width: "20%", textAlign: "right"}}>{val[1]["price"]}</span>
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
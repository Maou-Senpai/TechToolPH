import React, { Component } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import checkLoggedIn from "./auth/UserAuth";
import '../resources/BuildAPC.css';

import { Autocomplete } from "@material-ui/lab";
import SearchIcon from '@material-ui/icons/Search';
import { LoopCircleLoading } from 'react-loadingg';
import stringSimilarity from 'string-similarity';

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
    availCPU: null,
    availGPU: null,
    avail: []
}

// noinspection DuplicatedCode
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
            gpuOptions: [],
            query: "",
            gameDebateQuery: []
        })

        this.rename = this.rename.bind(this);
        this.save = this.save.bind(this);
        this.changeToProducts = this.changeToProducts.bind(this);
        this.changeToHome = this.changeToHome.bind(this);
        this.delete = this.delete.bind(this);
        this.getBenchOne = this.getBenchOne.bind(this);
        this.getBenchTwo = this.getBenchTwo.bind(this);
        this.filter = this.filter.bind(this);
        this.onAppQuery = this.onAppQuery.bind(this);
        this.onReqKey = this.onReqKey.bind(this);
        this.onRenameEnter = this.onRenameEnter.bind(this);

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
        (async () => {
            const data = await checkLoggedIn();

            this.state.userId = data.user.id;
        })();

        if (this.props.match.params) {
            axios.get(this.baseURL + '/build/' + this.props.match.params.id)
                .then(res => {
                    this.setState({
                        build: res.data.build_name,
                        catalog: res.data.build,
                        userId: res.data.userId,
                        buildId: res.data._id
                    })
                    const sum = this.state.catalog.cpu.reduce((a, b) => a + parseFloat(b.price.replace(",","")), 0)
                        + this.state.catalog.gpu.reduce((a, b) => a + parseFloat(b.price.replace(",","")), 0)
                        + this.state.catalog.motherboard.reduce((a, b) => a + parseFloat(b.price.replace(",","")), 0)
                        + this.state.catalog.ram.reduce((a, b) => a + parseFloat(b.price.replace(",","")), 0)
                        + this.state.catalog.storage.reduce((a, b) => a + parseFloat(b.price.replace(",","")), 0)
                        + this.state.catalog.psu.reduce((a, b) => a + parseFloat(b.price.replace(",","")), 0)
                        + this.state.catalog.case.reduce((a, b) => a + parseFloat(b.price.replace(",","")), 0);
                    this.setState({
                        total: sum
                    })
                })
                .catch(err => console.log(err));
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
        let deleted = false;
        temp[selected["type"]] = this.state.catalog[selected["type"]].filter(val => {
            if (val["_id"] === selected["_id"] && !deleted) {
                deleted = true;
                return false;
            } else return true;
        })
        this.setState({
            catalog: temp,
            total: this.state.total - selected["price"].replace(',', '')
        })
    }

    save() {
        if (this.state===initialState) {

        }
        if (this.props.match.params.id ) {
            alert("Build updated!");
            axios.post(this.baseURL + "/build/update/" +
                this.props.match.params.id,[this.state.build,this.state.catalog,this.state.userId])
                .then(res => console.log(res));

        }
        else {
            if (localStorage.getItem('auth-token') !== "") {

                if (this.state.build === "") {
                    alert("Rename Your Build First.")
                }
                else {
                    alert("Build Saved!");
                }
                axios.post(this.baseURL + "/build/add", [this.state.build, this.state.catalog, this.state.userId])
                    .then((res) => {
                        console.log(res);
                        this.state.buildId = res.data._id;
                        console.log(this.state.buildId);
                        window.location = "/build-pc/"+res.data._id;
                    });
            }
            else {
                alert("Save Feature is Only Available if You Have an Account");
                console.log("Login First")
            }
        }
    }

    changeToProducts(e) {
        console.log(e.currentTarget["value"]);
        this.setState({
            currentPage: e.currentTarget.value
        })

        axios.get(this.baseURL + "/products/" + e.currentTarget["value"])
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
            <div style={{display: "flex", justifyContent: "flex-end", height: 75}}>
                <p style={{alignSelf: "center", margin: 50}}>Passmark Score:   {this.state.benchOne}</p>
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
            <div style={{display: "flex", justifyContent: "flex-end", height: 75}}>
                <p style={{alignSelf: "center", margin: 50}}>Passmark Score:   {this.state.benchTwo}</p>
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

    onRenameEnter(e) {
        console.log(e)
        if (e.key === "Enter") {
            e.preventDefault();
            this.save();
        }
    }

    buildHome() {
        return (
            <div>
                {/*Top Bar*/}
                <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                    <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                        <div className="input-group">
                            <input className="form-control bg-light border-0 small" type="text"
                                   placeholder={this.state.build !== "" ? (this.state.build) :
                                       ("Untitled Build")} onChange={this.rename} onKeyPress={this.onRenameEnter}/>
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
                                        <Button value={val[0]} onClick={this.changeToProducts}><AddShoppingCartIcon /></Button>
                                    </span>
                                </div>

                                {/*Product Name*/}
                                {this.state.catalog[val[0]].map(spec => {
                                    return (
                                        <div className="card shadow mb-4 selected-div">
                                            <img src={spec.image} alt="Product Image" className="selected-icon" />
                                            <span style={{display: "flex", width: "90%"}}>
                                                <a key={spec["item_name"].uniqueID} href={spec["link"]} className="selected-a">
                                                    {spec["item_name"]}
                                                </a>
                                                <h2 key={spec["price"].uniqueID} className="selected-price">{spec["price"]}</h2>
                                                <Button onClick={this.delete} value={JSON.stringify(spec)}><DeleteIcon /></Button>
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>

                {/*Requirement Checker*/}
                {this.requirement()}
            </div>
        )
    }

    sortAndFilter(option) {
        console.log(this.state.loadedProducts);
        let sorted;

        if (option !== undefined) {
            if (option === 0) {
                sorted = Object.entries(this.state.loadedProducts).sort((a, b) => {
                    return parseFloat(a[1].price.replace(",", "")) - parseFloat(b[1].price.replace(",", ""));
                });
            } else if (option === 1) {
                sorted = Object.entries(this.state.loadedProducts).sort((a, b) => {
                    return parseFloat(b[1].price.replace(",", "")) - parseFloat(a[1].price.replace(",", ""));
                });
            }

            console.log(sorted);
            const newLoaded = {};
            sorted.forEach((val, idx) => {
                newLoaded[idx] = val[1];
            })
            console.log(newLoaded);
        }

        return Object.entries(this.state.loadedProducts).filter((val) => {
            return ((this.state.searchTerm === "") ||
                (val[1]["item_name"].toLowerCase().includes(this.state.searchTerm.toLowerCase())) ||
                (val[1]["source"].toLowerCase().includes(this.state.searchTerm.toLowerCase())))
        })
    }

    prodFilter() {
        return (
            <div className="filter-div">
                <input className="form-control bg-light border-0 small filter-input"
                       type="text" placeholder="Enter Keyword" onChange={this.filter}/>
                <Button className="sort" onClick={() => this.sortAndFilter(0)}>Price Ascending</Button>
                <Button className="sort" onClick={() => this.sortAndFilter(1)}>Price Descending</Button>
            </div>
        )
    }

    buildSelect() {
        return (
            // Topbar
            <div>
                <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow" style={{height: "20%"}}>
                    <div className="selection-top">
                        {this.prodFilter()}
                        <div className="input-group compare-div">
                            {this.state.currentPage === "cpu" || this.state.currentPage === "gpu" ? this.compare() : null}
                        </div>
                    </div>
                </nav>

                {this.state.loadedProducts != null ? this.buildSelectContent() : null}
            </div>
        )
    }

    buildSelectContent() {
        return (
            // Content
            <div className="container-fluid" style={{width: "100%"}}>
                {this.sortAndFilter().map((val) => {
                    return (
                        <div className="card shadow mb-4" style={{margin: "auto", width: "90%", padding: 30}}>
                            <span style={{height: "min-content", display: "flex", alignItems: "center"}}>
                                <img src={val[1].image} alt="Product Image" className="selected-icon" />
                                <a className="prod-a" target="_blank" href={val[1]["link"]}
                                   rel="noreferrer">{val[1]["item_name"]}</a>
                                <span className="prod-span">{val[1]["price"]}</span>
                                <Button value={JSON.stringify(val[1])} onClick={this.changeToHome}
                                        style={{float: "right", width: 10}}><AddShoppingCartIcon /></Button>
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

    requirement() {
        return (
            <div style={{marginBottom: 50}}>
                <hr style={{height: 20, margin: 50}} />
                <h2 style={{textAlign: "center", marginBottom: 50, marginRight: 40}} ref={el => this.gamesCard = el}>
                    Product Recommendation Based on Requirements
                </h2>
                <div style={{display: "flex", justifyContent: "center"}}>
                    {this.appInput()}
                </div>
                {this.queryResults()}
            </div>
        )
    }

    recParts(val) {
        const rtn = [];

        rtn.push(<h2 className="prod-type-p reqTitle" style={{fontSize: 18, fontWeight: "bold", marginTop: 10}}>
            Recommended CPU:
        </h2>);
        rtn.push(<p className="prod-type-p reqTitle" style={{fontSize: 16}}>{val.cpu.join(" or ")}</p>);

        rtn.push(<h3 className="prod-type-p reqTitle" style={{fontSize: 18, fontWeight: "bold", marginTop: 10}}>
            Recommended GPU:
        </h3>);
        rtn.push(<p className="prod-type-p reqTitle" style={{fontSize: 16}}>{val.gpu.join(" or ")}</p>);

        return rtn;
    }

    availProd(val) {
        const rtn = [];

        let reco = [];

        reco.push(...val.recoCPU.map(val => this.state.availCPU[val]));
        reco.push(...val.recoGPU.map(val => this.state.availGPU[val]));

        reco.forEach(prod => {
            rtn.push(
                <div className="card shadow availProd">
                <span style={{fontSize: 20, fontWeight: "bold", width: "100%", display: "flex"}}>
                    <img className="reco-icon" src={prod.image} alt="Product Thumbnail" />
                    <a href={prod.link} className="reco-prod">{prod.item_name}</a>
                    <Button onClick={() => this.addReco(prod)}><AddShoppingCartIcon /></Button>
                </span>
                </div>
            )
        });

        return rtn;
    }

    addReco(selected) {
        this.state.catalog[selected["type"]].push(selected);
        this.setState({
            total: this.state.total + parseFloat(selected["price"].replace(",", ""))
        })
    }

    queryResults() {
        if (this.state.gameDebateQuery !== undefined) {
            let results = [];
            this.state.gameDebateQuery.slice(0, 5).forEach(val => {
                results.push(
                    <div className="card shadow mb-4 prod-type-div req">
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                            <img src={val.image}  alt="Game Cover" className="reqCover" />
                        </div>
                        <div className="details">
                            <p className="prod-type-p reqTitle" style={{fontSize: 22, fontWeight: "bold"}}>{val.title}</p>
                            {this.recParts(val)}
                        </div>
                        <div className="availDiv">
                            {this.availProd(val)}
                        </div>
                    </div>
                )
            })

            return results;
        }
    }

    onAppQuery(event) {
        this.setState({
            query: event.target.value
        })
    }

    async preload() {
        if (this.state.availCPU === null) {
            await axios.get(this.baseURL + "/products/" + "cpu")
                .then(res => {
                    this.setState({ availCPU: res.data })
                }).catch((e) => console.log(e));

            await axios.get(this.baseURL + "/products/" + "gpu")
                .then(res => {
                    this.setState({ availGPU: res.data })
                }).catch((e) => console.log(e));

            await this.setState({
                cpuArr: this.state.availCPU.map(val => val.item_name.slice(0, 50)),
                gpuArr: this.state.availGPU.map(val => val.item_name.slice(0, 50))
            })
        }
    }

    async appQuery() {
        if (this.state.query !== undefined && this.state.query.length >= 3) {
            this.setState({
                loading: true
            })

            await this.preload();

            await axios.get(this.baseURL + "/requirements/search/" + this.state.query)
                .then(res => {
                    this.setState({
                        gameDebateQuery: res.data
                    });
                });

            const toThis = this.gamesCard;
            toThis.scrollIntoView({ behavior: "smooth" });

            // Get Actual Parts
            await this.state.gameDebateQuery.forEach(val => {
                axios.post(this.baseURL + "/requirements/link", {
                    link: val.link
                }).then(res => {
                    res.data.cpu.forEach(part => {
                        const best = stringSimilarity.findBestMatch(part, this.state.cpuArr);
                        if (best.bestMatch.rating >= 0.2) val.recoCPU.push(best.bestMatchIndex);
                    });
                    res.data.gpu.forEach(part => {
                        const best = stringSimilarity.findBestMatch(part, this.state.gpuArr);
                        if (best.bestMatch.rating >= 0.2) val.recoGPU.push(best.bestMatchIndex);
                    });

                    val.cpu.push(...res.data.cpu);
                    val.gpu.push(...res.data.gpu);
                }).then(() => {
                    this.setState({ partsLoaded: true });
                });
            });

            await this.setState({
                loading: false
            });
        }
    }

    appInput() {
        return(
            <div className="input-group" style={{justifyContent: "center", width: "100%"}}>
                <input className="form-control bg-light border-0 small" onChange={this.onAppQuery} onKeyPress={this.onReqKey}
                       style={{zIndex: 0, height: 60, maxWidth: "50%"}} type="text"
                       placeholder="Enter Game (3 or More Characters)"/>
                <div className="input-group-append">
                    <Button type="button" style={{height: 60, marginLeft: 10 ,marginRight: 20}} onClick={() => this.appQuery()}>
                        <SearchIcon />
                    </Button>
                    <div>
                        {this.state.loading ? <LoopCircleLoading style={{inset: "unset"}} /> : null}
                    </div>
                </div>
            </div>
        )
    }

    onReqKey(e) {
        if (e.key === "Enter") this.appQuery().then();
    }
}
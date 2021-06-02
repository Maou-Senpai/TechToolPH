import React, { Component } from 'react';
import axios from "axios";
import '../../resources/BuildAPC.css';
import {Image} from "semantic-ui-react";



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

}

export default class UserBuild extends Component {
    partsType = {
        cpu: "CPU",
        gpu: "Graphics Card",
        motherboard: "Motherboard",
        ram: "RAM",
        storage: "Storage",
        psu: "PSU",
        case: "Case",
    }

    constructor(p) {
        super(p);
        this.state = initialState;
        for (let part of Object.entries(this.state.catalog)) {
            this.state.catalog[part[0]] = [];
        }
    }

    baseURL = process.env.REACT_APP_API || "http://localhost:5000";

    componentDidMount() {
        axios.get(this.baseURL + '/build/' + this.props.dataFromParent)
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

    componentWillUnmount() {
        this.setState(initialState);
    }

    buildHome() {
        return (
            <div>
                {/*Top Bar*/}
                <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                    <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                        <div className="input-group">
                            <h3>Total:</h3>
                            <div className="input-group-append">
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
                                <div className="card shadow mb-4 prod-type-div" >
                                    <span style={{fontSize: 15, fontWeight: "bold", width: "100%", display: "flex" }}>
                                        <p key={val[1].uniqueID} className="prod-type-p">{val[1]}</p>
                                    </span>
                                </div>

                                {/*Product Name*/}
                                {this.state.catalog[val[0]].map(spec => {
                                    return (
                                        <div className="card shadow mb-4"
                                            style={{margin: "auto", width: "75%", textAlign: "center", padding: 10}}>
                                            <span style={{display: "flex"}}>
                                                <Image wrapped spaced size="small" verticalAlign='middle'  src={'http:'+spec["image"]} alt={"Product thumbnail"}/>
                                                <a key={spec["item_name"].uniqueID} href={spec["link"]} className="selected-b">{spec["item_name"]}</a>
                                                <h2 key={spec["price"].uniqueID} style={{width: "45%", margin: 0, alignSelf: "center"}}>{spec["price"]}</h2>
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

    render() {
        return (
            <div className="content" style={{width: "100%" ,marginLeft:"0rem"}}>
                {this.buildHome()}
            </div>
        )
    }
}
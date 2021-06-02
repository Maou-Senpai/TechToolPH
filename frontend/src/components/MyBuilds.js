import React,{Component} from 'react';

import { Link} from "react-router-dom";
import axios from 'axios';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import checkLoggedIn from "./auth/UserAuth";
import {Button, Modal} from "semantic-ui-react";

const Build = props => {
    return(
        <tr>
            <td>{props.build.build_name}</td>
            <td>{props.build.updatedAt}</td>
            <td className="text-center">
                <Link to={'/my-builds/'+props.build._id} className="btn btn-sm btn-danger" style={{marginRight: "0.2rem"}}>View</Link>
                <Link to={'/build-pc/'+props.build._id} className="btn btn-sm btn-info" style={{marginRight: "0.2rem"}}>Edit</Link>
                <a href="#" onClick={()=>{props.deletebuild(props.build._id)}} className="btn btn-sm btn-primary" style={{marginRight: "0.2rem"}}>Delete</a>
            </td>
        </tr>
    )
};

export default class MyBuild extends Component {
    constructor(props) {
        super(props);

        this.state = {build:[],delete:undefined};
        this.deletebuild = this.deletebuild.bind(this);
        this.getDelete = this.getDelete.bind(this);
        this.clearDelete = this.clearDelete.bind(this);
    }

    baseURL = process.env.REACT_APP_API || "http://localhost:5000";

    componentDidMount() {
        (async()=>{
            const data = await checkLoggedIn();
            console.log(data);

            if(data.token !== "") {
                axios.get(this.baseURL + '/user/builds/' + data.user.id)
                    .then(res => {
                        this.setState({build: res.data})
                        console.log(res.data);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        })();

    }

    deletebuild(e){
        const id = e.currentTarget.id;
        axios.delete(this.baseURL + '/build/delete/'+id)
            .then(res=>alert(res.data))
            this.setState({
                build: this.state.build.filter(el=>el._id !== id),
                delete: undefined
            })
    }

    getDelete(e){
        const a = {name:e.currentTarget.value, id:e.currentTarget.id}

        this.setState({delete: a})
    }

    clearDelete(){
        this.setState({
            delete: undefined
        })

    }


    builds(){
        return this.state.build.map(curBuild =>{
            return (
                <tr>
                    <td>{curBuild.build_name}</td>
                    <td>{curBuild.updatedAt}</td>
                    <td className="text-center">
                        <Link to={'/my-builds/'+curBuild._id}><Button color="teal" style={{marginRight: "0.2rem", padding:10}}>View</Button></Link>
                        <Link to={'/build-pc/'+curBuild._id}><Button color="blue" style={{marginRight: "0.2rem",padding:10}}>Edit</Button></Link>
                        <Button value={curBuild.build_name} id={curBuild._id} color="grey" onClick={this.getDelete} style={{marginRight: "0.2rem",padding:10}}>Delete</Button>
                    </td>
                </tr>
            )
        })
    }

    render(){
        const token = localStorage.getItem("auth-token");
        let data = true;
        if(token==="" || token===null){
            data = false;
        }

        if(this.state.delete){
            return (
                <Modal open dimmer="blurring" className='modal' size="mini">
                    <Modal.Header>{this.state.delete.name}</Modal.Header>
                    <Modal.Content scrolling style={{width: "100%", marginLeft:"0rem", marginTop:"0rem"}}>
                        Are you sure you want to delete this build?
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.clearDelete}>Cancel</Button>
                        <Button id={this.state.delete.id} type="button" onClick={this.deletebuild}>Delete</Button>
                    </Modal.Actions>
                </Modal>)
        }

        return (
            <div className='MyBuilds text-center' style={{marginLeft: "14rem", marginTop: 30, width: "100%"}}>
                {data?(<div>
                <h1 style={{marginBottom: 40}}>MY BUILDS</h1>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <table className="table table-bordered table-hover" style={{width: "80%"}}>
                        <thead className="thead-dark">
                            <tr>
                                <th>Build Name</th>
                                <th>Last Modified</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.builds()}
                        </tbody>
                    </table>
                </div></div>):(
                    <>
                    <h2>Log in to access saved builds!</h2>
                    </>)}
            </div>

        );
    }
}


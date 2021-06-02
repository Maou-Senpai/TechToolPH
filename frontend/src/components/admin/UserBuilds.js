import React, { Component } from 'react';
import {Button,Modal} from 'semantic-ui-react';
import axios from 'axios';
import '../../resources/Modal.css';



import {Link} from "react-router-dom";
import UserBuild from './UserBuild';



/*
state format:

builds {
    _id
    build_name
}
username
_id

 */



export default class UserBuilds extends Component {
    constructor(props) {
        super(props);

        this.state = {
            current: 0,
            build:[],
            curBuild: "",
            curBuild_name: ""
        };


        this.switch = this.switch.bind(this);
        this.return = this.return.bind(this);
    }

    return(){
        this.setState({
            current: 0,
            curBuild: "",
            curBuild_name: ""
        })
    }

    switch(e){
        const id = e.currentTarget.id;
        const name = e.currentTarget.value;

        this.setState({
            current: 1,
            curBuild: id,
            curBuild_name: name
        })
    }

    baseURL = process.env.REACT_APP_API || "http://localhost:5000";

    componentDidMount() {
        axios.get(this.baseURL + '/user/builds/' + this.props.match.params.id)
            .then(res => {
                this.setState({build: res.data})
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    builds(){
        return this.state.build.map(curBuild =>{
            return (
                <tr>
                    <td>{curBuild.build_name}</td>
                    <td>{curBuild.updatedAt}</td>
                    <td className="text-center">
                        <Button id={curBuild._id} value={curBuild.build_name} type="button" onClick={this.switch}>View</Button>
                    </td>
                </tr>
            )
        })
    }

    UserBuilds(){
        return (
            <div className='MyBuilds text-center' style={{width:"100%",marginLeft: "0rem", marginTop: "0rem"}}>
                <h1>BUILDS</h1>
                <table className="table table-bordered table-hover">
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
            </div>

        );
    }

    render() {
        return (
            <Modal open dimmer="blurring" className='modal'>

                <Modal.Header>{this.props.location.state.username}</Modal.Header>
                <Modal.Content scrolling style={{width: "100%", marginLeft:"0rem", marginTop:"0rem"}}>
                    {this.state.current===1?(<UserBuild dataFromParent = {this.state.curBuild}/> ):(this.UserBuilds())}
                </Modal.Content>
                <Modal.Actions>
                    <Link to="/admin-settings"><Button>Close</Button></Link>
                    {this.state.current===1? (<Button type="button" onClick={this.return}>Back</Button>):(<></>)}


                </Modal.Actions>
            </Modal>
        );
    }
}

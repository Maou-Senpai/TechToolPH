import React, { Component } from 'react';
import {Button, Modal } from 'semantic-ui-react';
import axios from 'axios';
import '../resources/Modal.css';
import MyBuild from '../components/admin/UserBuild'
import {Link} from "react-router-dom";



/*
state format:

builds {
    _id
    build_name
}
username
_id

 */


export default class ViewMyBuild extends Component {
    constructor(props) {
        super(props);

        this.state = {
            build: ""
        };

    }

    baseURL = process.env.REACT_APP_API || "http://localhost:5000";

    componentDidMount() {
        axios.get(this.baseURL + "/build/" + this.props.match.params.id)
            .then(res=>{
                this.setState({
                    build: res.data.build_name,
                })
            })
            .catch(err=>console.log(err));
    }

    render() {
        return (
            <Modal open dimmer="blurring" className='modal'>
                <Modal.Header>{this.state.build}</Modal.Header>
                <Modal.Content scrolling style={{width: "100%", marginLeft:"0rem", marginTop:"0rem"}}>
                    <MyBuild dataFromParent = {this.props.match.params.id}/>
                </Modal.Content>
                <Modal.Actions>
                    <Link to="/my-builds"><Button>Close</Button></Link>
                    <Link to={'/build-pc/'+this.props.match.params.id}><Button>Edit</Button></Link>

                </Modal.Actions>
            </Modal>
        );
    }
}

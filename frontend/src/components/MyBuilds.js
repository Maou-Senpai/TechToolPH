import React,{useContext,Component} from 'react';
import UserContext from "../components/context/UserContext";
import {BrowserRouter as Router, Link} from "react-router-dom";
import axios from 'axios';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import jwtdecode from 'jwt-decode';

const Build = props => {
    return(
        <tr>
            <td>{props.build.build_name}</td>
            <td>{props.build.updatedAt}</td>
            <td className="text-center">
                <Link to={'/edit/'+props.build._id} className="btn btn-sm btn-primary">Edit</Link>
                <a href="#" onClick={()=>{props.deletebuild(props.build._id)}} className="btn btn-sm btn-danger">Delete</a>
            </td>
        </tr>
    )
};

export default class MyBuild extends Component {
    constructor(props) {
        super(props);

        this.state = {build:[]};
        this.deletebuild = this.deletebuild.bind(this);
    }

    componentDidMount() {
        const token = localStorage.getItem("auth-token");
        if(token!="" && token!=null) {
            const data = jwtdecode(token);
            console.log(JSON.stringify(data.id));

            axios.get('http://localhost:5000/user/builds/' + data.id)
                .then(res => {
                    this.setState({build: res.data})
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    deletebuild(id){
        axios.delete('http://localhost:5000/build/delete/'+id)
            .then(res=>console.log(res.data))
            this.setState({
                build: this.state.build.filter(el=>el._id !== id)
            })

    }

    builds(){
        return this.state.build.map(curBuild =>{
            return <Build build = {curBuild} deletebuild={this.deletebuild} key={curBuild._id}
                          />
        })
    }

    render(){
        const token = localStorage.getItem("auth-token");
        let data = true;
        if(token=="" || token==null){
            data = false;
        }
        return (
            <div className='MyBuilds text-center'>
                {data?(<div>
                <h1>My Builds</h1>
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
                </table> </div>):(
                    <>
                    <h2>Log in first</h2>
                    </>)}
            </div>

        );
    }
}


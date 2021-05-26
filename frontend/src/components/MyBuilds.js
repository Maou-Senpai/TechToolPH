import React,{Component} from 'react';

import { Link} from "react-router-dom";
import axios from 'axios';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

//import UserContext from "../components/context/UserContext";
//import jwtdecode from 'jwt-decode';

import checkLoggedIn from "./Auth/UserAuth";

const Build = props => {
    return(
        <tr>
            <td>{props.build.build_name}</td>
            <td>{props.build.updatedAt}</td>
            <td className="text-center">
                <Link to={'/build-pc/'+props.build._id} className="btn btn-sm btn-info">Edit</Link>
                <a href="#" onClick={()=>{props.deletebuild(props.build._id)}} className="btn btn-sm btn-primary">Delete</a>
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
        (async()=>{
            const data = await checkLoggedIn();
            console.log(data);

            if(data.token != "") {
                axios.get('http://localhost:5000/user/builds/' + data.user.id)
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
            <div className='MyBuilds text-center' style={{marginLeft: "20rem", marginTop: "5rem"}}>
                {data?(<div>
                <h1>MY BUILDS</h1>
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
                    <h2>Log in to access saved builds!</h2>
                    </>)}
            </div>

        );
    }
}


import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SaveIcon from '@material-ui/icons/Save';

export default class News extends Component {
    constructor(p) {
        super(p);
        this.state = { buildName : "" }

        this.rename = this.rename.bind(this);
    }

    // componentDidMount() {
    //     let baseUrl = process.env.baseURL || "http://localhost:5000";
    //
    //     axios.get(baseUrl + "/news/")
    //         .then(res => {
    //             this.setState({ news : res.data })
    //             this.setState({ loaded : true });
    //         })
    //         .catch((e) => console.log(e));
    // }

    rename(event) {
        this.setState({ buildName : event.target.value});
    }

    render() {
        return (
            <div className="content" style={{width: "100%"}}>
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
                    {/*CPU*/}
                    <Link to='/parts'>
                    <div className="card shadow mb-4" style={{margin: "auto", width: "80%", textAlign: "center", padding: 30}}>
                        <span style={{fontSize: 20, fontWeight: "bold"}}>CPU</span>
                    </div>
                    </Link>
                    <div className="card shadow mb-4" style={{margin: "auto", width: "50%", textAlign: "center", padding: 30}}>
                        <span style={{fontSize: 20, fontWeight: "bold"}}>CPU</span>
                    </div>

                    {/*GPU*/}
                    <div className="card shadow mb-4" style={{margin: "auto", width: "80%", textAlign: "center", padding: 30}}>
                        <span style={{fontSize: 20, fontWeight: "bold"}}>GPU</span>
                    </div>
                </div>
            </div>
        )
    }
}
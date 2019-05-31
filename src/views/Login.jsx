import React, { Component } from "react";
import swal from 'sweetalert';
import '../assets/css/Login.css';
import axios from 'axios';
class Login extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            token: localStorage.getItem('jwtToken'),
            email:null,
            password:null
        }
    }

    componentWillMount(){
        document.body.className = 'login';
        let root = document.documentElement;
        root.className += ' login';
    }

    login(e){
        axios.post(process.env.REACT_APP_API_URL + '/api/login', this.state).then((res) => {
            localStorage.setItem('jwtToken', res.data.token);
            this.props.history.push('docs');
        }).catch(error => {
            localStorage.removeItem('jwtToken');
            swal("Error!", error.response.data.error, "error");
        });
    }

    handleChange(e){
        this.setState({[e.target.name]:e.target.value});
    }

    render() {
        if (localStorage.getItem('jwtToken')) {
            window.location.reload();
        }
        return(
            <div className="wrapper fadeInDown">
                <div id="formContent">
                    <div className="fadeIn first">
                        <img src="/access.png" id="icon" alt="User Icon" />
                    </div>
                    <form>
                        <input type="email" id="login" className="fadeIn second" name="email" onChange={this.handleChange} placeholder="Enter Email" />
                        <input type="password" id="password" className="fadeIn third" name="password" onChange={this.handleChange} placeholder="Enter Password" />
                        <input type="button" className="fadeIn fourth" onClick={this.login} value="Log In"/>
                    </form>
                </div>
            </div>
        )
    }
}

export default Login;
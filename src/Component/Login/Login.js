import React, { Component } from 'react';
import { Input, Button } from 'antd'
import GoogleButton from 'react-google-button'
import firebase_init,{auth,Authprovider} from '../../firebase_int'
import './Login.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { password: '' ,username:''};

        this.handleChangePass = this.handleChangePass.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChangePass(event) {
        this.setState({ password: event.target.value });
    }
    handleChangeName(event) {
        this.setState({ username: event.target.value });
    }

    
    handleSubmit(){
        auth.signInWithPopup(Authprovider) 
        .then((result) => {
          const user = result.user;
          this.props.confirmUser(user);
        });
    }

    render() {
        return (
            <div className="Login">
            
                <GoogleButton onClick={this.handleSubmit}/>
            </div>
        );
    }
}

export default Login;

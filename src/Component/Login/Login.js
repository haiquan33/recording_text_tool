import React, { Component } from 'react';
import { Input, Button } from 'antd'


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
            this.props.confirmUser(this.state.username,this.state.password);
    }

    render() {
        return (
            <div className="Login">
                <Input placeholder="Ten dang nhap" value={this.state.username} onChange={this.handleChangeName}  />
                <input placeholder="Password" type="password" name="password" value={this.state.password} onChange={this.handleChangePass} />
                <Button type="primary" onClick={this.handleSubmit}>Login</Button>
            </div>
        );
    }
}

export default Login;

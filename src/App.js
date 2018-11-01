import React, { Component } from 'react';
import logo from './logo.svg';
import Login from './Component/Login/Login.js'
import RecordTextTool from './RecordTextTool'
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import './App.css';
import 'antd/dist/antd.css';
class App extends Component {

  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
  constructor(props) {
    super(props);
    const { cookies } = props;
    this.state = { LoggedIn: false }
    this.confirmUser = this.confirmUser.bind(this);
    this.logout=this.logout.bind(this);
  }

  confirmUser(username, password) {
    const { cookies } = this.props;

    if (password === '') {
      cookies.set('username', username, { path: '/' });
      this.setState({ LoggedIn: true, username });
    }
  }

  logout(){
    const { cookies } = this.props;

    this.setState({LoggedIn:false,username:null},()=>{
      cookies.remove('username',{ path: '/' });
    })
  }

  componentDidMount() {
    const { cookies } = this.props;
   
      let username = cookies.get("username");
      if (username) {
        this.setState({
          LoggedIn: true,
          username
        })
      }
    

  }

  render() {
    return (

      <div className="App">
        {this.state.LoggedIn ?
          <RecordTextTool logout={this.logout}  username={this.state.username} />
          : <Login confirmUser={this.confirmUser} />
        }

      </div>
    );
  }
}

export default withCookies(App);

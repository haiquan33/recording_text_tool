import React, { Component } from 'react';
import logo from './logo.svg';
import Login from './Component/Login/Login.js'
import RecordTextTool from './RecordTextTool'
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import firebase_init,{auth,Authprovider} from './firebase_int'

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

  confirmUser(user) {
    const { cookies } = this.props;

    if (user) {
     
      this.setState({ LoggedIn: true, username:user.displayName,userInfo:user });
    }
  }

  logout(){
    const { cookies } = this.props;
    auth.signOut()
    .then(() => {
      this.setState({
        user: null,LoggedIn:false
      });
    });
  
  }

  componentDidMount() {
    const { cookies } = this.props;
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ username:user.displayName,LoggedIn:true,userInfo:user });
      } 
    });
      // let username = cookies.get("username");
      // if (username) {
      //   this.setState({
      //     LoggedIn: true,
      //     username
      //   })
      // }
    

  }

  render() {
   
    return (

      <div className="App">
      
        {this.state.LoggedIn ?
          <RecordTextTool userInfo={this.state.userInfo} logout={this.logout}  username={this.state.username} />
          : <Login confirmUser={this.confirmUser} />
        }

      </div>
    );
  }
}

export default withCookies(App);

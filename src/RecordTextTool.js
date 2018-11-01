import React, { Component } from 'react';

import { Layout, Menu, Breadcrumb, Button } from 'antd';


import { RecordingForm } from './Component/RecordingForm'
import Home from './Component/Home/Home'
import Review from './Component/Review/Review'
import './RecordTextTool.css'

const { Header, Content, Footer } = Layout;


class RecordingTextTool extends Component {

    constructor(props){
        super(props);
        this.state={OpeningPage:"home"}
       
    }

    handleClick = (e) => {
        this.setState({OpeningPage:e.key})
      }

    render() {
        return (
            <Layout className="layout">
                <Header className="Header" >
                    <div className="logo" >Chương trình làm ngoại ngữ đa dạng</div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['home']}
                        style={{ lineHeight: '64px' }}
                        onClick={this.handleClick}
                    >   
                         <Menu.Item key="home">Home</Menu.Item>

                        <Menu.Item key="edit">Edit</Menu.Item>
                        <Menu.Item key="review">Review</Menu.Item>

                    </Menu>


                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <div className="Container"  >
                        <div style={{ display: "flex", flexDirection: "row" }}>

                            <div className="Greeting" >Hi! {this.props.username}</div>
                            <Button className="logoutButton" onClick={this.props.logout} type="primary">Log Out</Button>
                        </div>
                        {this.state.OpeningPage==='home'?<Home/>:null}
                        {this.state.OpeningPage==='edit'?<RecordingForm username={this.props.username}/>:null}
                        {this.state.OpeningPage==='review'?<Review username={this.props.username}/>:null}
                    </div>
                </Content>

            </Layout>

        );
    }
}

export default RecordingTextTool;

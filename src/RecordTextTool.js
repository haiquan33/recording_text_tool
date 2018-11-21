import React, { Component } from 'react';

import { Layout, Menu, Breadcrumb, Button } from 'antd';
import HamburgerMenu from './Component/BurgerMenu/HamburgerMenu'

import { RecordingForm } from './Component/RecordingForm'
import Search from './Component/Search/Search'
import Home from './Component/Home_dict/Home'
import Review from './Component/Review/Review'
import './RecordTextTool.css'

const { Header, Content, Footer } = Layout;


class RecordingTextTool extends Component {

    constructor(props){
        super(props);
        this.state={OpeningPage:"home"}
        this.changeOpeningPage=this.changeOpeningPage.bind(this);
    }

    handleClick = (e) => {
        this.setState({OpeningPage:e.key})
      }

    changeOpeningPage(OpeningPage){
        this.setState({OpeningPage})
    }  

    render() {
        return (
            <Layout className="layout">
                <HamburgerMenu logout={this.props.logout} changeOpeningPage={this.changeOpeningPage} className='Burger-Menu' />

                <Header className="Header" >
                    <div className="logo" >Chương trình làm ngoại ngữ đa dạng</div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['home']}
                        style={{ lineHeight: '64px' }}
                        onClick={this.handleClick}
                    >   
                        <Menu.Item key="search">Search</Menu.Item>

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
                        {this.state.OpeningPage==='home'?<Home userInfo={this.props.userInfo}/>:null}
                        {this.state.OpeningPage==='edit'?<RecordingForm username={this.props.username}/>:null}
                        {this.state.OpeningPage==='review'?<Review username={this.props.username}/>:null}
                        {this.state.OpeningPage==='search'?<Search/>:null}
                    </div>
                </Content>

            </Layout>

        );
    }
}

export default RecordingTextTool;

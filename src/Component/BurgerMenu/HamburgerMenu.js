import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';
import './HamburgerMenu.css';


class MenuWrap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hidden: false
        };
    }

    componentWillReceiveProps(nextProps) {
        const sideChanged = this.props.children.props.right !== nextProps.children.props.right;

        if (sideChanged) {
            this.setState({ hidden: true });

            setTimeout(() => {
                this.show();
            }, this.props.wait);
        }
    }

    show() {
        this.setState({ hidden: false });
    }

    render() {
        let style;

        if (this.state.hidden) {
            style = { display: 'none' };
        }

        return (
            <div style={style} className={this.props.side}>
                {this.props.children}
            </div>
        );
    }
}



class HamburgerMenu extends Component {
    constructor(props){
        super(props);
    }
    changePage=(page)=>()=>{
        this.props.changeOpeningPage(page);
    }
    render() {
        return (
           <div>
            <MenuWrap wait={20} side={'left'}>
                <Menu left  className='bm-burger-button' left id={'slide'} pageWrapId={'App'} outerContainerId={'outer-container'} >
                    <a onClick={this.changePage("home")}><i className="bm-item" /><span>Home</span></a>
                    <a onClick={this.changePage("edit")}><i className="bm-item" /><span>Edit</span></a>
                    <a onClick={this.changePage("review")}><i className="bm-item" /><span>Review</span></a>
                    <a onClick={this.props.logout}><i className="bm-item" /><span>Log Out</span></a>
                 
                </Menu>
            </MenuWrap>
            </div>
        )
    }
}

export default HamburgerMenu;
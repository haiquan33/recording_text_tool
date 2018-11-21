import React, { Component } from 'react'
import firebase_init from '../../firebase_int'
import { Input, Icon,List,Avatar } from 'antd'

var moment = require('moment');
const FirebaseDatabase = firebase_init.database();

export default class CmtModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            commentInput: "",
            submitingCmt: false
        }
        this.handleCmtInputChange = this.handleCmtInputChange.bind(this);
        this.submitCmt = this.submitCmt.bind(this);
        this.doneSubmitCmt = this.doneSubmitCmt.bind(this);
        this.setCmtList = this.setCmtList.bind(this)
    }
    handleCmtInputChange(e) {

        this.setState({ commentInput: e.target.value })
    }
    componentDidMount() {
        // var sentenceData = FirebaseDatabase.ref('Comment'+this.state.cmtType+"/"+this.state.cmtIndex).on('value').then(function (snapshot) {
        //     snapshot.forEach(function (childSnapshot) {
        //         var childKey = childSnapshot.key;
        //         var childData = childSnapshot.val();

        //     })
        // })
        let cmtType;

        if (this.props.cmtType === "original") cmtType = "Ori"
        else cmtType = "Trans";

        var cmtList = FirebaseDatabase.ref("Comment" + cmtType + "/" + this.props.cmtIndex);
        var setCmtList = this.setCmtList;
        cmtList.on('value', function (snapshot) {
            if (snapshot.val()) {
                let data = [];
                snapshot.forEach(function (childSnapshot) {
                    var childData = childSnapshot.val();
                    data.push(childData);


                });
                setCmtList(data)
            }

        });

    }
    setCmtList(data) {
        this.setState({ cmtList: data })
    }

    doneSubmitCmt() {
        this.setState({ submitingCmt: false })
    }
    submitCmt() {
        let cmtType;
        this.setState({ submitingCmt: true })
        if (this.props.cmtType === "original") cmtType = "Ori"
        else cmtType = "Trans";


        let newCmtKey = FirebaseDatabase.ref("Comment" + cmtType + "/" + this.props.cmtIndex).push().key;
        if (this.state.commentInput !== "") {
            var doneSubmitCmt = this.doneSubmitCmt;
            FirebaseDatabase.ref("Comment" + cmtType + "/" + this.props.cmtIndex + "/" + newCmtKey).set({
                UID: this.props.userInfo.uid,
                username: this.props.userInfo.displayName,
                comment: this.state.commentInput,
                timestamp: moment().format('LLL')
            }, function (error) {
                if (error) {
                    // The write failed...
                } else {
                    doneSubmitCmt()
                }
            })
        }
    }
    render() {
        return (
            <div>
                <div className="CommentList">
                    <List
                        itemLayout="horizontal"
                        dataSource={this.state.cmtList}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                    title={<a >{item.username}</a>}
                                    description={item.comment}
                                />
                            </List.Item>
                        )}
                    />
                </div>
                <div>
                    <Input addonAfter={this.state.submitingCmt ?
                        <Icon type="loading" /> :
                        <Icon type="message" onClick={this.submitCmt} />}
                        placeholder="nhap comment cua ban" value={this.state.commentInput} onChange={this.handleCmtInputChange} />

                </div>
            </div>
        )
    }
}

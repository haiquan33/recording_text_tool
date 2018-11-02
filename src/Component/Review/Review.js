import React, { Component } from 'react';
import firebase_init from '../../firebase_int'
import { Card ,Select} from 'antd';

import './Review.css'

const Option = Select.Option;


const FirebaseStorage = firebase_init.storage();
const FirebaseDatabase = firebase_init.database();


class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oriAudioURLList: {},
            transAudioURLList: {},
            filterTransLang:'All',
            filterOriLang:'All'
        };
        this.setSentenceData = this.setSentenceData.bind(this)
        this.setOriAudioURL = this.setOriAudioURL.bind(this);
        this.setTransAudioURL = this.setTransAudioURL.bind(this)
        this.handleChangeFilterOriLang=this.handleChangeFilterOriLang.bind(this);
        this.handleChangeFilterTransLang=this.handleChangeFilterTransLang.bind(this);
    }

    handleChangeFilterOriLang(value){
            this.setState({filterOriLang:value})
    }

    handleChangeFilterTransLang(value){
        this.setState({filterTransLang:value})
    }
    setOriAudioURL(url, filename) {
        //console.log(filename)
        let temp_url_list = this.state.oriAudioURLList;
        temp_url_list[filename] = url;
        this.setState({ oriAudioURLList: temp_url_list })
    }

    setTransAudioURL(url, filename) {
        let temp_url_list = this.state.transAudioURLList;
        temp_url_list[filename] = url;
        this.setState({ transAudioURLList: temp_url_list })
    }

    setSentenceData(data) {
        this.setState({ data })

        //get audio url
        if (this.state.data)
            for (var key in this.state.data) {
                if (this.state.data.hasOwnProperty(key)) {
                    let temp = this.state.data[key];
                    var setOriAudioURL = this.setOriAudioURL;
                    var setTransAudioURL = this.setTransAudioURL;
                    FirebaseStorage.ref('recordOriginal/' + temp.filename).getDownloadURL().then(function (url) {
                        setOriAudioURL(url, temp.filename)

                    })

                    FirebaseStorage.ref('recordTrans/' + temp.filename).getDownloadURL().then(function (url) {
                        setTransAudioURL(url, temp.filename)

                    })
                }
            }
    }
    componentDidMount() {
        var sentenceData = FirebaseDatabase.ref('Sentences/');
        var setSentenceData = this.setSentenceData;
        sentenceData.on('value', function (snapshot) {

            setSentenceData(snapshot.val())
        });
    }

    render() {
        let data_list = [];
        if (this.state.data)
            for (var key in this.state.data) {
                if (this.state.data.hasOwnProperty(key)) {
                    var temp = this.state.data[key];

                    var filterCheck=true;
                    var ownerCheck=true;
                    //check if ori lang is same to the filter
                    if (temp.oriLang){
                            if (this.state.filterOriLang!=='All')
                                if (temp.oriLang!==this.state.filterOriLang) filterCheck=false
                    }
                    else filterCheck=false;

                    if (temp.transLang){
                            if (this.state.filterTransLang!=='All')
                                if (temp.transLang!==this.state.filterTransLang) filterCheck=false
                    }
                    else filterCheck=false;

                    if (temp.owner!==this.props.username) ownerCheck=false;

                    if (filterCheck && ownerCheck)
                    data_list.push(<Card
                        hoverable


                    >
                        <div className="homeitemContainer">
                            <Card
                                hoverable
                                className="langItem"

                            >
                                <div >
                                    <p>{temp.original}</p>
                                    {

                                        <audio ref="audioSource" controls="controls" src={this.state.oriAudioURLList[temp.filename]}></audio>



                                    }

                                </div>
                            </Card>
                            <Card
                                hoverable
                                className="langItem"

                            >
                                <div >
                                    <p>{temp.trans}</p>
                                    <audio ref="audioSource" controls="controls" src={this.state.transAudioURLList[temp.filename]}></audio>
                                </div>
                            </Card>
                        </div>
                    </Card>)
                }
            }





        return (
            <div className="Home" >
                <div className="filterContainer">
                    <Select defaultValue="All" style={{ width: 120 }}  onChange={this.handleChangeFilterOriLang} >
                          <Option value="All">All</Option>
                        <Option value="Vietnamese">Vietnamese</Option>
                        <Option value="Tibetan">Tibetan</Option>
                        <Option value="Chinese">Chinese</Option>
                        <Option value="English">English</Option>
                        <Option value="Korean">Korean</Option>
                        <Option value="Thailand">Thailand</Option>
                        <Option value="Cambodian">Cambodian</Option>
                        <Option value="Russian">Russian</Option>
                        <Option value="Sanskit">Sanskit</Option>


                    </Select>


                       <Select defaultValue="All" style={{ width: 120 }}  onChange={this.handleChangeFilterTransLang} >
                          <Option value="All">All</Option>
                        <Option value="Vietnamese">Vietnamese</Option>
                        <Option value="Tibetan">Tibetan</Option>
                        <Option value="Chinese">Chinese</Option>
                        <Option value="English">English</Option>
                        <Option value="Korean">Korean</Option>
                        <Option value="Thailand">Thailand</Option>
                        <Option value="Cambodian">Cambodian</Option>
                        <Option value="Russian">Russian</Option>
                        <Option value="Sanskit">Sanskit</Option>


                    </Select>
                </div>
                {data_list}
            </div>
        );
    }
}

export default Review;

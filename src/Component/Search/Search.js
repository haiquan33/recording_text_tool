import React, { Component } from 'react';
import firebase_init from '../../firebase_int'
import { Card, Select, Button, Modal, Input, Spin } from 'antd';
import { ReactMic } from 'react-mic';
import './Home.css'

const Option = Select.Option;


const FirebaseStorage = firebase_init.storage();
const FirebaseDatabase = firebase_init.database();

const TEXT_COLLAPSE_OPTIONS = {
    collapse: false,
    collapseText: '... show more',
    expandText: 'show less',
    minHeight: 20,
    maxHeight: 100,
    textStyle: {
        color: 'black',
        fontSize: '15px'
    }
}

const itemperPage = 20;

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oriAudioURLList: {},
            transAudioURLList: {},
            filterTransLang: 'All',
            filterOriLang: 'All',
            pageCount: 1,
            noItemPerLoad: 10,
            recordModalVisible: false,
            isRecording: false,
            isSearching: false,
            OutOfWord: true
        };
        this.setSentenceData = this.setSentenceData.bind(this)
        this.setOriAudioURL = this.setOriAudioURL.bind(this);
        this.setTransAudioURL = this.setTransAudioURL.bind(this)
        this.handleChangeFilterOriLang = this.handleChangeFilterOriLang.bind(this);
        this.handleChangeFilterTransLang = this.handleChangeFilterTransLang.bind(this);
        this.fetchMoreData = this.fetchMoreData.bind(this);
        this.openRecordingModal = this.openRecordingModal.bind(this);
        this.closeRecordModal = this.closeRecordModal.bind(this)

        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
        this.onRecordingStop = this.onRecordingStop.bind(this);
        this.uploadRecording = this.uploadRecording.bind(this);

        this.setOriAudioURL = this.setOriAudioURL.bind(this);
        this.setTransAudioURL = this.setTransAudioURL.bind(this);

        this.searchForWord = this.searchForWord.bind(this);
    }


    getFileBlob = function (url, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.addEventListener('load', function () {
            cb(xhr.response);
        });
        xhr.send();
    };

    uploadRecording() {
        let path;
        if (this.state.currentRecordingType === 'original') path = "recordOriginal"
        else path = "recordTrans"
        this.getFileBlob(this.state.tempRecordingSrc, blob => {
            FirebaseStorage.ref('/' + path + '/' + this.state.currentRecordingIndex).put(blob).then(function (snapshot) {

            })
        })



        this.setState({ recordModalVisible: false });
    }
    startRecording() {
        this.setState({ isRecording: true });
    }
    stopRecording() {
        this.setState({ isRecording: false });
    }
    fetchMoreData() {
        let show_data = this.state.data;
        for (var i = (this.state.pageCount * itemperPage) + 1; i < (this.state.pageCount + 1) * itemperPage; i++) {
            if (i < this.state.return_data.length)
                show_data.push(this.state.return_data[i]);
            else this.setState({ OutOfWord: true })
        }
        this.setState({ data: show_data, pageCount: this.state.pageCount + 1 });
    }
    handleChangeFilterOriLang(value) {
        this.setState({ filterOriLang: value })
    }

    handleChangeFilterTransLang(value) {
        this.setState({ filterTransLang: value })
    }
    setOriAudioURL(url, index) {

        let temp_url_list = this.state.oriAudioURLList;
        temp_url_list[index] = url;
        this.setState({ oriAudioURLList: temp_url_list })
    }

    setTransAudioURL(url, index) {
        let temp_url_list = this.state.transAudioURLList;
        temp_url_list[index] = url;
        this.setState({ transAudioURLList: temp_url_list })
    }

    openRecordingModal = (index, type) => () => {
        console.log(index)
        this.setState({ recordModalVisible: true, currentRecordingIndex: index, currentRecordingType: type });
    }


    closeRecordModal() {

        this.setState({ recordModalVisible: false, currentRecordingIndex: null, currentRecordingType: null });
    }


    setOriAudioURL(url, filename) {
        console.log(url)
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
        let show_data = [];
        let return_data = [];
        let count = 1;
        for (var key in data) {
            if (data[key].original.indexOf(this.state.searchingWord) !== -1) {
                let temp = data[key];
                temp.key = key;
                return_data.push(temp)
                if (count < this.state.pageCount * itemperPage) {
                    count++;

                    show_data.push(temp);
                }

            }
        }
        if (this.state.pageCount * itemperPage + 1 >= return_data.length) {
            this.setState({ return_data, data: show_data, isSearching: false, OutOfWord: true })
        }
        else this.setState({ return_data, data: show_data, isSearching: false, OutOfWord: false })


        //get audio url
        // if (this.state.data)
        //     for (var key in this.state.data) {
        //         if (this.state.data.hasOwnProperty(key)) {
        //             let temp = this.state.data[key];
        //             var setOriAudioURL = this.setOriAudioURL;
        //             var setTransAudioURL = this.setTransAudioURL;
        //             FirebaseStorage.ref('recordOriginal/' + temp.filename).getDownloadURL().then(function (url) {
        //                 setOriAudioURL(url, temp.filename)

        //             })

        //             FirebaseStorage.ref('recordTrans/' + temp.filename).getDownloadURL().then(function (url) {
        //                 setTransAudioURL(url, temp.filename)

        //             })
        //         }
        //     }
    }


    onRecordingStop(recordedBlob) {



        this.setState({ tempRecordingSrc: recordedBlob.blobURL })


    }

    componentDidMount() {


    }


    searchForWord(word) {
        console.log(word)
        this.setState({ searchingWord: word, isSearching: true })
        var query = word;
        let data = [];
        var setSentenceData = this.setSentenceData;
        FirebaseDatabase.ref('Dictionary/').orderByChild('original')
            .startAt(`%${query}%`)
            .endAt(query + "\uf8ff")
            .once("value").then(function (snapshot) {

                snapshot.forEach(function (childSnapshot) {
                    var childKey = childSnapshot.key;
                    var childData = childSnapshot.val();
                    data.push(childData);

                })
                setSentenceData(data);
            })
    }

    render() {
        let data_list = [];
        if (this.state.data)
            for (var key in this.state.data) {

                var temp = this.state.data[key];

                var filterCheck = true;
                //check if ori lang is same to the filter
                if (temp.oriLang) {
                    if (this.state.filterOriLang !== 'All')
                        if (temp.oriLang !== this.state.filterOriLang) filterCheck = false
                }
                else filterCheck = false;

                if (temp.transLang) {
                    if (this.state.filterTransLang !== 'All')
                        if (temp.transLang !== this.state.filterTransLang) filterCheck = false
                }
                else filterCheck = false;

                if (filterCheck)

                    data_list.push(<Card
                        hoverable
                        className="homeItem"

                    >
                        <div className="homeitemContainer">
                            <Card
                                hoverable

                                className="langItem"
                            >
                                <div >
                                    <p>{temp.original}</p>

                                    <p>
                                        {temp.originalCmt}
                                    </p>

                                    {

                                        <audio ref="audioSource" controls="controls" src={this.state.oriAudioURLList[parseInt(temp.key) + 1]}></audio>



                                    }

                                </div>
                                <Button onClick={this.openRecordingModal(parseInt(temp.key) + 1, 'original')} shape="circle" type="button" icon="customer-service" />
                            </Card>
                            <Card
                                hoverable

                                className="langItem"
                            >

                                <div >
                                    <p>{temp.trans}</p>

                                    <p>
                                        {temp.transCmt}
                                    </p>

                                    <audio ref="audioSource" controls="controls" src={this.state.transAudioURLList[parseInt(temp.key) + 1]}></audio>
                                </div>
                                <Button shape="circle" onClick={this.openRecordingModal(parseInt(temp.key) + 1, 'trans')} type="button" icon="customer-service" />
                            </Card>
                        </div>
                    </Card>)

            }





        return (
            <div className="Home" >
                <Input.Search
                    placeholder="Nhap tu can kiem"
                    onSearch={this.searchForWord}
                    enterButton
                    style={{ width: "60%" }}
                />
                <Modal
                    title="Ghi âm"
                    visible={this.state.recordModalVisible}
                    onOk={this.uploadRecording}
                    onCancel={this.closeRecordModal}
                >
                    <ReactMic
                        record={this.state.isRecording}
                        className="sound-wave"

                        onStop={this.onRecordingStop}

                        strokeColor="#000000"
                        backgroundColor="#FF4081"
                    />
                    <audio ref="audioSource" controls="controls" src={this.state.tempRecordingSrc}></audio>


                    {this.state.isRecording ? <Button onClick={this.stopRecording}>Dung</Button>
                        : <Button onClick={this.startRecording}>Ghi am</Button>}

                </Modal>
                <div className="filterContainer">
                    {this.state.return_data?
                        < div > Số câu tìm được {this.state.return_data.length}</div>
                         :
                        null
                    }
                    <Select defaultValue="All" style={{ width: 120 }} onChange={this.handleChangeFilterOriLang} >
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


                {
            this.state.isSearching ? <Spin />
            :
            data_list
        }
        {
            this.state.OutOfWord ? null :
            <Button type="primary" className="LoadMoreButton" onClick={this.fetchMoreData}>Xem thêm </Button>
        }
            </div >
        );
    }
}

export default Search;

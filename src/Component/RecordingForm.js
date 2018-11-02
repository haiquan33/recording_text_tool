import React, { Component } from 'react';
import firebase_init from '../firebase_int'
import { Form, Input, Icon, Button, Select,Divider } from 'antd';
import { ReactMic } from 'react-mic';
import './RecordingForm.css'

var uid = require('uid')


const FormItem = Form.Item;
const Option = Select.Option;
let uuid = 0;

const FirebaseStorage = firebase_init.storage();
const FirebaseDatabase = firebase_init.database();
// Create a storage reference from our storage service

class DynamicFieldSet extends React.Component {


  constructor(props) {
    super(props);
    this.state = {

      blobURL: [],
      currentRecording: false,

      currentIndexRecording: null,
      currentTypeRecording: null,

      isRecording: [],


      blobTransURL: [],


      nSentence: 0
    }
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.onStop = this.onStop.bind(this)
    this.recordButton = this.recordButton.bind(this);
  }


  startRecording = (index, type) => () => {
    console.log("Start ", index);
    //if there is no anything is recording right now then we can start recording
    if (!this.state.currentRecording) {
      let temp = this.state.isRecording;
      temp[index] = true;
      this.setState({
        isRecording: temp,
        currentRecording: true,
        currentIndexRecording: index,
        currentTypeRecording: type
      });
    }

  }

  stopRecording = (index, type) => () => {
    console.log("Stop ", index);
    let temp = this.state.isRecording;
    temp[index] = false;
    this.setState({
      isRecording: temp,
      currentRecording: false,

    })


  }

  onData(recordedBlob) {
    // console.log('chunk of real-time data is: ', recordedBlob);
  }

  onStop(recordedBlob) {
    console.log('recordedBlob is: ', this.state.currentIndexRecording);
    if (this.state.currentTypeRecording === 'original') {
      let temp = this.state.blobURL;
      temp[this.state.currentIndexRecording] = recordedBlob.blobURL
      this.setState({ blobURL: temp })
    }
    else {
      let temp = this.state.blobTransURL;
      temp[this.state.currentIndexRecording] = recordedBlob.blobURL
      this.setState({ blobTransURL: temp })
    }

  }

  remove = (k, index) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }


    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
    
    const names=form.getFieldValue('names');
    let r_name=names[index];
    form.setFieldsValue({
      names: names.filter(name => name !== r_name),
    });
    
    console.log("remove at", index)


    let temp_array = this.state.blobURL;
    temp_array.splice(index, 1)
    console.log(temp_array);
    this.setState({
      nSentence: this.state.nSentence - 1,
      blobURL: temp_array
    })
  }

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
    this.setState({

      blobURL: [...this.state.blobURL, null],
      blobTransURL: [...this.state.blobTransURL, null],
      nSentence: this.state.nSentence + 1,
      isRecording: [...this.state.isRecording, false]
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        for (let i = 0; i < this.state.nSentence; i++) {
          let id = uid(7);
          if (values.names[i]) {
            FirebaseDatabase.ref("Sentences/" + id).set({
              original: values.names[i],
              trans: values.namesTrans[i],
              oriLang: values.oriLang[i],
              transLang: values.transLang[i],
              owner: this.props.username,
              filename: id
            })
            this.getFileBlob(this.state.blobURL[i], blob => {
              FirebaseStorage.ref('/recordOriginal/' + id).put(blob).then(function (snapshot) {
                console.log('Uploaded original');
              })
            })
            this.getFileBlob(this.state.blobTransURL[i], blob => {
              FirebaseStorage.ref('/recordTrans/' + id).put(blob).then(function (snapshot) {
                console.log('Uploaded trans');
              })
            })
          }


        }
        //
      }
    });



    // 


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

  recordButton(index) {

    if ((this.state.isRecording[index]) && (this.state.currentTypeRecording === 'original'))
      return <Button onClick={this.stopRecording(index, 'original')} type="button" shape="circle" icon="pause" />
    else return <Button shape="circle" onClick={this.startRecording(index, 'original')} type="button" icon="customer-service" />
  }
  recordTransButton(index) {

    if ((this.state.isRecording[index]) && (this.state.currentTypeRecording === 'trans'))
      return <Button onClick={this.stopRecording(index, 'trans')} type="button" shape="circle" icon="pause" />
    else return <Button shape="circle" onClick={this.startRecording(index, 'trans')} type="button" icon="customer-service" />
  }
  render() {






    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');

    const lastAudioIndex = keys.length - 1;

    const formItems = keys.map((k, index) => {
      const OriLanguageSelect = getFieldDecorator(`oriLang[${k}]`, {
        initialValue: 'Vietnamese',
      })(
        <Select style={{ width: 120 }} >
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
      )

      const TransLanguageSelect = getFieldDecorator(`transLang[${k}]`, {
        initialValue: 'Vietnamese',
      })(
        <Select style={{ width: 120 }} >
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
      )

      return (
        <div className="itemContainer">
          <FormItem
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={index === 0 ? 'Câu' : ''}
            required={false}
            key={k}
          >
            {index!==0? <Divider />:null}
            <div className="LanguageSelectContainerResponsive">
              {OriLanguageSelect}
              
              {TransLanguageSelect}
            </div>
            {getFieldDecorator(`names[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: "Nhập câu bạn muốn ghi âm vào đây",
              }],
            })(

              <Input placeholder="Nhập câu bạn muốn ghi âm vào đây" addonAfter={this.recordButton(index)} />

            )}


            <audio ref="audioSource" controls="controls" src={this.state.blobURL[index]}></audio>
            <div className="LanguageSelectContainer">
              {OriLanguageSelect}
              
              {TransLanguageSelect}
            </div>
            {getFieldDecorator(`namesTrans[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: "Nhập bản dịch vào đây",
              }],
            })(

              <Input placeholder="Nhập bản dịch vào đây" addonAfter={this.recordTransButton(index)} />

            )}


            <audio ref="audioSource" controls="controls" src={this.state.blobTransURL[index]}></audio>
            {keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={keys.length === 1}
                onClick={() => this.remove(k, index)}
              />
            ) : null}

          </FormItem>

        </div>
      );
    });



    return (

      <div className="RecordingForm">
        <ReactMic
          record={this.state.currentRecording}
          className="sound-wave"

          onStop={this.onStop}
          onData={this.onData}
          strokeColor="#000000"
          backgroundColor="#FF4081"
        />


        <Form onSubmit={this.handleSubmit}>
          {formItems}

          <FormItem {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
              <Icon type="plus" /> Thêm câu
          </Button>
          </FormItem>
          <FormItem {...formItemLayoutWithOutLabel}>
            <Button type="primary" htmlType="submit">Submit</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export const RecordingForm = Form.create()(DynamicFieldSet);

import React, { Component } from 'react'
import  data from './Dictionary.json'
import firebase_init from './firebase_int'

const FirebaseDatabase = firebase_init.database();
export default class UploadDictData extends Component {

 constructor(props){
     super(props);
     this.uploadDict=this.uploadDict.bind(this)
 }
 uploadDict(){
     
     let temp_data=data;
     console.log("uploading",temp_data.length);
     for (var i = 0, l = temp_data.length; i < l; i++) {
        console.log(temp_data[i])
        let value = temp_data[i];
        FirebaseDatabase.ref("Dictionary/"+i).set({
            original: value.SpCn,
            originalCmt:value.SpCnPing,
            trans: value.TdCnPing,
            transCmt:value.SpCnDf,
            oriLang: 'Chinese',
            transLang: 'Vietnamese',
       
            
          })
    }
  

 }
  render() {
    this.uploadDict();
    return (
      <div>
        Upload
      </div>
    )
  }
}

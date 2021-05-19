import React, { Component, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Draggable from 'react-draggable';
import Peer from "simple-peer";
import styled from "styled-components";
import ringtone from './ringtone.mp3';
import { Howl } from 'howler';
import MapComponent from './MapComponent';
import { findRenderedDOMComponentWithClass } from "react-dom/cjs/react-dom-test-utils.production.min";
import StoreManager from "./StoreManager";

// const ringtoneSound = new Howl({
//     src: [ringtone],
//     loop: true,
//     preload: true
// })

// const StyledVideo = styled.video`
// background:black;
// max-width: 576px;
// width:100%;
// height: 100%;
// object-fit: cover;
// `;

// // var socket = io.connect("https://ndjs-test-video.shopster.chat", { transports: ['websocket', 'polling', 'flashsocket'] });
// var socket = io.connect("http://localhost:3003/", { transports: ['websocket', 'polling', 'flashsocket'] });

//const Store = props => {
    // const socketRef = useRef();

    // console.log('props', props)
    // let roomID = props.match.params.roomID;

    // const [users, setUsers] = useState({});
    // const [receivingCall, setReceivingCall] = useState(false);
    // const [caller, setCaller] = useState("");
    // const [callerSignal, setCallerSignal] = useState();
    // const [managerStatus, setManagerStatus] = useState(false);

    // const [callerValue, setCallerValue] = useState();

    // const [incomingData,setIncomingData]=useState();

    // let [Value1, setStatusValue1] = useState(false);
    // let [Value2, setStatusValue2] = useState(false);
    // let [Value3, setStatusValue3] = useState(false);

    // let [isBusy1, setIsBusyValue1] = useState(false);
    // let [isBusy2, setIsBusyValue2] = useState(false);
    // let [isBusy3, setIsBusyValue3] = useState(false);

    // var itemValue = {
    //     socketRef: socketRef
    // }

    // var managerDetails1 = {
    //     managerCode: '10011',
    //     storeCode: roomID,
    //     isOnline: Value1,
    //     isBusy: isBusy1
    // }
    // var managerDetails2 = {
    //     managerCode: '10012',
    //     storeCode: roomID,
    //     isOnline: Value2,
    //     isBusy: isBusy2
    // }
    // var managerDetails3 = {
    //     managerCode: '10013',
    //     storeCode: roomID,
    //     isOnline: Value3,
    //     isBusy: isBusy3
    // }

    // useEffect(() => {
    //     socketRef.current = socket;
    //     socketRef.current.emit('mobileNumber', roomID);
    //     socketRef.current.on("allUsers", (users) => {
    //         console.log(users);
    //         setUsers(users);
    //     })
    //     // socketRef.current.on("hey", (data) => {
    //     //     console.log('hey', data);
    //     //     setIncomingData(data);
    //     //     setReceivingCall(true);
    //     //     setManagerStatus(true)
    //     //     socketRef.current.emit('storemanagerStatus', true);
    //     //     // ringtoneSound.play();
    //     //     setCaller(data.from);
    //     //     setCallerSignal(data.signal);
    //     //     socketRef.current.emit('partnerOnline', 'online', data);
    //     // })
    //     socketRef.current.on('close', () => {
    //         console.log('call stoped');
    //     });
    //     socketRef.current.on('callerDetails', data => {
    //         console.log('callerDetails', data);
    //         var value = data.customerName + data.mobile
    //         console.log(value)
    //         setCallerValue(value)
    //     });
    //     // socketRef.current.emit('storeMangerOnline')
    //     socketRef.current.emit('storeMangerDetail', managerDetails1);
    //     socketRef.current.emit('storeMangerDetail', managerDetails2);
    //     socketRef.current.emit('storeMangerDetail', managerDetails3);
    // }, [Value1, Value2, Value3]);

    // function storeManagerDetails(status) {
    //     console.log('status', status);
    //     if (status === 'value1') {
    //         setStatusValue1(!Value1)
    //         console.log(Value1)
    //     }
    //     if (status === 'value2') {
    //         setStatusValue2(!Value2)
    //         console.log(Value2)
    //     }
    //     if (status === 'value3') {
    //         setStatusValue3(!Value3)
    //         console.log(Value3)
    //     }
    // }

    // var incomingDataItem={
    //     receivingCall:receivingCall,
    //     caller:caller,
    //     callerSignal:callerSignal,
    //     callerValue:callerValue,
    //     incomingData:incomingData
    // }

    // return (
    //     <div>
    //         <h3>StoreManager Present</h3>
    //         <div>
    //             <h3>StoreManager 1</h3>
    //             <button onClick={() => storeManagerDetails('value1')}>Value</button>
    //             {Value1 ?
    //                 <StoreManager incomingData={incomingDataItem} itemValue={itemValue} managerDetails={managerDetails1} />
    //                 : ''}
    //         </div>
    //         <div>
    //             <h3>StoreManager 2</h3>
    //             <button onClick={() => storeManagerDetails('value2')}>Value</button>
    //             {Value2 ?
    //                 <StoreManager incomingData={incomingDataItem} itemValue={itemValue} managerDetails={managerDetails2}/>
    //                 : ''}
    //         </div>
    //         <div>
    //             <h3>StoreManager 3</h3>
    //             <button onClick={() => storeManagerDetails('value3')}>Value</button>
    //             {Value3 ?
    //                 <StoreManager incomingData={incomingDataItem} itemValue={itemValue} managerDetails={managerDetails3}/>
    //                 : ''}
    //         </div>
    //     </div>
    // )
//     console.log('props',props);

//     let [managerValue, setManagerValue] = useState(false);

//     useEffect({}, [])

//     function storeName(e) {
//         let mangerCode = e.target.value
//         setManagerValue(props.match.params.roomID+mangerCode);
//     }

//     function storeManager() {
//         console.log('managerValue',managerValue);
//         props.history.push(`/${props.match.params.roomID}/${managerValue}`);
//     }

//     return (
//         <div>
//             <input onChange={storeName} />
//             <button onClick={storeManager}>online</button>
//         </div>
//     )

// };

class Store extends Component{
    constructor(){
        super();
        this.state={
            mangerCode:''
        }
    }
    storeName=(e)=>{
        let mangerCode=e.target.value
        this.setState({
            mangerCode:mangerCode
        })
    }
    storeManager=()=>{
        console.log('props',this.props);
        this.props.history.push(`/${this.props.match.params.roomID}/${this.state.mangerCode}`);
    }
render(){
    return(
        <div>
            <h3>Create store</h3>
            <input onChange={this.storeName} />
            <button onClick={this.storeManager}>mangerCode</button>
        </div>
    )
}

}

export default Store;


{/* <div>
<h1>Store Demo</h1>
<div className="vedio_call_component">
    <div id="fullScreenView">
        <div className="fullScreen_dragable">
            <div className="fullScreen">
                <div className="draggable_div">
                    <h3>UserVideo</h3>
                    {UserVideo}
                </div>
            </div>
            {incomingCall}
            <h3>Partner Video</h3>
            {PartnerVideo}
            <div className="vedio_call_btn">
                <h1>{roomID}</h1>
                <div className="icon_label">
                    <button id="stopVideo" onClick={updateVedio}>videoIcon</button>
                    <label><span>{cameraText}</span></label>
                </div>
                <div className="icon_label">
                    <button id="mute_audio" onClick={updateAudio} >audioIcon</button>
                    <label><span>{audioText}</span></label>
                </div>
                <div className="icon_label">
                    <button type='button' className="call_end" onClick={stopCall}>stop call</button>
                    <label><span>End Call</span></label>
                </div>
                <div className="icon_label">
                    <button type='button' className="call_end" onClick={updateStream}>Flip camera</button>
                    <label><span>Flip camera</span></label>
                </div>
            </div>
        </div>
    </div>
</div>
</div>    */}
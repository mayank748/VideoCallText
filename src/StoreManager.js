import React, { useEffect, useRef, useState } from "react";
import Draggable from 'react-draggable';
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import ringtone from './ringtone.mp3';
import { Howl } from 'howler';
import MapComponent from './MapComponent';
import { findRenderedDOMComponentWithClass } from "react-dom/cjs/react-dom-test-utils.production.min";

const ringtoneSound = new Howl({
    src: [ringtone],
    loop: true,
    preload: true
})

const StyledVideo = styled.video`
background:black;
max-width: 576px;
width:100%;
height: 100%;
object-fit: cover;
`;

var socket = io.connect("https://ndjs-test-video.shopster.chat", { transports: ['websocket', 'polling', 'flashsocket'] });
//var socket = io.connect("http://localhost:3003/", { transports: ['websocket', 'polling', 'flashsocket'] });

const StoreManager =(props)=> {
    const socketRef = useRef();
    const userVideo = useRef();
    const partnerVideo = useRef();
    const mypeer = useRef();
    // let mangerValue = 'erreportingdemoEZ001';
    // console.log('props',props)
    // console.log('itemValue',itemValue)
    // console.log('incomingData',incomingData);
    // console.log('managerDetails',managerDetails);
    let roomID=props.match.params.roomID;
    let mangerCode=props.match.params.managerValue
    // let mangerValue ='erreportingdemoEZ001010011'
    let mangerValue =roomID+mangerCode
    console.log('props',props)
    // let mangerValue=managerDetails.storeCode+managerDetails.managerCode;
    //let socket=itemValue.socketRef.current
    // const [mangerValue,setmangerValue]=useState('erreportingdemoEZ007')
    const [users, setUsers] = useState({});
    const [stream, setStream] = useState();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const [callRejected, setCallRejected] = useState(false);

    const [managerStatus, setManagerStatus] = useState(false);
    const [cameraText, setCameraText] = useState('Stop Video');
    const [audioText, setAudioText] = useState('Mute');
    const [callerData, setCallerData] = useState();
    const [callerValue, setCallerValue] = useState();
    const [facingVariable, setFacingVariable] = useState("user");
    const [flipClicked, setFlipClicked] = useState(false);

    var managerDetails = {
        managerCode:props.match.params.managerValue ,
        storeCode: roomID,
        isOnline: true,
        isBusy: managerStatus
    }

    useEffect(() => {
        console.log('inside use state')
        socketRef.current = socket;
        console.log(socket);
        socketRef.current.emit('mobileNumber',roomID);
        socketRef.current.emit('storeOnline', mangerValue);
        socketRef.current.emit('storeMangerDetail', managerDetails);
        socketRef.current.on('callGoingTo', data => {
            console.log('callGoingTo', data)
        });
        socketRef.current.on("allUsers", (users) => {
            console.log(users);
            setUsers(users);
        })
        socketRef.current.on("hey", (data) => {
            console.log('hey', data);
            setReceivingCall(true);
            setManagerStatus(true)
            // socketRef.current.emit('storemanagerStatus', true);
            // ringtoneSound.play();
            setCaller(data.from);
            setCallerSignal(data.signal);
            socketRef.current.emit('partnerOnline', 'online', data);
        })
        socketRef.current.on('close', () => {
            console.log('call stoped');
            rejectCall()
        });
        socketRef.current.on('callerDetails', data => {
            console.log('callerDetails', data);
            var value = data.customerName + data.mobile
            console.log(value)
            setCallerValue(value)
        });
        socketRef.current.on('notBusyManager',data=>{
            setReceivingCall(false);
        })

    }, []);
    function acceptCall() {
        //   ringtoneSound.stop();
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            setStream(stream);
            console.log('accept stream', stream);
            if (userVideo.current) {
                userVideo.current.srcObject = stream;
            }
            setCallAccepted(true);
            const peer = new Peer({
                initiator: false,
                trickle: false,
                stream: stream
            });

            mypeer.current = peer

            peer.on("signal", data => {
                console.log('signal data', data);
                socketRef.current.emit("acceptCall", {
                    managerDetails:managerDetails,
                    managerCode:mangerCode,
                    storeCode:roomID,
                    signal: data,
                    to: caller })
            })

            peer.on("stream", stream => {
                console.log('peer stream', stream);
                partnerVideo.current.srcObject = stream;
            });

            peer.on('error', (err) => {
                console.log('error in peer', err);
                // window.location.reload()
            })

            peer.on('close', () => {
                window.location.reload();
            })
            peer.signal(callerSignal);

            // peer.destroy([err])

            if (peer.WEBRTC_SUPPORT) {
                console.log('in if',this)
              } else {
                console.log('in else',this)
              }

            peer._debug = console.log

        }).catch((error) => { console.log("error in catch block", error) })
    }

    function rejectCall() {
        //   ringtoneSound.unload();
        setCallRejected(true)
        socketRef.current.emit('rejected', { to: caller })
        socketRef.current.emit('storemanagerStatus', false);
        setManagerStatus(false)
        window.location.reload();
    }

    function stopCall() {
        socketRef.current.off("signal");
        console.log('mypeer before destroying', mypeer);
        mypeer.current.destroy()
        console.log('mypeer after destroying', mypeer);
        socketRef.current.emit('close', { to: caller })
        socketRef.current.emit('storemanagerStatus', false);
        setManagerStatus(false)
        window.location.reload();
    }

    function updateAudio() {
        stream.getAudioTracks()[0].enabled = stream.getAudioTracks()[0].enabled === false ? true : false;
        var item = document.getElementById('mute_audio');
        item.className = stream.getAudioTracks()[0].enabled ? '' : 'unmute_icon active';
        // setAudioIcon(stream.getAudioTracks()[0].enabled ? icons.ummuteIcon : icons.muteIcon)
        setAudioText(stream.getAudioTracks()[0].enabled ? 'Mute' : 'Un mute')   
    }

    function updateVedio() {
        var btn = document.getElementById('stopVideo');
        console.log('video track', stream.getVideoTracks()[0].enabled)
        stream.getVideoTracks()[0].enabled = stream.getVideoTracks()[0].enabled === false ? true : false;
        btn.className = stream.getVideoTracks()[0].enabled ? '' : 'active';
        // setVideoIcon(stream.getVideoTracks()[0].enabled ? icons.stopVedioIcon : icons.startVedioIcon)
        setCameraText(stream.getVideoTracks()[0].enabled ? 'Stop video' : 'Video');

        // stream.getTracks().forEach(function(track) {
        //     // if (track.readyState == 'live' && track.kind === 'video') {
        //         track.stop();
        //     //}
        // });
        // console.log('stream.getVedioTrack()[0]',stream.getVideoTracks()[0])
        // stream.getVideoTracks()[0].stop();
    }

    function updateStream() {
        setFlipClicked(!flipClicked);
        setFacingVariable(flipClicked ? "environment" : "user");
        userVideo.current.srcObject.getTracks().forEach(function (track) {
            track.stop();
        });
        userVideo.current.srcObject = null;
        console.log('userVideo.current.srcObject.getTracks()', userVideo.current.srcObject);
        var oldVideoTrack = stream.getVideoTracks()[0];
        var oldAudioTracK = stream.getAudioTracks()[0];
        // console.log('oldTrack', oldTrack);
        navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: facingVariable
            }, audio: true
        }).then(NewStream => {
            userVideo.current.srcObject = NewStream;
            var newVideoTrack = NewStream.getVideoTracks()[0];
            var newAudioTrack = NewStream.getAudioTracks()[0];
            // NewStream.getTracks().forEach(function (newTrack) {
            //     stream.getTracks().forEach(function (oldTrack) {
            //         mypeer.current.replaceTrack(oldTrack, newTrack, stream);
            //     })
            // })
            mypeer.current.replaceTrack(oldVideoTrack, newVideoTrack, stream);
            mypeer.current.replaceTrack(oldAudioTracK, newAudioTrack, stream);
            console.log('stream new', stream.getTracks());
            setStream(stream);
        });
    }

    // function personLocation() {
    //     <MapComponent />
    // }

    let UserVideo;
    if (stream) {
        UserVideo = (
            <StyledVideo className="userVideo" playsInline muted ref={userVideo} autoPlay />
        );
    }

    let PartnerVideo;
    if (callAccepted) {
        PartnerVideo = (
            <StyledVideo className="partnerVideo" playsInline ref={partnerVideo} autoPlay />
        );
    }

    let incomingCall;
    if (receivingCall && !callAccepted && !callRejected) {
        incomingCall = (
            <div className="incoming_call_container">
                <div>
                    {caller ? <div className='ringing_text' ><label><span>{callerData} is calling you...</span></label></div> : null}
                </div>
                <div className="incoming_call_btn">
                    <button name="accept" className="accept_user" onClick={() => acceptCall()}>acceptCall</button>
                    <button name="reject" className="call_end" onClick={() => rejectCall()}>rejectCall</button>
                </div>
            </div>
        )
    } else {

    }

    return (
        <div>
            <h1>Store Demo</h1>
            <div className="vedio_call_component">
                {/* <center>
                <iframe
                    width="450"
                    height="250"
                    frameBorder="0" style={{ border: 0 }}
                    src="https://www.google.com/maps/embed/v1/MAP_MODE?key=AIzaSyDLSwm-otg8-bg4tEmotFCTcUcwOWvkcwM" allowFullScreen>
                </iframe>
            </center> */}
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
                            <h1>{mangerValue}</h1>
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
                            {/* <div className="icon_label">
                                <button type='button' className="call_end" onClick={personLocation}>location</button>
                                <label><span>Get Location</span></label>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
            {/* <MapComponent /> */}
        </div>
    )
};

export default StoreManager;
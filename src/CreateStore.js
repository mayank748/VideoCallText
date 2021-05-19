import React, { Component } from "react";
import App from "./App";
class CreateStore extends Component{
    constructor(){
        super();
        this.state={
            roomID:''
        }
    }
    storeName=(e)=>{
        let roomID=e.target.value
        this.setState({
            roomID:roomID
        })
    }
    storeManager=()=>{
        console.log('props',this.props);
        this.props.history.push(`/${this.state.roomID}`);
    }
render(){
    return(
        <div>
            <h3>Create store</h3>
            <input onChange={this.storeName} />
            <button onClick={this.storeManager}>Create</button>
        </div>
    )
}

}
export default CreateStore;
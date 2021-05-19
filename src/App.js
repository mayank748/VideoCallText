import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CreateStore from './CreateStore';
import Store from './Store';
import StoreManager from './StoreManager';
class App extends Component{
constructor(props){
    super(props);

}
render(){
    return(
        <BrowserRouter>
        <Switch>
          <Route path="/" exact component={CreateStore} />
          <Route path="/:roomID" exact component={Store} />
          <Route path="/:roomID/:managerValue" component={StoreManager} />
        </Switch>
      </BrowserRouter>
    )
}
}
export default App;
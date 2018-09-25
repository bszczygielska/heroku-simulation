import React from "react";
import * as io from 'socket.io-client';
import 'antd/dist/antd.css';

const socket = io('https://light-manager-client.herokuapp.com');

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      lights: '',
    };
  }

  componentWillMount() {
    socket.on('toSimulation', message => {
      this.setState({lights: message});
    })
  }

  onClickHandler() {
    socket.emit('fromSimulation', 'Hello, simulation here!')
  }

  get coolObjectForRendering() {
    let result = {};
    this.state.map(light => {
      lodash.set(result, light.name, light);
    });
    return result;
  }

  render() {
    return (
      <div style={{textAlign: "center"}}>
        <button onClick={this.onClickHandler}>Click to emit to server</button>
        Message from client: {this.coolObjectForRendering}
      </div>
    );
  }
}

export default App;
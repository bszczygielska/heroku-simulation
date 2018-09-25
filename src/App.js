import React from "react";
import * as io from 'socket.io-client';
import 'antd/dist/antd.css';

const socket = io('https://light-manager-client.herokuapp.com');

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      text: '',
    };
  }

  componentWillMount() {
    socket.on('toSimulation', message => {
      this.setState({text: message});
    })
  }

  onClickHandler() {
    socket.emit('fromSimulation')
  }

  render() {
    return (
      <div style={{textAlign: "center"}}>
        <button onClick={this.onClickHandler}>Click to emit to server</button>
        Message from client: {this.state.text}
      </div>
    );
  }
}

export default App;
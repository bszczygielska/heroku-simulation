import React from "react";
import * as io from 'socket.io-client';
import 'antd/dist/antd.css';
import * as lodash from 'lodash';
import Card from 'antd/lib/card';
import Avatar from 'antd/es/avatar';

const socket = io('https://light-manager-client.herokuapp.com');

class Light {
  constructor(args) {
    this.name = args.name;
    this.state = args.state;
    this.hue = args.hue;
    this.saturition = args.saturition;
    this.hex = args.hex;
    this._id = args._id
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      lights: [],
    };
  }

  componentDidMount() {
    socket.on('toSimulation', message => {
      const lights = message.map(light => new Light(light))
        .sort((a, b) => a.name.split('.').length - b.name.split('.').length);
      this.setState({lights: lights});
    })
  }

  onClickHandler(light) {
    light.state = !light.state;
    socket.emit('fromSimulation', light);
    this.forceUpdate()
  }

  get coolObjectForRendering() {
    let result = {};
    this.state.lights.length && this.state.lights.map(light => {
      lodash.set(result, light.name, light);
    });
    return result;
  }

  decideWhatRender(obj, path) {
    if (typeof obj !== 'object')
      return;
    let items = [];
    for (let key in obj) {
      let newPath = (path === 'blank') ? `${key}` : `${path}.${key}`;
      const item = (obj[key] instanceof Light) ? this.renderLight(obj[key]) : this.renderRoom(key, obj[key], newPath);
      items.push(item);
    }
    return items;
  }

  renderLight(light) {
    return <span>
      <Avatar
        onClick={() => this.onClickHandler(light)}
        style={{backgroundColor: light.state ? light.hex || 'yellow' : 'gray', margin: 5 }}
        icon="bulb"/>
    </span>
  }

  renderRoom(name, room, path) {
    return <Card
      key={`room_${name}`}
      title={name}
      style={{ display: 'flex', flexDirection: 'column', margin: 10}}
    >
      {this.decideWhatRender(room, path)}
    </Card>
  }

  render() {
    return (
      <div style={{textAlign: "center"}}>
        {this.renderRoom('Your project', this.coolObjectForRendering, 'blank')}
      </div>
    );
  }
}

export default App;
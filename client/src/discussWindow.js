import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, FormGroup, FormText, Label, ListGroup, ListGroupItem, Container, Row, Col, Button } from 'reactstrap';
import { MessageList, ChatItem, Input, Button as ChatBtn, SideBar } from 'react-chat-elements';
import openSocket from 'socket.io-client';
import 'react-chat-elements/dist/main.css';
import decode from 'jwt-decode';
import Cookies from 'universal-cookie';
import './twoColumn.css';
import './App.css';

const cookies = new Cookies();
const socket = openSocket('http://localhost:5000');

export default class DiscussWindow extends Component {
  constructor() {
    super();
    this.msgRef = React.createRef();
    this.sendBtnClick = this.sendBtnClick.bind(this);
    this.changeRoom = this.changeRoom.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.saveMessageToState = this.saveMessageToState.bind(this);
    this.socket = openSocket('http://localhost:5000');
    //Set default message
    this.state = {
      rooms: [],
      message: "",
      sender: "",
      roomName: "",
      messages: []
    }

    window.addEventListener("beforeunload", (ev) => {
      ev.preventDefault();
      socket.emit('userLeft', { nickName: this.state.nickName, roomName: this.state.roomName });
    });

    socket.on('someoneJoined', (data) => {
      this.saveSystemMessageJoinedToState(data);
    });

    socket.on('someoneLeft', (data) => {
      this.saveSystemMessageLeftToState(data);
    });

    socket.on('messageDelivered', (data) => {
      this.saveMessageToState(data);
    });
  }

  componentDidMount() {
    var decoded;
    if (cookies.get('token') !== undefined) {
      decoded = decode(cookies.get('token'));
      this.setState({ nickName: decoded.nickName });
    }

    this.scrollToBottom();

    fetch('/api/getMemberRooms/' + decoded.nickName, {
      method: 'GET'
    }).then(response => response.json())
      // ...then we update the users state
      .then(data =>
        this.setState({
          rooms: data
        })
      );
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  changeRoom(e) {
    if (this.state.roomName !== "") {
      this.setState({ messages: [] });
      socket.emit('userLeft', { nickName: this.state.nickName, roomName: this.state.roomName });
    }
    this.setState({ roomName: e.target.textContent });
    socket.emit('userJoined', { nickName: this.state.nickName, roomName: e.target.textContent });
    fetch('/api/getMessages/' + e.target.textContent, {
      method: 'GET'
    }).then(response => response.json())
      // ...then we update the users state
      .then(data =>
        this.setState({
          messages: data
        })
      );
  }

  sendBtnClick() {
    if (this.state.roomName !== "") {
      socket.emit('msgSent', { author: this.state.nickName, room: this.state.roomName, time: new Date(), message: this.msgRef.current.value });
    }
  }

  saveSystemMessageJoinedToState(data) {
    var arr = [...this.state.messages];
    arr.push({ author: "System", room: this.state.room, time: new Date(), message: data.nickName + " se připojil." });
    this.setState({ messages: arr });
  }

  saveSystemMessageLeftToState(data) {
    var arr = [...this.state.messages];
    arr.push({ author: "System", room: this.state.room, time: new Date(), message: data.nickName + " se odpojil." });
    this.setState({ messages: arr });
  }

  saveMessageToState(data) {
    var arr = [...this.state.messages];
    arr.push(data);
    this.setState({ messages: arr });
  }

  renderMemberList() {
    var array = [...this.state.rooms];
    return array.map(item => {
      return (
        <ListGroupItem>
          <div className="hoverDiv" onClick={this.changeRoom}>{item.roomName}</div>
        </ListGroupItem>
      );
    });
  }

  renderMessageList() {
    var array = [...this.state.messages];
    if (array.length !== 0) {
      return array.map(item => {
        return (
          <ChatItem
            avatar={"./img/grey.jpg"}
            title={item.author}
            subtitle={item.message}
            date={new Date(item.time)}
            unread={0} />
        );
      });
    }
  }

  scrollToBottom() {
    //this.el.scrollIntoView({ behavior: 'smooth', block: "end"});
    this.el.scrollTop = this.el.scrollHeight;
  }

  render() {
    return (
      <div className="columnsContainer">

        <div className="leftColumn" ref={el => { this.el = el; }}>
          {this.renderMessageList()}
        </div>

        <div className="rightColumn">
          <h2>Right Column</h2>
          <ListGroup style={{ color: 'black', textAlign: 'center', maxHeight: '80vh', overflowX: 'hidden' }}>
            {this.renderMemberList()}
          </ListGroup>
        </div>

        <div className='fixed-bottom' style={{ border: '1px solid #ccc', color: 'black', height: '10%', marginRight: '20em', marginLeft: '.5em', marginBottom: '.5em' }}>
          <div className="comment">
            <div className="comment-text-area">
              <textarea ref={this.msgRef} id="message" className="textinput" placeholder="Comment"></textarea>
              <Button onClick={this.sendBtnClick} style={{ height: '100%', width: '20%' }}>Odeslat</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
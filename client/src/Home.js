import React, { Component } from 'react';
import './App.css'

export default class Home extends Component {
    constructor() {
      super();
      //Set default message
      this.state = {
        message: 'Loading...'
      }
    }
    componentDidMount() {
      //GET message from server using fetch api
      fetch('/api/home')
        .then(res => res.text())
        .then(res => this.setState({message: res}));
    }
    render() {
      return (
        <div>
          <h1 className="text-center">Ukázková Socket.IO aplikace</h1>
        </div>
      );
    }
  }
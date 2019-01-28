import React, { Component } from 'react';
import cookie from "react-cookie";
import './App.css'

export default class Logout extends Component {
    componentDidMount() {
      cookie.remove("token");
    }
    render() {
      return (
        <div>
          <h1 className="text-center">Byl jste odhlášen</h1>
        </div>
      );
    }
  }
import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import './App.css'

const cookies = new Cookies();

export default class Logout extends Component {
    componentDidMount() {
      cookies.remove('token');
      this.props.nickNamePropHandler("");
    }
    render() {
      return (
        <div>
          <h1 className="text-center">Byl jste odhlášen</h1>
        </div>
      );
    }
  }
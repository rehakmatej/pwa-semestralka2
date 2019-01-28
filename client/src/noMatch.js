import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import {
    Button
  } from 'reactstrap';
import './App.css'

export default class NoMatch extends Component {
    render() {
      return (
        <div className="text-center">
          <h1 className="text-center">404 Stránka nebyla nalezena.</h1>
          <Button tag={Link} to="/">Domů</Button>
        </div>
      );
    }
  }
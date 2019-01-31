import React, { Component } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    FormText,
    Row,
    Col,
    ListGroupItem,
    ListGroup
} from 'reactstrap';
import decode from 'jwt-decode';
import Cookies from 'universal-cookie';
import './App.css'

const cookies = new Cookies();

export default class MyDiscuss extends Component {
    constructor() {
        super();

        this.state = {
            rooms: [],
            nickName: ""
        }
    }

    componentDidMount() {
        var decoded;
        if (cookies.get('token') !== undefined) {
            decoded = decode(cookies.get('token'));
            this.setState({ nickName: decoded.nickName });
        }

        fetch('/api/getMyRooms/' + decoded.nickName, {
            method: 'GET'
          }).then(response => response.json())
          // ...then we update the users state
          .then(data =>
            this.setState({
              rooms: data
            })
          );        
    }

    renderAddedList() {
        var array = [...this.state.rooms];
        return array.map(item => {
            return (
                <ListGroup>
                <ListGroupItem>
                    Diskuse: {item.roomName} <br />
                    Členové: {item.members.join(', ')} <br />
                    Vlastník: {item.owner}
                </ListGroupItem>
                </ListGroup>
            );
        });
    }



    render() {
        return (
            <div>
            <Col sm="12" md={{ size: 3, offset: 4 }}>
            <h1 className="text-center">Moje diskuse</h1>
                {this.renderAddedList()}
            </Col>
            </div>
        );
    }
}

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

var names = [];
const cookies = new Cookies();

export default class CreateRoom extends Component {
  constructor() {
    super();

    this.onTypeHeadChanged = this.onTypeHeadChanged.bind(this);
    this.onTypeHeadItemSelected = this.onTypeHeadItemSelected.bind(this);
    this.onAddUserClick = this.onAddUserClick.bind(this);
    this.renderAddedList = this.renderAddedList.bind(this);

    this.state = {
      roomName: "",
      usersAll: null,
      owner: "",
      members: [],
      addedUser: ""
    }
  }

  componentDidMount() {
    fetch(`/api/getAllUsers`)
      // We get the API response and receive data in JSON format...
      .then(response => response.json())
      // ...then we update the users state
      .then(data =>
        this.setState({
          usersAll: data
        })
      );

    if (cookies.get('token') !== undefined) {
      var decoded = decode(cookies.get('token'));
      this.setState({ owner: decoded.nickName });
    }


  }

  onTypeHeadChanged(text, event) {
    this.setState({ addedUser: text });
  }

  onTypeHeadItemSelected(selected) {
    var val = selected.join();
    this.setState({ addedUser: val });
  }

  onAddUserClick() {
    var array = [...this.state.members];
    
    var index = array.indexOf(this.state.addedUser);
    var index2 = names.indexOf(this.state.addedUser);
    if ((index === -1) && (index2 !== -1 )) {
      array.push(this.state.addedUser);
      this.setState({ members: array });
    }
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }

  renderAddedList()
  { 
    var array = [...this.state.members];
    return array.map(item => {
      return (
        <ListGroupItem>{item}</ListGroupItem>
      );
    });
  }

  onSubmit = (event) => {
    event.preventDefault();
    //alert(JSON.stringify({"roomName":this.state.roomName, "owner":this.state.owner, "members":this.state.members}));
    fetch('/api/createNewRoom', {
      method: 'POST',
      body: JSON.stringify({"roomName":this.state.roomName, "owner":this.state.owner, "members":this.state.members}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status === 200) {
        this.props.history.push('/');
        alert("Vytvoření nové diskuse proběhlo úspěšně.");
      } else if(res.status === 409) {
        alert("Název diskuse je již používán. Zvolte prosím jinou.");
      } 
      else {
        const error = new Error(res.error);
        throw error;
      }
    })
    .catch(err => {
      console.error(err);
      alert('Chyba ' + err);
    });
  }

  render() {
    if (this.state.usersAll !== null) {
      names = this.state.usersAll.map(function (item) {
        return item['nickName'];
      });

    }
    return (
      <Col sm="12" md={{ size: 3, offset: 4 }}>
        <Form onSubmit={this.onSubmit}>

          <h1 className="text-center">Vytvořit diskusi</h1>
          <FormGroup>
            <Label>Název</Label>
            <Input
              type="text"
              name="roomName"
              placeholder="Název diskuse"
              onChange={this.handleInputChange}
              required
            />
            <ListGroup>
            {this.renderAddedList()}
            </ListGroup>
            <Typeahead
              options={names}
              onInputChange={this.onTypeHeadChanged}
              onChange={this.onTypeHeadItemSelected}
              placeholder="Přezdívky..."
              required
            />
            <Button className="text-center" onClick={this.onAddUserClick}>Přidat</Button>
            <Button className="text-center" type="submit">Založit</Button>
          </FormGroup>
        </Form>
      </Col>
    );
  }
}

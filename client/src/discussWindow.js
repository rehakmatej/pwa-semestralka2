import React, { Component } from 'react';
import { Form, FormGroup, FormText, Label, ListGroup, ListGroupItem, Container, Row, Col, Button } from 'reactstrap';
import { MessageList, ChatItem, Input, Button as ChatBtn, SideBar } from 'react-chat-elements'
import 'react-chat-elements/dist/main.css';
import Sidepane from 'sidepane'
import './App.css'

export default class DiscussWindow extends Component {
  constructor() {
    super();
    //Set default message
    this.state = {
      message: 'Loading...'
    }
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  componentDidMount() {
    //GET message from server using fetch api
    /*fetch('/api/home')
      .then(res => res.text())
      .then(res => this.setState({message: res}));*/
  }
  render() {
    return (
      <div style={{backgroundColor: '#808080' }}>
      <Container fluid>
        <Row style={{ height: '80vh', backgroundColor: '#808080' }}>
          <Col id="chatWindow" sm="10" style={{ backgroundColor: 'white', textAlign: 'left', height: '100%', overflowY: 'scroll' }}>
            <ChatItem
              avatar={'none'}
              alt={'Reactjs'}
              title={'Facebook'}
              subtitle={'What are you doing?'}
              date={new Date()}
              unread={0} />
          </Col>
          <Col style={{ backgroundColor: '#808080', color: 'black', height: '110%' }} sm="2"> <h3 className="text-center">Diskuse</h3>
            <ListGroup style={{ color: 'black', textAlign: 'center', maxHeight: '80vh', overflowX: 'hidden' }}>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
            </ListGroup>
          </Col>
          <Col className='fixed-bottom' sm="10" style={{ backgroundColor: '#808080', color: 'black', height: '12vh', paddingTop: '1vh' }}>
            <Form>
              <FormGroup check inline>           
                <textarea cols="100"></textarea>
                <Button>Submit</Button>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </Container>
      </div>
    );
  }
}
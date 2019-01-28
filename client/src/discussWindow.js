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
      message: 'Loading...',
      sidebarOpen: true
    }
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
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
      <Container fluid>
        <Row style={{ height: '90.8vh' }}>
          <Col id="chatWindow" sm="10" style={{ backgroundColor: 'white', textAlign: 'left', height: '80vh', overflowY: 'scroll' }}>
            <ChatItem
              avatar={'none'}
              alt={'Reactjs'}
              title={'Facebook'}
              subtitle={'What are you doing?'}
              date={new Date()}
              unread={0} />
          </Col>
          <Col style={{ backgroundColor: '#808080', color: 'black', height: '94vh' }} sm="2"> <h3 className="text-center">Diskuse</h3>
            <ListGroup style={{ color: 'black', textAlign: 'center', maxHeight: '85vh', overflowX: 'hidden' }}>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>
              <ListGroupItem>Pokus č.1</ListGroupItem>

            </ListGroup>
          </Col>
          <Col className='fixed-bottom' sm="10" style={{ backgroundColor: '#808080', color: 'black', height: '14vh', paddingTop: '2vh' }}>
            <Input
              placeholder="Zadejte příspěvek..."
              multiline={true}
              minHeight={100}
              maxHeight={100}
              rightButtons={
                <Button
                  style={{ backgroundColor: '#808080', color: 'black', height: '10vh' }}
                  >Odeslat</Button>
              } />
          </Col>
        </Row>
      </Container>
    );
  }
}
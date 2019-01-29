import React, { Component } from 'react';
import appStore from './appStore'
import { 
    Button, 
    Form, 
    FormGroup, 
    Label, 
    Input, 
    FormText, 
    Row, 
    Col 
} from 'reactstrap';
export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nickName : '',
      password: ''
    };
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }
  onSubmit = (event) => {
    event.preventDefault();
    fetch('/api/authenticate', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status === 200) {
        appStore.nickName = this.state.nickName;
        this.props.nickNamePropHandler(this.state.nickName);
        //alert(this.props.onChange);
        this.props.history.push('/');
      } else {
        const error = new Error(res.error);
        throw error;
      }
    })
    .catch(err => {
      console.error(err);
      alert('Chyba při přihlášení.');
    });
  }
  render() {
    return (
      <Form onSubmit={this.onSubmit}>
            <Col sm="12" md={{ size: 3, offset: 4 }}>
                <h1 className="text-center">Přihlášení</h1>
                <FormGroup>
                <Label for="nickName">Přezdívka</Label>
                <Input
                    type="text"
                    name="nickName"
                    placeholder="Vložte nickname"
                    value={this.state.nickName}
                    onChange={this.handleInputChange}
                    required
                />

                <Label for="password">Heslo</Label>
                <Input
                    type="password"
                    name="password"
                    placeholder="Vložte heslo"
                    value={this.state.password}
                    onChange={this.handleInputChange}
                    required
                    />

                <Button className="text-center" type="submit">Přihlásit</Button>
                </FormGroup>
            </Col>    
      </Form>
    );
  }
}
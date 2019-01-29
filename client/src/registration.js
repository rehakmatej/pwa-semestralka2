import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Row, Col } from 'reactstrap';

export default class Registration extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          nickName : '',
          password: '',
          password2: ''
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
        if(this.state.password !== this.state.password2)
        {
            alert("Hesla se neshodují.");
        }
        else
        {
        fetch('/api/register', {
          method: 'POST',
          body: JSON.stringify({"nickName":this.state.nickName, "password":this.state.password}),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(res => {
          if (res.status === 200) {
            this.props.history.push('/');
            alert("Registrace proběhla úspěšně.");
          } else if(res.status === 409) {
            alert("Přezdívka je již používána. Zkuste jinou.");
          } 
          else {
            const error = new Error(res.error);
            throw error;
          }
        })
        .catch(err => {
          console.error(err);
          alert('Chyba ' + err);
        });}
      }

    render() {
        return (
            <Form onSubmit={this.onSubmit}>
                    <Col sm="12" md={{ size: 3, offset: 4 }}>
                    <h1 className="text-center">Registrace</h1>
                        <FormGroup>
                            <Label for="nick">Přezdívka</Label>
                            <Input 
                                type="text" 
                                name="nickName" 
                                placeholder="Přezdívka"
                                value={this.state.nickName}
                                onChange={this.handleInputChange}
                                required 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="heslo">Heslo</Label>
                            <Input 
                                type="password" 
                                name="password" 
                                id="heslo" 
                                placeholder="Heslo" 
                                value={this.state.password}
                                onChange={this.handleInputChange}
                                required 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="heslo2">Zopakovat heslo</Label>
                            <Input 
                                type="password" 
                                name="password2" 
                                id="heslo2" 
                                placeholder="Heslo znovu"
                                value={this.state.password2}
                                onChange={this.handleInputChange} 
                                required 
                            />
                        </FormGroup>
                        <Button type="submit">Zaregistrovat</Button>
                    </Col>
            </Form>
        );
    }
}
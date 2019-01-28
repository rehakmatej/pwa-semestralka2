import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { Link, Route, Switch, BrowserRouter } from 'react-router-dom';
import decode from 'jwt-decode';
import Cookies from 'universal-cookie';
import Home from './Home';
import Secret from './Secret';
import Login from './login';
import withAuth from './withAuth';
import Registration from './registration'
import NoMatch from './noMatch'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css';
import appStore from './appStore'

const cookies = new Cookies();

class App extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.nickNameHandler = this.nickNameHandler.bind(this);

    this.state = {
      isOpen: false,
      nickName : ""
    };
    if(cookies.get('token') !== undefined) {
    var decoded = decode(cookies.get('token'));
    appStore.nickName = decoded.nickName;
    }
    //alert(appStore.nickName);
  }

  nickNameHandler(nick) {
    this.setState({nickName: nick});
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar dark style={{ backgroundColor: 'black' }} expand="md">
            <NavbarBrand tag={Link} to="/" style={{ color: 'white' }}>PWA semestrálka</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
              <NavItem>
                  <NavLink tag={Link} to="/secret" href="">Secret</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/registrace" href="">Registrovat</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/login" href="">Přihlásit</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>

          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" render={(props) => <Login {...props} nickNamePropHandler={this.nickNameHandler} />} />
            <Route path="/registrace" component={Registration} />
            <Route path="/secret" component={withAuth(Secret)} />
            <Route component={NoMatch} />
          </Switch>
        </div>

      </BrowserRouter>
    );
  }
}

export default App;
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
import Logout from './logout';
import withAuth from './withAuth';
import Registration from './registration'
import CreateRoom from './createRoom'
import MyDiscuss from './myDiscuss'
import NoMatch from './noMatch'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css';
import DiscussWindow from './discussWindow';

const cookies = new Cookies();

class App extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.nickNameHandler = this.nickNameHandler.bind(this);
    this.deleteNickName = this.deleteNickName.bind(this);

    this.state = {
      isOpen: false,
      nickName: ""
    };
  }

  componentDidMount() {
    if (cookies.get('token') !== undefined) {
      var decoded = decode(cookies.get('token'));
      this.setState({ nickName: decoded.nickName });
    }
  }

  deleteNickName()
  {
    if(this.state.nickName !== "")
    this.setState({nickName: ""});
  }

  nickNameHandler(nick) {
    this.setState({ nickName: nick });
    //alert(this.state.nickName);
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  renderNavbar() {
    if (this.state.nickName === "") {
      //alert(this.state.nickName);
      return (
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar >
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
      );
    }
    else {
      //alert(this.state.nickName);
      return (
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/diskuse" href="">Diskuse</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                {this.state.nickName}
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem tag={Link} to="/mojediskuse" href="">
                  Moje diskuse
                  </DropdownItem>
                <DropdownItem tag={Link} to="/vytvoritdiskusi" href="">
                  Vytvořit diskusi
                  </DropdownItem>
                <DropdownItem divider />
                <DropdownItem tag={Link} to="/logout" href="">
                  Odhlásit
                  </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      );
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
        
          <Navbar dark style={{ backgroundColor: 'black' }} expand="md">
          
            <NavbarBrand tag={Link} to="/" style={{ color: 'white' }}>PWA semestrálka</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            {this.renderNavbar()}           
          </Navbar>

          
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" render={(props) => <Login {...props} nickNamePropHandler={this.nickNameHandler} />} />
            <Route path="/logout" render={(props) => <Logout {...props} nickNamePropHandler={this.nickNameHandler} />} />
            <Route path="/registrace" component={Registration} />
            <Route path="/diskuse" component={withAuth(DiscussWindow, this.deleteNickName)} />
            <Route path="/vytvoritdiskusi" component={withAuth(CreateRoom, this.deleteNickName)} />
            <Route path="/mojediskuse" component={withAuth(MyDiscuss, this.deleteNickName)} />
            <Route path="/secret" component={withAuth(Secret, this.deleteNickName)} />
            <Route component={NoMatch} />
          </Switch>
          
        </div>
        </BrowserRouter>
        
     
    );
  }
}

export default App;
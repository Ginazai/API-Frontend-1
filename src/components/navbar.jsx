import React, { useState, useCallback } from 'react';
import { parseJwt } from '../utils/parseJWT';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { login } from '../services/api';
import Dropdown from 'react-bootstrap/Dropdown';
import { useNavigate, Link } from "react-router-dom";
import { FloatingLabel } from 'react-bootstrap';

function MyNavbar({ token, setToken, activeUser, 
				setActiveUser, roles, setRoles,
				activeKey, setActiveKey }) {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  // Session timer
  const [seconds, setSeconds] = useState(0);
  
  const handleLogout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('activeKey');
    localStorage.removeItem('roles');
    navigate('/'); // Redirect to home
    setActiveUser(null);
    setRoles([]);
  }, [setToken, navigate, setActiveUser, setRoles]);

  useEffect(() => {
    localStorage.setItem('activeKey', activeKey);
  }, [activeKey]);
  
  useEffect(() => {
    if (!token) {
      setSeconds(0);
	  handleLogout();
      return;
    }
    setSeconds(0);
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [handleLogout, token]);
  
  useEffect(() => {
    if (!token) return;
	
    const payload = parseJwt(token);
    if (!payload?.exp) return;

    const now = Math.floor(Date.now() / 1000);
    const msUntilExpiry = (payload.exp - now) * 1000;

    if (msUntilExpiry <= 0) {
      handleLogout();
      return;
    }

    const timeout = setTimeout(() => {
      handleLogout();
    }, msUntilExpiry);

    return () => clearTimeout(timeout);
  }, [handleLogout, token]);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username, password });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
	  setUsername('');
	  setPassword('');
      setShowLogin(false);
      setLoginError('');
    } catch (err) {
      setLoginError('Invalid credentials');
    }
  };

  const handleSelect = (key) => {
	setActiveKey(key);
  }

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary shadow-sm">
        <Container fluid>
          <Navbar.Brand><Link to="/">Manager de inventario</Link></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" activeKey={activeKey} onSelect={handleSelect}>
			{token && (<Nav.Link as={Link} eventKey="productos" to="/productos">Productos</Nav.Link>)}
			{token && (<Nav.Link as={Link} eventKey="categorias" to="/categorias">Categorias</Nav.Link>)}   
	          {token && roles.includes("ROLE_ADMIN") && (
	            <Nav.Link as={Link} eventKey="usuarios" to="/usuarios">Usuarios</Nav.Link>
	          )}
            </Nav>
          
		  <Col xs="auto">
              {!token ? (
                <Button variant="success" onClick={() => setShowLogin(true)}>
                  Iniciar sesión
                </Button>
              ) : (
                <Dropdown align="end">
                  <Dropdown.Toggle variant="success" id="dropdown-user">
                    {activeUser}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.ItemText>
                      Tiempo de sesion transcurrido: {Math.floor(seconds / 60)}:{('0' + (seconds % 60)).slice(-2)}
                    </Dropdown.ItemText>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => { handleLogout();}}>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Col>
			</Navbar.Collapse>
        </Container>
		
      </Navbar>

      <Modal show={showLogin} onHide={() => setShowLogin(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleLogin}>
          <Modal.Body>
			  <FloatingLabel
			                  controlId="floatingInput"
                label="Username"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Username"
				  name="username"
                  required
                />
              </FloatingLabel>
			  <FloatingLabel
			    controlId="floatingInput"
                label="Password"
                className="mb-3"
			   >
		            <Form.Control
	                type="password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					placeholder="Password"
					name="password"
					required
					/>
			  </FloatingLabel>
            {loginError && <div className="text-danger mt-2">{loginError}</div>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowLogin(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Login
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default MyNavbar;

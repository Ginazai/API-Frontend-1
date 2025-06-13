import React, { useEffect, useState } from 'react';
import { getUsuarios, updateUsuario, createUsuario } from '../services/api';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { parseDateLong } from '../utils/parseDate';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import UserImg from '../assets/images/user.png';
import { useNavigate  } from 'react-router-dom';

function Users({ token, activeUser, roles }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [editUserId, setEditUserId] = useState(null);
  const [editForm, setEditForm] = useState({
	    name: '',
        active: false,
        roles: []
   });
  const [newForm, setNewForm] = useState({
		name: '',
        username: '',
        password: '',
        active: true
    });
	const [showNewUserModal, setShowNewUserModal] = useState(false);
	const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    getUsuarios(token)
      .then(res => setUsers(res.data))
      .catch(() => setError('Unauthorized or failed to fetch users'));
  }, [token]);
  

  useEffect(() => {
    if (!token) return;
    if (error) {
      setWarning('');
      return;
    }
	const timer = setTimeout(() => {
	    if (users.length === 0) setWarning('No hay usuarios registrados');
	    else setWarning('');
	}, 1000);
	return () => clearTimeout(timer);
  }, [token, users, error]);
  
  useEffect(() => {
	if (!roles.includes('ROLE_ADMIN')){
		navigate('/');
	}
	}, [roles, navigate]);
	
	if (!token) return null;
	if (!roles.includes('ROLE_ADMIN')) return null;
  
  const handleEditClick = (user) => {
    // Aquí puedes implementar la lógica para abrir el modal de edición
	setEditUserId(user.id);
	setEditForm(
		{
			name: user.name, 
			active: user.active, 
			roles: user.roles
		}
	);
  };
  // Función para manejar los cambios en el formulario de edición
  const handleFormChange = (e) => {
	const { name, value, type, checked } = e.target;
	setEditForm(prev => ({
		...prev,
		[name]: type === 'checkbox' ? checked : value
	}));
  };
  // Función para manejar los cambios en el formulario de creación de usuario
  const handleNewFormChange = (e) => {
	const { name, value, type, checked } = e.target;
	setNewForm(prev => ({
		...prev,
		[name]: type === 'checkbox' ? checked : value
	}));
  };
  // Función para editar un usuario
  const handleSaveChanges = async () => {
	try {
      await updateUsuario(token, editUserId, editForm);
      const res = await getUsuarios(token);
      setUsers(res.data);
      setEditUserId(null);
    } catch (err) {
      setError('Error al guardar cambios');
      console.error(err);
    }
  }
  // Función para crear un nuevo usuario
  const handleCreateUser = async () => {
	    try {
            await createUsuario(token, newForm);
            const res = await getUsuarios(token);
            setUsers(res.data);
            setShowNewUserModal(false);
            setNewForm({ name: '', username: '', password: '', active: true });
        } catch (err) {
            setError('Error al crear el usuario');
        }
  };									  
  // Filtrar el usuario activo de la lista de usuarios
  const filteredUsers = users.filter(user => user.username !== activeUser);

  return (
	<Container className="my-4">
	<div
	  style={{
	    position: 'relative',
	    width: '100%',
	    height: '60vh',
	    minHeight: 100,
	    maxHeight: 100,
	    overflow: 'hidden'
	  }}
	  className="mb-4 shadow"
	>
		  <img
		    src={UserImg}
		    alt="Home"
		    style={{
		      width: '100%',
		      height: '100%',
		      objectFit: 'cover',
		      objectPosition: 'center',
			  transform: 'scale(0.9)',
		    }}
		  />
		  <div
		    style={{
		      position: 'absolute',
		      top: 0,
		      left: 0,
		      width: '100%',
		      height: '100%',
		      display: 'flex',
		      flexDirection: 'column',
		      justifyContent: 'center',
		      alignItems: 'flex-start',
		      padding: '2rem'
		    }}
		  >
		  <Button
  	        variant="dark"
  			className="float-end"
  			onClick={() => setShowNewUserModal(true)}
  	        >
  	          Agregar usuario
  	        </Button>
	    </div>
	</div>
	<Row className="mb-3">	
	    <Col>
	        
			<Modal
                show={showNewUserModal}
                onHide={() => setShowNewUserModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="new-user-modal">Nuevo Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                    id="new-user-form"
                    onSubmit={e => { e.preventDefault(); handleCreateUser() }}>
                        <Row>
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Nombre del usuario"
                                className="mb-3"
                            >
                                <Form.Control
                                    type="text"
                                    placeholder="Nombre del usuario"
                                    name="name"
                                    onChange={handleNewFormChange}
                                    value={newForm.name}
                                />
                            </FloatingLabel>
                        </Row>
                        <Row>
                            <FloatingLabel
                                controlId="floatingUsername"
                                label="Nombre de usuario"
                                className="mb-3"
                            >
                                <Form.Control
                                    type="text"
                                    placeholder="Nombre de usuario"
                                    name="username"
                                    onChange={handleNewFormChange}
                                    value={newForm.username}
                                />
                            </FloatingLabel>
                        </Row>
                        <Row>
                            <FloatingLabel
                                controlId="floatingPassword"
                                label="Contraseña"
                                className="mb-3"
                            >
                                <Form.Control
                                    type="password"
                                    placeholder="Contraseña"
                                    name="password"
                                    onChange={handleNewFormChange}
                                    value={newForm.password}
                                />
                            </FloatingLabel>
                        </Row>
                        <Row>
                            <Form.Check
                                type="switch"
                                id={`active-new`}
                                label="Usuario Activo"
                                className="mx-3"
                                name="active"
                                onChange={handleNewFormChange}
                                checked={newForm.active}
                            />
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowNewUserModal(false)}>
                        Cerrar
                    </Button>
                    <Button variant="primary" 
                    form="new-user-form" 
                    type="submit">
                        Crear Usuario
                    </Button>
                </Modal.Footer>
			</Modal>
		</Col>
	</Row>	
	<Row>
	{warning && <div className="alert alert-warning">{warning}</div>}
	{error && <div className="alert alert-danger">{error}</div>}
	{filteredUsers.map(user => 
		<Col key={user.id} xs={12} sm={12} md={6} lg={4} className="mb-3">
			<Card className="shadow-sm">
		        <Card.Body>
				    <Card.Title as="h5">{user.name}</Card.Title>
					<Card.Subtitle className="mb-2 text-muted">{user.active ? 'Usuario activo' : 'Usuario inactivo'}</Card.Subtitle>
				    <ul className="list-group list-group-flush">
						<li className="list-group-item">Nombre de usuario: {user.username}</li>
		                <li className="list-group-item">Rol(es): <ul>{user.roles.map(role => (<li key={role.id}>{role.name}</li>))}</ul></li>
						<li className="list-group-item">Creado: {parseDateLong(user.create_date)}</li>
				    </ul>
					<Button 
					 variant="dark btn-sm float-end"
					 onClick={() => handleEditClick(user)}
					>
				    Editar
					</Button>
				</Card.Body>
				<Card.Footer className="text-muted float-end text-end">
					<i>
					    {user.last_access === null ? 'Nunca' : 'Último acceso:'}
						{' '}
						{user.last_access === null ? 'Nunca' : parseDateLong(user.last_access)}
					</i>
				</Card.Footer>
			</Card>
			<Modal
                show={editUserId === user.id}
                onHide={() => setEditUserId(null)}
			            >
				<Modal.Header closeButton>
					<Modal.Title id="edit-user-modal">Editando Usuario: {user.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
					id="edit-user-form"
					onSubmit={e => { e.preventDefault(); handleSaveChanges() }}>
                        <Row>
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Nombre del usuario"
                                className="mb-3"
                            >
                                <Form.Control
                                    type="text"
                                    placeholder="Nombre del usuario"
									name="name"
									onChange={handleFormChange}
                                    value={editForm.name}
                                />
                            </FloatingLabel>
                        </Row>
                        <Row>
                            <Form.Check
                                type="switch"
                                id={`active-${user.id}`}
                                label="Usuario Activo"
								className="mx-3"
                                name="active"
                                onChange={handleFormChange}
                                checked={editForm.active}
                            />
                        </Row>
                        {/*<Row>
                            <Form.Label>Roles</Form.Label>
                            {user.roles.map(role => (
                                <Form.Check
                                    key={role.id}
                                    type="switch"
                                    id={`role-${role.id}`}
                                    label={role.name}
									className="mx-3"
                                    defaultChecked={role.active}
                                />
                            ))}
                        </Row>*/}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditUserId(null)}>
                        Cerrar
                    </Button>
                    <Button variant="primary"
					form="edit-user-form"
					type="submit">
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
			</Modal>
		</Col>)}	
	</Row>
	</Container>
  );
}

export default Users;

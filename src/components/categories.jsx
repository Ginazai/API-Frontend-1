import React, { useState } from 'react';
import { getCategorias, updateCategoria, createCategoria } from '../services/api';
import { Card, Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { parseDateLong } from '../utils/parseDate';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import GearImg from '../assets/images/gears.png';
	
export default function Categories({ token, categories, setCategories, roles }) { 
	const [error, setError] = useState('');
	const [editCategoryId, setEditCategoryId] = useState(null);
	const [editForm, setEditForm] = useState({
		name: '',
        active: false
    });
	const [newForm, setNewForm] = useState({
		name: '',
		active: true
	});
	const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
	
	const handleEditClick = (category) => {
		setEditCategoryId(category.id);
		setEditForm({ name: category.name, active: category.active });
    }
	// check for edit categories on changes
	const handleFormChange = (e) => {
	    const { name, value, type, checked } = e.target;
	    setEditForm(prev => ({
	      ...prev,
	      [name]: type === 'checkbox' ? checked : value
	    }));
	 };
	 // check for new category form changes
	 const handleNewFormChange = (e) => {
	    const { name, value, type, checked } = e.target;
	    setNewForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
     };

	// function to handle category update
	 const handleSaveChanges = async () => {
		try {
            await updateCategoria(editCategoryId, editForm, token);
            const res = await getCategorias(token);
            setCategories(res.data);
			setEditCategoryId(null);
        } catch (err) {
            setError('Error al guardar cambios');
            console.error(err);
        }
    }
	
	// function to handle new category creation
	const handleCreateCategory = async () => {
        try {
            await createCategoria(newForm, token);
            const res = await getCategorias(token);
            setCategories(res.data);
            setShowNewCategoryModal(false);
            setNewForm({ name: '', active: true });
        } catch (err) {
            setError('Error al crear la categoría');
            console.error(err);
        }
    };
	
	if (!token) return null;
	
	return(
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
				    src={GearImg}
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
					onClick={() => setShowNewCategoryModal(true)}
			        >
			          Agregar categoría
			        </Button>
			    </div>
			</div>
			<Row className="mb-3">	
			    <Col>
			        
				</Col>
				<Modal
			    show={showNewCategoryModal}
                onHide={() => setShowNewCategoryModal(false)}>
	                <Modal.Header closeButton>
	                    <Modal.Title id="new-category-modal">Nueva Categoría</Modal.Title>
	                </Modal.Header>
                    <Modal.Body>
                        <Form
						id="new-category-form"
						onSubmit={e => { e.preventDefault(); handleCreateCategory() }}>
                            <Row>
                                <FloatingLabel
                                    controlId="floatingInput"
                                    label="Nombre de la categoría"
                                    className="mb-3"
                                >
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        placeholder="Nombre de la categoría"
                                        value={newForm.name}
                                        onChange={handleNewFormChange}
                                    />
                                </FloatingLabel>
                            </Row>
                            <Row>
							{roles.includes('ROLE_ADMIN') && 
								(<Form.Check
                                    type="switch"
                                    label={newForm.active ? "Categoría Activa" : "Categoría Inactiva"}
                                    name="active"
                                    className="mx-3"
                                    checked={newForm.active}
                                    onChange={handleNewFormChange}
                                />)} 
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary"
                        onClick={() => setShowNewCategoryModal(false)}>
                            Cerrar
                        </Button>
                        <Button
                        variant="primary"
                        form="new-category-form"
                        type="submit">
                            Crear Categoría
                        </Button>
                    </Modal.Footer>
                </Modal>
			</Row>	
		    <Row>
                {error && <div className="alert alert-danger">{error}</div>}
                {categories.map(category => (
                    <Col key={category.id} xs={12} sm={12} md={4} lg={3} className="mb-3">
                        <Card className="shadow-sm">
                            <Card.Body>
							<Card.Title as="h5">{category.name}</Card.Title>
							<Card.Subtitle className="mb-2 text-muted">
								{category.active ? "Categoría Activa" : "Categoría Inactiva"}
							</Card.Subtitle>
							<Button 
							variant="dark btn-sm float-end"
							onClick={() => handleEditClick(category)}						                            
							>
							    Editar
							</Button>					
                            </Card.Body>
							<Card.Footer className="text-muted float-end text-end">
							<i>
							    Ultima modificación: {parseDateLong(category.last_update)}
							</i>
							</Card.Footer>
                        </Card>
						<Modal
						    show={editCategoryId === category.id}
							onHide={() => setEditCategoryId(false)}
							>
						    <Modal.Header closeButton>
                                <Modal.Title id="edit-category-modal">Editando Categoría: {category.name}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form
								id="edit-category-form" 
								onSubmit={e => { e.preventDefault(); handleSaveChanges() }}>
						            <Row>
	                                    <FloatingLabel
	                                        controlId="floatingInput"
	                                        label="Nombre de la categoría"
	                                        className="mb-3"
	                                    >
	                                        <Form.Control
	                                            type="text"
												name="name"
	                                            placeholder="Nombre de la categoría"
	                                            value={editForm.name}
												onChange={handleFormChange}
	                                        />
	                                    </FloatingLabel>
                                    </Row>
                                    <Row>
									{roles.includes('ROLE_ADMIN') && 
										(<Form.Check
									        type="switch"
									        label={editForm.active ? "Categoría Activa" : "Categoría Inactiva"}
											name="active"
											className="mx-3"
											checked={editForm.active}
											onChange={handleFormChange}
									      />)}         
									</Row>
								</Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" 
								onClick={() => setEditCategoryId(false)}
								>
                                    Cerrar
                                </Button>
                                <Button 
								variant="primary" 
								form="edit-category-form"
								type="submit">
                                    Guardar Cambios
                                </Button>
                            </Modal.Footer>
                        </Modal>
						
                    </Col>
                ))}
            </Row>
		</Container>
	);
}
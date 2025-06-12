import React, { useState, useEffect } from 'react';
import { getProductos, getProductoCategorias, updateProductoCategorias, 
		updateProducto, createProducto } from '../services/api';
import { Card, Col, Container, 
		Row, Button, Modal, 
		Form, InputGroup, FloatingLabel } from 'react-bootstrap';
import { parseDateLong } from '../utils/parseDate';
import GearImg from '../assets/images/gears.png';

function Productos({ token, categories, setCategories, roles }) {
	const [products, setProducts] = useState([]);
	const [editProductId, setEditProductId] = useState(null);
	const [editForm, setEditForm] = useState({ 
		name: '', 
		price: '', 
		categories: [],
		active: true 
	});
	const [error, setError] = useState('');
	const [productCategories, setProductCategories] = useState([]);
	const [saveModal, setSaveModal] = useState(false);
	const [saveForm, setSaveForm] = useState({
		name: '',
		price: '',
		categories: [],
		active: true
	});
	
	useEffect(() => {
		const fetchproducts = async () => {
			try {
				const res = await getProductos(token);
				setProducts(res.data); // Asegúrate de acceder a .data
			} catch (err) {
				setError('Error al obtener productos');
				console.error('Error al obtener products:', err);
			}
		};
		fetchproducts();
	}, [token]);
	
	// Fetch categories for a product
	useEffect(() => {
		const fetchProductCategories = async (productId) => {
			try {
				const res = await getProductoCategorias(productId, token);
				res.data = res.data || []; // Asegúrate de que res.data sea un array
				setProductCategories(res.data);
			} catch (err) {
				setError('Error al obtener categorías del producto');
			}
		};
		if (editProductId) {
			fetchProductCategories(editProductId);
		} else {
			setProductCategories([]);		
		}
	}, [editProductId, token]);	

	// Open modal and initialize form
	const handleEditClick = (producto) => {
	  const fullCategories = Array.isArray(producto.categories)
	    ? producto.categories
	        .map(cat => categories.find(c => c.id === (cat.id || cat)))
	        .filter(c => c && c.name) // Only keep valid categories
	    : [];
	  setEditProductId(producto.id);
	  setEditForm({ 
	    name: producto.name, 
	    price: producto.price, 
	    categories: fullCategories, 
	    active: producto.active 
	  });
	};

	  // Handle edit form changes
	  const handleFormChange = (e) => {
	    const { name, value, type, checked } = e.target;
	    setEditForm(prev => ({
	      ...prev,
	      [name]: type === 'checkbox' ? checked : value
	    }));
	  };
	  
	  // Handle save form changes
	  const handleSaveFormChange = (e) => {
	    const { name, value, type, checked } = e.target;
	    setSaveForm(prev => ({
	      ...prev,
	      [name]: type === 'checkbox' ? checked : value
	    }));
	  };

	  
	  const handleCategoryChange = (catId) => {
	    setEditForm(prev => {
	      const categoriesArr = Array.isArray(prev.categories) ? prev.categories : [];
	      const exists = categoriesArr.some(c => c.id === catId);
	      if (exists) {
	        return {
	          ...prev,
	          categories: categoriesArr.filter(c => c.id !== catId)
	        };
	      } else {
	        const catObj = categories.find(c => c.id === catId);
	        if (!catObj || !catObj.name) return prev; // Only add valid categories
	        return {
	          ...prev,
	          categories: [...categoriesArr, catObj]
	        };
	      }
	    });
	  };
	  // Save changes
	  const handleSaveChanges = async () => {
	    await updateProducto(editProductId, editForm, token);

	    // Strictly filter and deduplicate category names
	    const validNames = Array.from(
	      new Set(
	        (editForm.categories || [])
	          .map(c => c && c.name)
	          .filter(name => typeof name === 'string' && name.trim() !== '')
	      )
	    );

	    if (validNames.length === 0) {
	      setError('At least one valid category must be selected.');
	      return;
	    }

	    try {
	      await updateProductoCategorias(
	        editProductId,
	        { categories: validNames },
	        token
	      );
	      const res = await getProductos(token);
	      setProducts(res.data);
	      setEditProductId(null);
	      setError('');
	    } catch (err) {
	      setError('Error updating product categories');
	    }
	  };
	  
	  // Save new product
	  const handleSaveNewProduct = async () => {
	    if (!saveForm.name || !saveForm.price) {
	      setError('Name and price are required');
	      return;
	    }
	    try {
	      await createProducto(saveForm, token);
	      const res = await getProductos(token); // Fetch updated list
	      setProducts(res.data);
	      setSaveModal(false);
	      setSaveForm({
	        name: '',
	        price: '',
	        categories: [],
	        active: false
	      });
	      setError('');
	    } catch (err) {
	      setError('Error creating product');
	    }
	  };

	  return (
	    <Container className="my-3">
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
				onClick={() => setSaveModal(true)}>
	                Agregar producto
	          </Button>
		    </div>
		</div>
		<Row className="mb-3">	
		    <Col>
                
				<Modal
			    show={saveModal}
				onHide={() => setSaveModal(false)}
				>
				<Modal.Header closeButton>
					<Modal.Title>Nuevo Producto</Modal.Title>	
				</Modal.Header>
				<Modal.Body>
					<Form
					id="new-product-form"
					onSubmit={e => { e.preventDefault(); handleSaveNewProduct();}}
					>
					<Row>
					    <FloatingLabel
						constrolId="floatingInput"
                        label="Nombre del producto"
                        className="mb-3">
						    <Form.Control
				                type="text"
			                    name="name"
		                        value={saveForm.name}
								onChange={handleSaveFormChange}
	                            placeholder="Nombre del producto"
                            />
                        </FloatingLabel>
					</Row>
					<Row>
					    <Form.Group as={Col}>
						    <Form.Label>Precio</Form.Label>							
			                <InputGroup>
	                            <InputGroup.Text>$</InputGroup.Text>
	                            <Form.Control
	                                type="number"
	                                name="price"
									onChange={handleSaveFormChange}
	                                value={saveForm.price}
	                                placeholder="Precio del producto"
	                            />
	                        </InputGroup>
						</Form.Group>
				    </Row>
		            <Row className="mb-3">
                        <Form.Label>Categorías del producto:</Form.Label>
                        {categories.map(cat => (
                          <Form.Check
                            className="mx-3"
                            key={cat.id}
                            type="checkbox"
                            label={cat.name}
                            name="categories"
							onChange={() => {
	                                const exists = saveForm.categories.some(c => c.id === cat.id);
                                    if (exists) {
                                        setSaveForm(prev => ({
                                            ...prev,
                                            categories: prev.categories.filter(c => c.id !== cat.id)
                                        }));
                                    } else {								
                                        setSaveForm(prev => ({
                                            ...prev
                                            , categories: [...prev.categories, cat]
                                         }));
		                               }
									}
								}
                            checked={saveForm.categories.some(c => c.id === cat.id)}
                          />
                        ))}
	                </Row>
                    <Row className="m-2">
					{roles.includes('ROLE_ADMIN') && 
						(<Form.Check
                            type="switch"
                            name="active"
                            checked={saveForm.active}
                            onChange={handleSaveFormChange}
                            id="new-product-active-switch"
                            label={saveForm.active ? "Producto Activo" : "Producto Inactivo"}
                        />)}
                    </Row>
                </Form>
		    </Modal.Body>
			<Modal.Footer>
	            <Button variant="secondary"
				onClick={() => setSaveModal(false)}>
                    Cerrar
                </Button>
                <Button 
                    variant="primary" 
                    type="submit"
                    form="new-product-form">
                    Guardar producto
                    </Button>
			</Modal.Footer>
		</Modal>
        </Col>
	</Row>												
	      <Row>
		    {error && <div className="alert alert-danger">{error}</div>}
	        {products.map(producto => (
	          <Col xl={3} lg={3} md={6} sm={12} xs={12} key={producto.id} className="mb-3">
	            <Card className='shadow-sm'>
	              <Card.Body>
	                <Card.Title>{producto.name}</Card.Title>
					<Card.Subtitle className="my-1 text-muted">
						{producto.active === true ? "Disponible" : "No disponible"}
					</Card.Subtitle>
	                <Card.Text>${producto.price}</Card.Text>
	                <div xs="auto">
	                  <Button
	                    onClick={() => handleEditClick(producto)}
	                    size="sm"
	                    variant="dark"
	                    className="mx-1 float-end"
	                  >
	                    Editar
	                  </Button>
	                </div>
	              </Card.Body>
                  <Card.Footer 
				  className="text-muted float-end text-end"
				  >
				  	<i>
						Ultima modificación: {parseDateLong(producto.last_update)}					
				    </i>
            	  </Card.Footer>
	            </Card>

	            {/* Edit Modal */}
	            <Modal
	              show={editProductId === producto.id}
	              onHide={() => setEditProductId(null)}
	            >
	              <Modal.Header closeButton>
	                <Modal.Title>Editando producto: {producto.name}</Modal.Title>
	              </Modal.Header>
	              <Modal.Body>
	                <Form 
					id="edit-product-form"
					onSubmit={e => { e.preventDefault(); handleSaveChanges() }}>
	                  <Row>
	                    <FloatingLabel
	                      controlId="floatingInput"
	                      label="Nombre del producto"
	                      className="mb-3"
	                    >
	                      <Form.Control
	                        type="text"
	                        name="name"
	                        value={editForm.name}
	                        onChange={handleFormChange}
	                        placeholder="Nombre del producto"
	                      />
	                    </FloatingLabel>
	                  </Row>
	                  <Row>
	                    <Form.Group as={Col}>
	                      <Form.Label>Precio</Form.Label>
	                      <InputGroup>
	                        <InputGroup.Text>$</InputGroup.Text>
	                        <Form.Control
	                          type="number"
	                          name="price"
	                          value={editForm.price}
	                          onChange={handleFormChange}
	                          placeholder="Precio del producto"
	                        />
	                      </InputGroup>
	                    </Form.Group>
	                  </Row>
					  <Row className="mb-3">
					    <Form.Label>Categorías del producto:</Form.Label>
						{categories.map(cat => (
						  <Form.Check
						    className="mx-3"
						    key={cat.id}
						    type="checkbox"
						    label={cat.name}
						    name="categories"
						    checked={Array.isArray(editForm.categories) && editForm.categories.some(c => c.id === cat.id)}
						    onChange={() => handleCategoryChange(cat.id)}
						  />
						))}
					  </Row>
	                  <Row className="m-2">
					  {roles.includes('ROLE_ADMIN') && 
						(<Form.Check
	                      type="switch"
	                      name="active"
	                      checked={editForm.active}
	                      onChange={handleFormChange}
	                      label={editForm.active ? "Producto Activo" : "Producto Inactivo"}
	                    />)}      
	                  </Row>
	                </Form>
	              </Modal.Body>
	              <Modal.Footer>
	                <Button variant="secondary"
					onClick={() => setEditProductId(null)}
					>
	                  Cerrar
	                </Button>
	                <Button 
					variant="primary" 
					type="submit"
					form="edit-product-form"
					onClick={handleSaveChanges}>
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

export default Productos;
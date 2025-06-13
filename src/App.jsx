import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyNavbar from './components/navbar';
import Home from './components/home';
import Users from './components/users';
import Productos from './components/products';
import Categorias from './components/categories';
import { parseJwt } from './utils/parseJWT';
import AppBreadcrumb from './components/breadcrumb';
import {  getCategorias } from './services/api';


function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [activeUser, setActiveUser] = useState(null);
  const [roles, setRoles] = useState(() => localStorage.getItem('roles') || []);
  const [allCategories, setAllCategories] = useState([]);
  const [activeKey, setActiveKey] = useState(() => localStorage.getItem('activeKey') || '');
  
  useEffect(() => {
	if (!token) {
      setActiveUser(null);
	  setAllCategories([]);
	  return;
	}
    const fetchCategories = async () => {
        try {
		    const categoriesResponse = await getCategorias(token);
		    setAllCategories(categoriesResponse.data);
		} catch (error) {
		    console.error('Error fetching categories or roles:', error);
		}
		}
	    fetchCategories();
	}, [token]);
  
  useEffect(() => {
    if (token) {
      const payload = parseJwt(token);
      setActiveUser(payload?.sub); 
	  setRoles(payload?.roles || []);
	  localStorage.setItem('roles', JSON.stringify(payload?.roles || []));
    } else {
      setActiveUser(null);
    }
  }, [token]);

  return (
	  <BrowserRouter>
        <MyNavbar 
          token={token} 
          setToken={setToken} 
          activeUser={activeUser} 
          setActiveUser={setActiveUser}
		  roles={roles} setRoles={setRoles}
		  activeKey={activeKey} setActiveKey={setActiveKey}
        />
		{token && <AppBreadcrumb activeUser={activeUser} />}
	    <Routes>
		  <Route path="/" element={<Home token={token} />} />
		  <Route  path={"productos"} element={<Productos token={token} 
		  							categories={allCategories} setCategories={setAllCategories}
									roles={roles}/>} 
		  />
		  <Route path={"categorias"}  element={<Categorias categories={allCategories} 
		  								setCategories={setAllCategories} 
										token={token} roles={roles} />}  
			/>
		  {token && <Route path={"usuarios"} element={<Users 
													token={token} activeUser={activeUser} 
													roles={roles} />} 
			/>}

		 </Routes>
	  </BrowserRouter>
  );
}

export default App;

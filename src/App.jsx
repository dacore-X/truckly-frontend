import React from "react";
import {Routes, Route} from "react-router-dom";
import Main from './pages/Main';
import Login from './pages/Login'
import Layout from './components/Layout';
import Profile from "./pages/Profile";
import Deliveries from "./pages/Deliveries";
import Notfound from "./pages/Notfound";
import Analytics from "./pages/Analytics";
import Roles from "./pages/Roles";
import Forbidden from "./pages/Forbidden";
import Register from "./pages/Register";
import DeliveryInfo from "./pages/DeliveryInfo";

import('preline')

function App() {
    return (
        <>
            <Routes>
                <Route path='/' element={<Layout/>}>
                    <Route index element={<Main/>}/>
                    <Route path='profile' element={<Profile/>}/>
                    <Route path='login' element={<Login/>}/>
                    <Route path='register' element={<Register/>}/>
                    <Route element={<Roles allowedRoles={"is_admin"}/>}>
                        <Route path='analytics' element={<Analytics/>}/>
                    </Route>
                    <Route element={<Roles allowedRoles={"is_courier"}/>}>
                        <Route path='deliveries' element={<Deliveries/>}/>
                    </Route>
                    <Route path='delivery/:id' element={<DeliveryInfo/>}/>

                    <Route path='forbidden' element={<Forbidden/>}/>
                    <Route path='*' element={<Notfound/>}/>
                </Route>
            </Routes>
        </>
    );
}

export default App;

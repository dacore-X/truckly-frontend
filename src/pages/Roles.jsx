import React, {useContext} from 'react';
import {UserContext} from "../context/UserContext";
import {Navigate, Outlet} from "react-router-dom";

function Roles({allowedRoles}) {

    const [user,] = useContext(UserContext)
    return !user ? (<div></div>) :
        Object.keys(user["meta"]).filter(function (role){return user["meta"][role]}).includes(allowedRoles) ? <Outlet/> : <Navigate to='/forbidden'/>
}

export default Roles;
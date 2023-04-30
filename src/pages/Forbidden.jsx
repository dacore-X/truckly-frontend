import React from 'react';
import {NavLink} from "react-router-dom";
import logo from '../img/box-truck.png'

function Forbidden(props) {
    return (
        <div className="flex flex-col justify-center items-center mt-28">
            {/*Logo*/}
            <div className="flex space-x-8 justify-center">
                <img className="w-44 h-44" src={logo} alt="logo"></img>
                <h1 className="text-7xl font-montserrat font-bold mt-16">
                    truckly
                </h1>
            </div>

            {/*Error header*/}
            <h1 className="text-3xl font-montserrat font-bold text-center mt-16">
                Error 403: Доступ запрещён 😔
            </h1>

            <div className="flex items-center mt-4">
                <span className="text-lg font-montserrat"> Вы не обладаете необходимыми правами,&nbsp;</span>
                <NavLink to="/login">
                    <div
                        className="text-lg font-montserrat text-green-500 rounded hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300">
                        авторизируйтесь
                    </div>
                </NavLink>
                <span className="text-lg font-montserrat">&nbsp;или обратитесь к администратору. </span>
            </div>
        </div>
    );
}

export default Forbidden;
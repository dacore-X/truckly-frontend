import React from 'react';
import logo from '../img/box-truck.png'
import {NavLink} from "react-router-dom";

function Notfound(props) {
    return (
        <div className="flex flex-col justify-center items-center mt-28">
            {/*Logo*/}
            <div className="flex space-x-8 justify-center">
                <img className="w-44 h-44" src={logo} alt="logo"/>
                <h1 className="text-7xl font-montserrat font-bold mt-16">
                    truckly
                </h1>
            </div>

            {/*Error header*/}
            <h1 className="text-3xl font-montserrat font-bold text-center mt-16">
                Error 404: Страница не найдена 🔎
            </h1>

            <div className="flex items-center mt-4">
                <span className="text-lg font-montserrat"> Страница, которую Вы ищите, не найдена.&nbsp;</span>
                <NavLink to="/">
                    <div
                        className="text-lg font-montserrat text-green-500 rounded hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300">
                        Вернуться на главную
                    </div>
                </NavLink>
                <span className="text-lg font-montserrat">.</span>
            </div>
        </div>
    );
}

export default Notfound;
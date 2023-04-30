import {NavLink, useNavigate} from "react-router-dom";
import logo from "../img/box-truck.png"
import emptyAvatar from "../img/avatar.png"
import React, {useContext, useState} from 'react'
import {UserContext} from "../context/UserContext";

function Navbar() {
    const [user, setUser] = useContext(UserContext);
    const [error, setError] = useState('')
    const navigate = useNavigate();

    const submitLogout = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
            },
            credentials: 'include'
        };

        const response = await fetch("http://localhost:8080/api/user/logout", requestOptions);
        const data = await response.json();

        if (response.status === 401){
            setError("Ошибка авторизации")
            setUser(null)
            localStorage.clear()
            return
        }

        if (response.status !== 200) {
            setError(data["error"])
            console.log("bad request")
            return
        }

        setUser(null)
        localStorage.clear()
        console.log(data)
    }

    const handleLogout = (e) => {
        console.log('button clicked')
        submitLogout()
        navigate('/')
    }

    return (
        <>
            <nav className="relative px-40 py-2 flex justify-between items-center bg-white shadow-md">
                {/*Logo*/}
                <NavLink to="/">
                    <div
                        className="flex items-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300">
                        <img src={logo} className="w-10 h-10 mr-3" alt="Logo"/>
                        <span
                            className="self-center text-base font-montserrat font-bold whitespace-nowrap">truckly</span>
                    </div>
                </NavLink>

                {/*Header links*/}
                <ul className="flex absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 lg:mx-auto lg:flex lg:items-center lg:w-auto lg:space-x-6">
                    <NavLink to="/">
                        <li>
                            <div
                                className="font-montserrat text-sm font-bold text-green-600 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300">
                                Главная
                            </div>
                        </li>
                    </NavLink>
                    <li className="text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
                             className="w-4 h-4 current-fill" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                        </svg>
                    </li>
                    {user && user["meta"]["is_courier"] &&
                        <>
                            <NavLink to="/deliveries">
                                <li>
                                    <div
                                        className="font-montserrat text-sm font-semibold text-gray-900 hover:text-green-500 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300">
                                        Заказы
                                    </div>
                                </li>
                            </NavLink>
                            <li className="text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
                                     className="w-4 h-4 current-fill" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                                </svg>
                            </li>
                        </>
                    }
                    {user && user["meta"]["is_admin"] &&
                        <>
                            <NavLink to="/analytics">
                                <li>
                                    <div
                                        className="font-montserrat text-sm font-semibold text-gray-900 hover:text-green-500 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300">
                                        Аналитика
                                    </div>
                                </li>
                            </NavLink>
                            <li className="text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
                                     className="w-4 h-4 current-fill" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                                </svg>
                            </li>
                        </>
                    }
                    <NavLink to="/partnership">
                        <li>
                            <div
                                className="font-montserrat text-sm font-semibold text-gray-900 hover:text-green-500 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300">
                                Сотрудничество
                            </div>
                        </li>
                    </NavLink>
                </ul>

                {/*Header button*/}
                {user ?
                    <div className="z-10 hs-dropdown relative inline-flex">
                        <button id="hs-dropdown-custom-trigger" type="button"
                                className="hs-dropdown-toggle py-1 pl-1 pr-3 inline-flex justify-center items-center gap-2 rounded-full border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none text-sm">
                            <img className="w-6 h-6 rounded-full object-cover" src={emptyAvatar} alt="avatar"></img>
                            <span className="text-black font-semibold font-montserrat truncate max-w-[7.5rem]">{user["name"]}</span>
                            <svg className="hs-dropdown-open:rotate-180 w-2.5 h-2.5 text-gray-600" width="16"
                                 height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                                      stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </button>

                        <div
                            className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-[15rem] bg-white shadow-md rounded-lg p-2 mt-2"
                            aria-labelledby="hs-dropdown-custom-trigger">
                            <NavLink to='/profile'>
                                <div
                                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm font-semibold font-montserrat text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-green-500">
                                    Личный кабинет
                                </div>
                            </NavLink>

                            <div
                                className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm font-semibold font-montserrat text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-green-500">
                                <button onClick={handleLogout}>
                                    Выйти
                                </button>
                            </div>
                        </div>
                    </div> :
                    <NavLink to="/login">
                        <div className="relative">
                            <div
                                className="py-1 px-5 pr-11 bg-green-500 border-2 border-green-600 text-sm text-white font-montserrat font-medium rounded-xl hover:bg-green-600 hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-300">
                                Войти
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400"
                                     viewBox="0 0 20 20" fill="white">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                          clipRule="evenodd"/>
                                </svg>
                            </div>
                        </div>
                    </NavLink>
                }
            </nav>
        </>
    )
}

export default Navbar;
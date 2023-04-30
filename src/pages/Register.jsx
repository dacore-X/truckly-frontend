import React, {useEffect, useState} from 'react';
import logo from '../img/box-truck.png'
import {NavLink, useNavigate} from "react-router-dom";

function Register(props) {
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [isCourier, setIsCourier] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleCheckbox = () => {
        setIsCourier(!isCourier)
    };

    const submitRegister = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({
                surname: surname,
                name: name,
                email: email,
                phone_number: phone,
                password: password,
                is_courier: isCourier
            }),
        };

        const response = await fetch("http://localhost:8080/api/user/signup", requestOptions);
        const data = await response.json();
        if (response.status !== 200) {
            if (data["error"] === "user with this email already exists") {
                setError("Пользователь с указанной почтой уже существует")
            } else if (data["error"] === "failed to read body") {
                setError("Проверьте корректность введённых данных")
            }
            return
        }

        setError('')
        navigate('/login')
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (password === passwordConfirm && password.length > 0 && name && name !== '' && surname !== ''
            && email !== '' && phone !== '') {
            submitRegister()
            return
        }
        setError("Проверьте корректность введённых данных")
    }

    useEffect(() => {
        if (passwordConfirm !== '' && passwordConfirm !== password) {
            setError("Пароли не совпадают")
        } else {
            setError('')
        }
    }, [password, passwordConfirm])


    return (
        <form onSubmit={handleSubmit} className="min-h-fit grid place-content-center mt-10">
            {/*Logo*/}
            <div className="flex space-x-8">
                <img className="w-44 h-44" src={logo} alt="logo"></img>
                <h1 className="text-7xl font-montserrat font-bold mt-16">
                    truckly
                </h1>
            </div>

            {/*Signup header*/}
            <h1 className="text-4xl mt-9 mb-11 font-montserrat font-bold text-center">
                Регистрация
            </h1>

            {/*Input fields*/}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div className="relative">
                    <input required type="text" value={name} onChange={(e) => setName(e.target.value)}
                           className="py-2 px-3 pl-11 block w-full border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                           placeholder="Имя"></input>
                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 pl-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400"
                             viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"/>
                        </svg>
                    </div>
                </div>
                <div className="relative">
                    <input required type="text" value={surname} onChange={(e) => setSurname(e.target.value)}
                           className="py-2 px-3 pl-11 block w-full border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                           placeholder="Фамилия"></input>
                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 pl-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400"
                             viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"/>
                        </svg>
                    </div>
                </div>
                <div className="relative">
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                           className="py-2 px-3 pl-11 block w-full border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                           placeholder="Электронная почта"></input>
                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 pl-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                        </svg>
                    </div>
                </div>
                <div className="relative">
                    <input required type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)}
                           className="py-2 px-3 pl-11 block w-full border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                           placeholder="Номер телефона"></input>
                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 pl-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400"
                             viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                                  clipRule="evenodd"/>
                        </svg>
                    </div>
                </div>
                <div className="relative">
                    <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                           className="py-2 px-3 pl-11 block w-full border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                           placeholder="Пароль"></input>
                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 pl-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400"
                             viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                  clipRule="evenodd"/>
                        </svg>
                    </div>
                </div>
                {passwordConfirm !== '' && passwordConfirm !== password ?
                    <div className="relative">
                        <input required type="password" value={passwordConfirm}
                               onChange={(e) => setPasswordConfirm(e.target.value)}
                               className="py-2 px-3 pl-11 block w-full border-2 border-red-500 rounded-xl focus:outline-none focus:border-red-500"
                               placeholder="Повторите пароль"></input>
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 pl-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400"
                                 viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd"
                                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                      clipRule="evenodd"/>
                            </svg>
                        </div>
                    </div>
                    :
                    <div className="relative">
                        <input required type="password" value={passwordConfirm}
                               onChange={(e) => setPasswordConfirm(e.target.value)}
                               className="py-2 px-3 pl-11 block w-full border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                               placeholder="Повторите пароль"></input>
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 pl-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400"
                                 viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd"
                                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                      clipRule="evenodd"/>
                            </svg>
                        </div>
                    </div>
                }

            </div>
            <div className="flex pl-4.5 mt-2 items-center justify-between">
                <div className="flex items-center">
                    <input id="courier-checkbox" type="checkbox" checked={isCourier} onChange={handleCheckbox}
                           className="form-checkbox w-4 h-4 text-green-600 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-green-300"></input>
                    <label htmlFor="courier-checkbox"
                           className="ml-3 text-sm font-montserrat font-medium text-gray-500">Я курьер</label>
                </div>
                <NavLink to="/login">
                    <div
                        className="text-green-500 rounded hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300">Есть
                        аккаунт?
                    </div>
                </NavLink>
            </div>
            <div className="mt-2">
                <button
                    className="py-2 px-3 w-full border-2 border-green-600 rounded-xl bg-green-500 text-white font-montserrat font-medium hover:bg-green-600 hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                    type="submit">Зарегистрироваться
                </button>
            </div>

            {error !== '' &&
                <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4" role="alert">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-4 w-4 text-red-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16"
                                 height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path
                                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm text-red-800 font-semibold">
                                При отправке ваших данных возникла проблема.
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                <ul className="list-disc space-y-1 pl-5">
                                    <li>{error}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </form>
    );
}

export default Register;
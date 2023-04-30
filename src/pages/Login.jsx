import {useContext, useState} from 'react';
import logo from '../img/box-truck.png'
import {useNavigate} from "react-router-dom";
import {UserContext} from "../context/UserContext";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("")
    const navigate = useNavigate();
    const [user, setUser] = useContext(UserContext)

    const submitLogin = async () => {
        const requestOptionsLogin = {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
            credentials: 'include'
        };

        const responseLogin = await fetch("http://localhost:8080/api/user/login", requestOptionsLogin);
        const dataLogin = await responseLogin.json();
        if (responseLogin.status !== 200) {
            setError(dataLogin["error"])
            console.log("bad request")
            return
        }

        const requestOptionsMe = {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
            },
            credentials: 'include'
        };

        const responseMe = await fetch("http://localhost:8080/api/user/me", requestOptionsMe);
        const dataMe = await responseMe.json();
        if (responseMe.status !== 200) {
            setError(dataMe["error"])
            console.log("bad request")
            return
        }

        setUser(dataMe)
        localStorage.setItem("user", JSON.stringify(dataMe))
        console.log(dataMe)
        navigate("/profile")
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        submitLogin();
        // navigate('/');
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="min-h-fit grid place-content-center mt-10">
                {/* Logo */}
                <div className="flex space-x-8 justify-center">
                    <img className="w-44 h-44" src={logo} alt="logo"></img>
                    <h1 className="text-7xl font-montserrat font-bold mt-16">
                        truckly
                    </h1>
                </div>

                {/* <!-- Sign Up Header --> */}
                <h1 className="text-4xl mt-9 mb-7 font-montserrat font-bold text-center">
                    Вход в аккаунт
                </h1>

                {/* <!-- Input Fields --> */}
                <div className="grid grid-cols-4">
                    <div className="col-start-2 col-span-2">
                        <div className="relative">
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
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
                        <div className="relative mt-4">
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
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
                        <div className="relative mt-4">
                            <button
                                className="py-2 px-3 w-full border-2 border-green-600 rounded-xl bg-green-500 text-white hover:bg-green-600 hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                                type="submit">Войти
                            </button>

                        </div>
                        <div className="flex mt-2 items-center w-full">
                            <span className="text-gray-400 ml-auto">Нет учетной записи?</span>
                            <a className="ml-2 text-green-500 rounded hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
                               href="/register">Зарегистрироваться</a>
                        </div>
                    </div>
                    {error !== "" &&
                        <div className="col-start-2 col-span-2">
                            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4" role="alert">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-4 w-4 text-red-400 mt-0.5" xmlns="http://www.w3.org/2000/svg"
                                             width="16"
                                             height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path
                                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm text-red-800 font-semibold">
                                            При авторизации возникла одна из проблем.
                                        </h3>
                                        <div className="mt-2 text-sm text-red-700">
                                            <ul className="list-disc space-y-1 pl-5">
                                                <li>Аккаунт с данным e-mail не найден</li>
                                                <li>Данные для входа не верны</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </form>
            {/*<button onClick={handleLogout}>Logout</button>*/}
        </>
    )
}

export default Login;
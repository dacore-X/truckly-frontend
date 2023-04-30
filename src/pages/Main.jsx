import React, {useContext, useEffect, useState} from 'react'
import courier from '../img/main/man.png'
import car from '../img/main/car.png'
import van from '../img/main/van.png'
import vanBig from '../img/main/van-big.png'
import boxTruck from '../img/main/box-truck.png'
import banner from '../img/main/banner1.png'
import {UserContext} from "../context/UserContext";
import {NavLink, useNavigate} from "react-router-dom";

function Main() {
    const [, setUser] = useContext(UserContext)
    const [typeId, setTypeID] = useState(1)
    const [hasLoader, setHasLoader] = useState(true)

    const [objectFromType, setObjectFromType] = useState('by-geo')
    const [objectFrom, setObjectFrom] = useState('')

    const [objectToType, setObjectToType] = useState('by-object')
    const [objectTo, setObjectTo] = useState('')

    const [predictedPrice, setPredictedPrice] = useState(0)

    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const [location, setLocation] = useState(null)

    const successGeolocation = (pos) => {
        setLocation({
            "lat": pos.coords.latitude,
            "lon": pos.coords.longitude
        })
    }

    const failGeolocation = () => {
        setError("Ошибка при определении геолокации")
    }

    useEffect(() => {
        if (!navigator.geolocation) {
            alert("Геолокация не поддерживается браузером")
        } else if (objectFromType === 'by-geo' || objectToType === 'by-geo') {
            navigator.geolocation.getCurrentPosition(successGeolocation, failGeolocation);
            console.log("Определение геолокации")
        }
    }, [objectFromType, objectToType])

    const handleChangeType = (object, toType) => {
        if (object === 'from' && toType === 'by-geo' && objectToType === 'by-geo') {
            setObjectFromType(toType)
            setObjectToType('by-object')
            setObjectFrom('')

        } else if (object === 'to' && toType === 'by-geo' && objectFromType === 'by-geo') {
            setObjectFromType('by-object')
            setObjectToType(toType)
            setObjectTo('')

        } else if (object === 'from') {
            setObjectFromType(toType)
            setObjectFrom('')

        } else if (object === 'to') {
            setObjectToType(toType)
            setObjectTo('')
        }
    }

    const predictPrice = async () => {
        let dataFrom
        if (objectFromType === 'by-object') {
            if (objectFrom === '') {
                setError("Поле с адресом не может быть пустым.")
                return
            }
            const requestOptions = {
                method: "GET",
                credentials: 'include'
            };
            const response = await fetch(`http://localhost:8080/api/geo/coords?q=${objectFrom}`, requestOptions)
            dataFrom = await response.json()
            if (response.status === 401) {
                navigate('/login')
                setUser(null)
                return
            } else if (response.status !== 200) {
                if (dataFrom["error"] === "error finding geo object") {
                    setError("Пожалуйста, уточните введённые адреса.")
                } else {
                    setError(dataFrom["error"])
                }
                return
            }
        }

        let dataTo
        if (objectToType === 'by-object') {
            if (objectTo === '') {
                setError("Поле с адресом не может быть пустым.")
                return
            }
            const requestOptions = {
                method: "GET",
                credentials: 'include'
            };
            const response = await fetch(`http://localhost:8080/api/geo/coords?q=${objectTo}`, requestOptions)
            dataTo = await response.json()
            if (response.status === 401) {
                navigate('/login')
                setUser(null)
                return
            } else if (response.status !== 200) {
                if (dataTo["error"] === "error finding geo object") {
                    setError("Пожалуйста, уточните введённые адреса.")
                } else {
                    setError(dataTo["error"])
                }
                return
            }
        }

        let fromPoint
        if (objectFromType === 'by-geo') {
            fromPoint = location
        } else {
            fromPoint = dataFrom["coords"]
        }

        let toPoint
        if (objectToType === 'by-geo') {
            toPoint = location
        } else {
            toPoint = dataTo["coords"]
        }
        // console.log(data)
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({
                from_point: fromPoint,
                to_point: toPoint,
                type_id: typeId,
                has_loader: hasLoader
            }),
            credentials: 'include'
        };

        const response = await fetch("http://localhost:8080/api/price/predict", requestOptions);
        const data = await response.json();
        if (response.status !== 200) {
            setError(data["error"])
            console.log("bad request")
            return
        }
        setPredictedPrice(data["price"])
        setError('')
        console.log(data)
    }

    const createDelivery = async () => {
        let dataFrom
        if (objectFromType === 'by-object') {
            if (objectFrom === '') {
                setError("Поле с адресом не может быть пустым.")
                return
            }
            const requestOptions = {
                method: "GET",
                credentials: 'include'
            };
            const response = await fetch(`http://localhost:8080/api/geo/coords?q=${objectFrom}`, requestOptions)
            dataFrom = await response.json()
            if (response.status === 401) {
                navigate('/login')
                setUser(null)
                return
            } else if (response.status !== 200) {
                if (dataFrom["error"] === "error finding geo object") {
                    setError("Пожалуйста, уточните введённые адреса.")
                } else {
                    setError(dataFrom["error"])
                }
                return
            }
        }

        let dataTo
        if (objectToType === 'by-object') {
            if (objectTo === '') {
                setError("Поле с адресом не может быть пустым.")
                return
            }
            const requestOptions = {
                method: "GET",
                credentials: 'include'
            };
            const response = await fetch(`http://localhost:8080/api/geo/coords?q=${objectTo}`, requestOptions)
            dataTo = await response.json()
            if (response.status === 401) {
                navigate('/login')
                setUser(null)
                return
            } else if (response.status !== 200) {
                if (dataTo["error"] === "error finding geo object") {
                    setError("Пожалуйста, уточните введённые адреса.")
                } else {
                    setError(dataTo["error"])
                }
                return
            }
        }

        let fromPoint
        if (objectFromType === 'by-geo') {
            fromPoint = location
        } else {
            fromPoint = dataFrom["coords"]
        }

        let toPoint
        if (objectToType === 'by-geo') {
            toPoint = location
        } else {
            toPoint = dataTo["coords"]
        }
        // console.log(data)
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({
                from_point: fromPoint,
                to_point: toPoint,
                type_id: typeId,
                has_loader: hasLoader
            }),
            credentials: 'include'
        };
        const response = await fetch("http://localhost:8080/api/delivery/", requestOptions);
        const data = await response.json();
        if (response.status !== 200) {
            if (data["error"] === "requests limit reached") {
                setError("Достигнут лимит создания доставок. Подождите, пожалуйста.")
            } else {
                setError(data["error"])
            }
            setMessage('')
            return
        }

        setError('')
        setMessage("Заказ успешно размещён. Ожидайте курьера!")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        createDelivery()
    }
    return (
        <div className="px-40 pt-6 bg-gray-100">
            <div className="flex">
                {/*Ads*/}
                <div className="w-1/2">
                    <section className="mr-7">
                        <img className="w-full h-72 rounded-xl object-cover mb-4" src={banner} alt=""></img>
                        <img className="w-full h-72 rounded-xl object-cover mb-4" alt=""></img>
                        <img className="w-full h-72 rounded-xl object-cover mb-4" alt=""></img>
                    </section>
                </div>

                {/*Create delivery*/}
                <div className="w-1/2 block">
                    <div className="px-12 py-6 w-full rounded-xl bg-white shadow-lg">
                        <h5 className="flex justify-center font-montserrat font-semibold text-2xl text-gray-900 mb-6">
                            Оформление доставки
                        </h5>
                        <form>
                            <div className="grid grid-cols-8 gap-y-4">
                                {/*From Input Type Dropdown Radio*/}
                                <div className="relative col-span-1 z-10">
                                    <div className="hs-dropdown" data-hs-dropdown-auto-close="inside">
                                        <button id="hs-dropdown-item-checkbox" type="button"
                                                className="hs-dropdown-toggle w-full py-1 px-3 border-2 border-gray-200 inline-flex justify-center items-center gap-2 rounded-l-xl bg-white align-middle focus:outline-none focus:border-green-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth="1.5" stroke="currentColor"
                                                 className="w-7 h-7 text-gray-400">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                                            </svg>
                                            <svg className="hs-dropdown-open:rotate-180 w-2.5 h-2.5 text-gray-600"
                                                 width="16" height="16" viewBox="0 0 16 16" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                        </button>

                                        <div
                                            className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden mt-2 min-w-[15rem] bg-white shadow-md rounded-lg p-2">
                                            <div
                                                className="relative flex items-start py-2 px-3 rounded-xl hover:bg-gray-100">
                                                <div className="flex items-center h-5 mt-1">
                                                    {/*<div onClick={() => setObjectFromType('by-geo')}*/}
                                                    <div onClick={() => handleChangeType('from', 'by-geo')}
                                                         className="border-gray-200 rounded-full focus:ring-green-300">
                                                        <span
                                                            className="block text-gray-900 font-semibold text-sm">Моё местоположение</span>
                                                    </div>

                                                </div>
                                            </div>
                                            <div
                                                className="relative flex items-start py-2 px-3 rounded-xl hover:bg-gray-100">
                                                <div className="flex items-center h-5 mt-1">
                                                    <div onClick={() => handleChangeType('from', 'by-object')}
                                                         className="border-gray-200 rounded-full focus:ring-green-300">
                                                        <span
                                                            className="block text-sm font-montserrat font-semibold text-gray-900">По адресу</span>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/*From input*/}
                                <div className="relative col-span-3">
                                    <input type="text" disabled={objectFromType === 'by-geo'} value={objectFrom}
                                           onChange={(e) => setObjectFrom(e.target.value)}
                                           className="text-sm py-2 px-2.5 block w-full border-2 border-gray-200 focus:outline-none focus:border-green-500"
                                           placeholder={objectFromType === "by-geo" ? "Моё местоположение" : "Откуда"}></input>
                                </div>

                                {/*To Input Type Dropdown Radio*/}
                                <div className="relative col-span-1 z-10">
                                    <div className="hs-dropdown" data-hs-dropdown-auto-close="inside">
                                        <button id="hs-dropdown-item-checkbox" type="button"
                                                className="hs-dropdown-toggle w-full py-1 px-3 border-2 border-gray-200 inline-flex justify-center items-center gap-2 bg-white align-middle focus:outline-none focus:border-green-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth="1.5" stroke="currentColor"
                                                 className="w-7 h-7 text-gray-400">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                                            </svg>
                                            <svg className="hs-dropdown-open:rotate-180 w-2.5 h-2.5 text-gray-600"
                                                 width="16" height="16" viewBox="0 0 16 16" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                        </button>
                                        <div
                                            className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden mt-2 min-w-[15rem] bg-white shadow-md rounded-lg p-2">
                                            <div
                                                className="relative flex items-start py-2 px-3 rounded-xl hover:bg-gray-100">
                                                <div className="flex items-center h-5 mt-1">
                                                    <div onClick={() => handleChangeType('to', 'by-geo')}
                                                         className="border-gray-200 rounded-full focus:ring-green-300">
                                                        <span
                                                            className="block text-sm font-semibold text-gray-900">Моё местоположение</span>
                                                    </div>

                                                </div>
                                            </div>
                                            <div
                                                className="relative flex items-start py-2 px-3 rounded-xl hover:bg-gray-100">
                                                <div className="flex items-center h-5 mt-1">
                                                    <div onClick={() => handleChangeType('to', 'by-object')}
                                                         className="border-gray-200 rounded-full focus:ring-green-300">
                                                        <span
                                                            className="block text-sm font-montserrat font-semibold text-gray-900">По адресу</span>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/*To input*/}
                                <div className="relative col-span-3">
                                    <input type="text" disabled={objectToType === 'by-geo'} value={objectTo}
                                           onChange={(e) => setObjectTo(e.target.value)}
                                           className="text-sm py-2 px-2.5 block w-full border-2 border-gray-200 rounded-r-xl focus:outline-none focus:border-green-500"
                                           placeholder={objectToType === "by-geo" ? "Моё местоположение" : "Куда"}></input>
                                </div>

                                {/*Checkbox*/}
                                <div className="relative col-span-4 z-0">
                                    <div className="py-2.5 pl-4 pr-8 flex justify-between">
                                        <span className="text-gray-900 text-base font-montserrat">Услуги грузчика</span>
                                        <label className="relative inline-flex justify-center mb-4 cursor-pointer">
                                            <input type="checkbox" checked={hasLoader}
                                                   onChange={(e) => setHasLoader(!hasLoader)}
                                                   className="sr-only peer"></input>
                                            <div
                                                className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <ul className="grid w-full grid-cols-2 gap-3">
                                <div onClick={(e) => setTypeID(1)}>
                                    <div
                                        className={typeId === 1 ? "flex flex-row border-2 border-green-600 bg-green-100 rounded-xl relative" : "flex flex-row border-2 border-gray-400 rounded-xl relative"}>
                                        <img className="w-1/3 p-2" src={courier} alt="car"></img>
                                        <div className="w-2/3 grid grid-rows-3 text-right">
                                                <span
                                                    className="text-sm font-montserrat font-semibold absolute top-2 right-3">Пеший курьер</span>
                                            {/*<span*/}
                                            {/*    className="text-sm font-montserrat font-semibold">автомобиль</span>*/}
                                            <span
                                                className="text-sm font-montserrat font-medium absolute top-1/2 right-3">0.5м/0.5м/0.5м ~5кг</span>
                                        </div>
                                    </div>
                                </div>
                                <div onClick={(e) => setTypeID(2)}>
                                    <div
                                        className={typeId === 2 ? "flex flex-row border-2 border-green-600 bg-green-100 rounded-xl relative" : "flex flex-row border-2 border-gray-400 rounded-xl relative"}>
                                        <img className="w-1/3 p-2" src={car} alt="car"></img>
                                        <div className="w-2/3 grid grid-rows-3 text-right">
                                                <span
                                                    className="text-sm font-montserrat font-semibold absolute top-2 right-3">Легковой автомобиль</span>
                                            {/*<span*/}
                                            {/*    className="text-sm font-montserrat font-semibold">автомобиль</span>*/}
                                            <span
                                                className="text-sm font-montserrat font-medium absolute top-1/2 right-3">1м/1м/1м ~30кг</span>
                                        </div>
                                    </div>
                                </div>
                                <div onClick={(e) => setTypeID(3)}>
                                    <div
                                        className={typeId === 3 ? "flex flex-row border-2 border-green-600 bg-green-100 rounded-xl relative" : "flex flex-row border-2 border-gray-400 rounded-xl relative"}>
                                        <img className="w-1/3 p-2" src={van} alt="car"></img>
                                        <div className="w-2/3 grid grid-rows-3 text-right">
                                                <span
                                                    className="text-sm font-montserrat font-semibold absolute top-2 right-3">Минивэн</span>
                                            {/*<span*/}
                                            {/*    className="text-sm font-montserrat font-semibold">автомобиль</span>*/}
                                            <span
                                                className="text-sm font-montserrat font-medium absolute top-1/2 right-3">2м/1.5м/1.5м ~0.5т</span>
                                        </div>
                                    </div>
                                </div>
                                <div onClick={(e) => setTypeID(4)}>
                                    <div
                                        className={typeId === 4 ? "flex flex-row border-2 border-green-600 bg-green-100 rounded-xl relative" : "flex flex-row border-2 border-gray-400 rounded-xl relative"}>
                                        <img className="w-1/3 p-2" src={vanBig} alt="car"></img>
                                        <div className="w-2/3 grid grid-rows-3 text-right">
                                                <span
                                                    className="text-sm font-montserrat font-semibold absolute top-2 right-3">Газель</span>
                                            {/*<span*/}
                                            {/*    className="text-sm font-montserrat font-semibold">автомобиль</span>*/}
                                            <span
                                                className="text-sm font-montserrat font-medium absolute top-1/2 right-3">3м/2м/1.5м ~1т</span>
                                        </div>
                                    </div>
                                </div>
                                <div onClick={(e) => setTypeID(5)}>
                                    <div
                                        className={typeId === 5 ? "flex flex-row border-2 border-green-600 bg-green-100 rounded-xl relative" : "flex flex-row border-2 border-gray-400 rounded-xl relative"}>
                                        <img className="w-1/3 p-2" src={boxTruck} alt="car"></img>
                                        <div className="w-2/3 grid grid-rows-3 text-right">
                                                <span
                                                    className="text-sm font-montserrat font-semibold absolute top-2 right-3">Удлинённая газель</span>
                                            {/*<span*/}
                                            {/*    className="text-sm font-montserrat font-semibold">автомобиль</span>*/}
                                            <span
                                                className="text-sm font-montserrat font-medium absolute top-1/2 right-3">4м/2м/2м ~1.5т</span>
                                        </div>
                                    </div>
                                </div>
                            </ul>
                            <div className="grid w-full grid-cols-4 gap-5 mt-3">
                                {/*Calculate price*/}
                                <button onClick={predictPrice}
                                        className="col-span-2 px-3 w-full border-2 border-green-600 rounded-xl bg-green-500 text-white font-montserrat font-medium text-sm hover:bg-green-600 hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                                        type="button">Рассчитать стоимость
                                </button>

                                {/*Price*/}
                                <div className="col-span-2 grid grid-cols-2">
                                    <span
                                        className="text-sm font-montserrat font-medium col-span-2">Ориентировочная стоимость:
                                    </span>
                                    {predictedPrice !== 0 ?
                                        <span className="text-xl font-montserrat font-bold">~{predictedPrice}₽</span> :
                                        <span className="text-xl font-montserrat font-bold">***₽</span>
                                    }
                                </div>

                                {/*Submit delivery*/}
                                <button onClick={handleSubmit}
                                        className="col-start-2 col-span-2 text-white border-2 border-green-600 bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br hover:border-green-700 focus:ring-4 focus:outline-none focus:ring-green-400 font-montserrat rounded-lg py-2 text-center"
                                        type="submit">Оформить доставку 📦
                                </button>
                            </div>
                        </form>
                        {
                            error !== '' &&
                            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4 text-sm">{error}</div>
                        }
                        {
                            message !== '' &&
                            <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">{message} Свои
                                заказы можно посмотреть в
                                <NavLink className="font-bold text-green-500" to='/profile'> личном кабинете</NavLink>.
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main;
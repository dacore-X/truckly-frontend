import moment from "moment";
import React, {useContext, useEffect, useState} from 'react';
import {NavLink, useLocation, useNavigate, useParams} from "react-router-dom";
import {UserContext} from "../context/UserContext";
import emptyAvatar from "../img/avatar.png"

export const deliveryTypes = {
    1: "Пеший курьер",
    2: "Легковой автомобиль",
    3: "Минивэн",
    4: "Газель",
    5: "Удлинённая газель"
}

export const deliveryStatuses = {
    1: "Создано",
    2: "В пути",
    3: "Завершено",
    4: "Отклонено"
}

export const deliveryColors = {
    1: {
        "bg": "bg-gray-100",
        "text": "text-gray-600",
        "border": "border-gray-600"
    },
    2: {
        "bg": "bg-yellow-100",
        "text": "text-yellow-600",
        "border": "border-yellow-600"
    },
    3: {
        "bg": "bg-green-100",
        "text": "text-green-600",
        "border": "border-green-600"
    },
    4: {
        "bg": "bg-red-100",
        "text": "text-red-600",
        "border": "border-red-600"
    },

}

function DeliveryInfo(props) {
    const [delivery, setDelivery] = useState(null)
    const [user, setUser] = useContext(UserContext)
    const {id} = useParams()
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [successFinish, setSuccessFinish] = useState(false)

    let {state} = useLocation();

    const getDeliveryByID = async () => {
        const requestOptions = {
            method: "GET",
            credentials: 'include'
        };
        const response = await fetch(`http://localhost:8080/api/delivery/${id}`, requestOptions)
        const data = await response.json()
        console.log(data)
        if (response.status === 401) {
            navigate('/')
            setUser(null)
            return
        } else if (data["error"] === 'user with this id doesn\'t have permission to get delivery') {
            navigate('/forbidden')
        } else if (response.status !== 200) {
            setError(data["error"])
        }
        setDelivery(data)
    }

    const handleFinish = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({
                status_id: 3
            }),
            credentials: 'include'
        };
        const response = await fetch(`http://localhost:8080/api/delivery/${id}/status`, requestOptions);
        const data = await response.json();
        if (response.status === 401) {
            navigate('/login')
            setUser(null)
            return
        } else if (response.status !== 200) {
            setError(data["error"])
            return
        }

        setSuccessFinish(true)
        setError('')
    }

    const cancelOrder = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({
                status_id: 4
            }),
            credentials: 'include'
        };
        const response = await fetch(`http://localhost:8080/api/delivery/${id}/cancel`, requestOptions);
        const data = await response.json();
        if (response.status === 401) {
            navigate('/login')
            setUser(null)
            return
        } else if (response.status !== 200) {
            setError(data["error"])
            return
        }

        setMessage('Заказ успешно отклонён')
        setError('')
    }
    useEffect(() => {
        getDeliveryByID()
        // console.log(id)
    }, [id])


    return (

        <div>
            {delivery &&
                <div className="max-w-7xl px-8 py-10 mx-auto rounded-lg">
                    {/*Delivery Number Header*/}
                    <h5 className="flex justify-center font-montserrat font-semibold text-2xl text-gray-900 mb-10">
                        Заказ №{delivery["id"]}
                    </h5>

                    {/*Delivery Info*/}
                    <div className="grid grid-cols-2 items-center gap-12">
                        {/*Map*/}
                        <div>
                            {/*<DeliveryNavigation delivery={delivery}/>*/}
                        </div>


                        <div>
                            {/*Delivery Info Card*/}
                            {state && state.from === "courier" ?
                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="px-3 py-2 col-span-2 rounded-lg bg-white shadow-lg">
                                            <div className="flex flex-col space-y-2">
                                                <span
                                                    className="text-sm leading-4 font-montserrat font-normal text-gray-500">Пункт отправки</span>
                                                <span
                                                    className="text-base leading-4 font-montserrat font-semibold text-gray-900">{delivery["from_object"]["object"]}</span>
                                            </div>
                                        </div>
                                        <div className="px-3 py-2 col-span-2 rounded-lg bg-white shadow-lg">
                                            <div className="flex flex-col space-y-2">
                                                <span
                                                    className="text-sm leading-4 font-montserrat font-normal text-gray-500">Пункт назначения</span>
                                                <span
                                                    className="text-base leading-4 font-montserrat font-semibold text-gray-900">{delivery["to_object"]["object"]}</span>
                                            </div>
                                        </div>
                                        <div className="px-3 py-2 col-span-1 rounded-lg bg-white shadow-lg">
                                            <div className="flex flex-col space-y-2">
                                                <span
                                                    className="text-sm leading-4 font-montserrat font-normal text-gray-500">Тип доставки</span>
                                                <span
                                                    className="text-base leading-4 font-montserrat font-semibold text-gray-900">{deliveryTypes[delivery["type_id"]]}</span>
                                            </div>
                                        </div>
                                        <div className="px-3 py-2 col-span-1 rounded-lg bg-white shadow-lg">
                                            <div className="flex flex-col space-y-2">
                                                <span
                                                    className="text-sm leading-4 font-montserrat font-normal text-gray-500">Наличие грузчика</span>
                                                <span
                                                    className="text-base leading-4 font-montserrat font-semibold text-gray-900">{delivery["has_loader"] ? "Есть" : "Нет"}</span>
                                            </div>
                                        </div>
                                        <div className="px-3 py-2 col-span-1 rounded-lg bg-white shadow-lg">
                                            <div className="flex flex-col space-y-2">
                                                <span
                                                    className="text-sm leading-4 font-montserrat font-normal text-gray-500">Цена</span>
                                                <span
                                                    className="text-base leading-4 font-montserrat font-semibold text-gray-900">{delivery["price"]} ₽</span>
                                            </div>
                                        </div>
                                        <div className="px-3 py-2 col-span-1 rounded-lg bg-white shadow-lg">
                                            <div className="flex flex-col space-y-2">
                                                <span
                                                    className="text-sm leading-4 font-montserrat font-normal text-gray-500">Дата создания</span>
                                                <span
                                                    className="text-base leading-4 font-montserrat font-semibold text-gray-900">{moment(delivery["time"]).format('HH:MM DD.MM.YYYY')}</span>
                                            </div>
                                        </div>
                                        {(!successFinish && delivery["status_id"] === 2) &&
                                            <div className="col-start-2 col-end-3 mt-10">
                                                <button onClick={handleFinish}
                                                        className="py-2 px-3 w-full border-2 border-green-600 rounded-xl bg-green-500 text-white font-montserrat font-medium hover:bg-green-600 hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-300">
                                                    Завершить доставку
                                                </button>
                                            </div>
                                        }
                                    </div>
                                    {error !== '' &&
                                        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">{error}
                                        </div>
                                    }
                                    {(successFinish || delivery["status_id"] === 3) &&
                                        <div
                                            className="mt-4 bg-green-50 border border-green-200 rounded-md p-4 font-montserrat">Заказ
                                            успешно выполнен!
                                            <NavLink className="font-montserrat font-semibold text-green-500"
                                                     to='/deliveries'> Перейти к поиску новых заказов.</NavLink>
                                        </div>
                                    }
                                </div> :
                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="px-3 py-2 col-span-2 rounded-lg bg-white shadow-lg">
                                            <div className="flex flex-col space-y-2">
                                            <span
                                                className="text-sm leading-4 font-montserrat font-normal text-gray-500">Пункт отправки</span>
                                                <span
                                                    className="text-base leading-4 font-montserrat font-semibold text-gray-900">{delivery["from_object"]["object"]}</span>
                                            </div>
                                        </div>
                                        <div className="px-3 py-2 col-span-2 rounded-lg bg-white shadow-lg">
                                            <div className="flex flex-col space-y-2">
                                            <span
                                                className="text-sm leading-4 font-montserrat font-normal text-gray-500">Пункт назначения</span>
                                                <span
                                                    className="text-base leading-4 font-montserrat font-semibold text-gray-900">{delivery["to_object"]["object"]}</span>
                                            </div>
                                        </div>
                                        <div className="px-3 py-2 col-span-1 rounded-lg bg-white shadow-lg">
                                            <div className="flex flex-col space-y-2">
                                            <span
                                                className="text-sm leading-4 font-montserrat font-normal text-gray-500">Тип доставки</span>

                                                <span
                                                    className="text-base leading-4 font-montserrat font-semibold text-gray-900">{deliveryTypes[delivery["type_id"]]}</span>
                                            </div>
                                        </div>
                                        <div className="px-3 py-2 col-span-1 rounded-lg bg-white shadow-lg">
                                            <div className="flex flex-col space-y-2">
                                            <span
                                                className="text-sm leading-4 font-montserrat font-normal text-gray-500">Наличие грузчика</span>
                                                <span
                                                    className="text-base leading-4 font-montserrat font-semibold text-gray-900">{delivery["has_loader"] ? "Есть" : "Нет"}</span>
                                            </div>
                                        </div>
                                        <div className="px-3 py-2 col-span-1 rounded-lg bg-white shadow-lg">
                                            <div className="flex flex-col space-y-2">
                                        <span
                                            className="text-sm leading-4 font-montserrat font-normal text-gray-500">Цена</span>
                                                <span
                                                    className="text-base leading-4 font-montserrat font-semibold text-gray-900">{delivery["price"]} ₽</span>
                                            </div>
                                        </div>
                                        <div className="px-3 py-2 col-span-1 rounded-lg bg-white shadow-lg">
                                            <div className="flex flex-col space-y-2">
                                            <span
                                                className="text-sm leading-4 font-montserrat font-normal text-gray-500">Дата создания</span>
                                                <span
                                                    className="text-base leading-4 font-montserrat font-semibold text-gray-900">{moment(delivery["time"]).format('HH:MM DD.MM.YYYY')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        {delivery["courier"]["name"] !== "" ?
                                            <div
                                                className="col-span-6 flex items-center space-x-3 rounded-2xl bg-white bg-clip-border px-3 py-2 shadow-lg">
                                                <div className="flex-shrink-0">
                                                    <img className="w-12 h-12 rounded-full object-cover"
                                                         src={emptyAvatar}
                                                         alt="avatar"></img>
                                                </div>
                                                <div className="flex-1 min-w-0 pr-2">
                                                    <p className="text-base font-montserrat font-semibold text-gray-900">
                                                        {delivery["courier"]["name"]}
                                                    </p>
                                                    <p className="text-sm font-montserrat font-medium text-gray-400">
                                                        {delivery["courier"]["phone_number"]}
                                                    </p>
                                                </div>
                                                <div className="flex-1 min-w-0 border-l border-gray-200 pl-2">
                                                    <div className="flex flex-row place-items-center">
                                                        <svg aria-hidden="true" className="w-5 h-5 text-yellow-400"
                                                             fill="currentColor" viewBox="0 0 20 20"
                                                             xmlns="http://www.w3.org/2000/svg"><title>Rating
                                                            star</title>
                                                            <path
                                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                        </svg>
                                                        <p className="ml-2 text-sm font-montserrat font-bold text-gray-900">{delivery["courier"]["rating"]}</p>
                                                    </div>
                                                    <p className="text-sm font-montserrat font-medium text-gray-400">
                                                        Курьер
                                                        с {moment(delivery["courier"]["created_at"]).format('DD.MM.YYYY')}
                                                    </p>
                                                </div>
                                            </div>
                                            : (delivery["status_id"] === 1 && message === '') ?
                                            <div className="grid grid-cols-6 gap-4">
                                                <div
                                                    className="col-span-4 items-center space-x-3 rounded-2xl bg-white bg-clip-border px-3 py-2 shadow-lg">
                                                    <div className="font-montserrat font-semibold">
                                                        🔎 Мы уже ищем курьера для Вас!
                                                    </div>
                                                </div>
                                                <div onClick={()=>{cancelOrder()}}
                                                    className="col-span-2 bg-red-200 space-x-3 rounded-2xl py-2 shadow-lg flex flex-row place-content-center hover:bg-red-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                         viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                                         className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="M6 18L18 6M6 6l12 12"/>
                                                    </svg>

                                                    <div>Отклонить</div>
                                                </div>
                                            </div>: message !== '' &&
                                                <div className="bg-green-100 text-green-500 font-semibold py-2 pl-4 rounded-xl">{message}</div>
                                        }
                                    </div>

                                    {delivery["status_id"] === 1 ?
                                        <ol className="flex items-center bg-white rounded-lg shadow-lg px-3 py-2">
                                            <li className="relative">
                                                <div className="flex items-center">
                                                    <div
                                                        className="z-10 flex items-center justify-center w-6 h-6 bg-green-100 rounded-full ring-8 ring-green-500 shrink-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                             viewBox="0 0 24 24"
                                                             strokeWidth="1.5" stroke="currentColor"
                                                             className="w-3 h-3 text-green-800">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12"/>
                                                        </svg>
                                                    </div>
                                                    <div className="flex w-full bg-gray-500 h-0.5"></div>
                                                </div>
                                                <div className="mt-3 pr-8">
                                                    <h3 className="text-lg font-montserrat font-semibold text-gray-900">Создано</h3>
                                                    <p className="text-xs font-montserrat font-normal text-gray-500">Заказ
                                                        создан.
                                                        Скоро его примет курьер.</p>
                                                </div>
                                            </li>
                                            <li className="relative">
                                                <div className="flex items-center">
                                                    <div
                                                        className="z-10 flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full ring-8 ring-gray-500 shrink-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                             viewBox="0 0 24 24"
                                                             strokeWidth="1.5" stroke="currentColor"
                                                             className="w-3 h-3 text-gray-800">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
                                                        </svg>
                                                    </div>
                                                    <div className="flex w-full bg-gray-500 h-0.5"></div>
                                                </div>
                                                <div className="mt-3 pr-8">
                                                    <h3 className="text-lg font-montserrat font-semibold text-gray-900">В
                                                        пути</h3>
                                                    <p className="text-xs font-montserrat font-normal text-gray-500">Заказ
                                                        в
                                                        пути.
                                                        Наш курьер совершает доставку.</p>
                                                </div>
                                            </li>
                                            <li className="relative">
                                                <div className="flex items-center">
                                                    <div
                                                        className="z-10 flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full ring-8 ring-gray-500 shrink-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                             viewBox="0 0 24 24"
                                                             strokeWidth="1.5" stroke="currentColor"
                                                             className="w-3 h-3 text-gray-800">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  d="M4.5 12.75l6 6 9-13.5"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    <h3 className="text-lg font-montserrat font-semibold text-gray-900">Завершена</h3>
                                                    <p className="text-xs font-montserrat font-normal text-gray-500">Доставка
                                                        завершена. Наш курьер доставил заказ.</p>
                                                </div>
                                            </li>
                                        </ol>
                                        :
                                        delivery["status_id"] === 2 ?
                                            <ol className="flex items-center bg-white rounded-lg shadow-lg px-3 py-2">
                                                <li className="relative">
                                                    <div className="flex items-center">
                                                        <div
                                                            className="z-10 flex items-center justify-center w-6 h-6 bg-green-100 rounded-full ring-8 ring-green-500 shrink-0">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                 viewBox="0 0 24 24"
                                                                 strokeWidth="1.5" stroke="currentColor"
                                                                 className="w-3 h-3 text-green-800">
                                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                                      d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12"/>
                                                            </svg>
                                                        </div>
                                                        <div className="flex w-full bg-green-500 h-0.5"></div>
                                                    </div>
                                                    <div className="mt-3 pr-8">
                                                        <h3 className="text-lg font-montserrat font-semibold text-gray-900">Создано</h3>
                                                        <p className="text-xs font-montserrat font-normal text-gray-500">Заказ
                                                            создан.
                                                            Скоро его примет курьер.</p>
                                                    </div>
                                                </li>
                                                <li className="relative">
                                                    <div className="flex items-center">
                                                        <div
                                                            className="z-10 flex items-center justify-center w-6 h-6 bg-green-100 rounded-full ring-8 ring-green-500 shrink-0">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                 viewBox="0 0 24 24"
                                                                 strokeWidth="1.5" stroke="currentColor"
                                                                 className="w-3 h-3 text-green-800">
                                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                                      d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
                                                            </svg>
                                                        </div>
                                                        <div className="flex w-full bg-gray-500 h-0.5"></div>
                                                    </div>
                                                    <div className="mt-3 pr-8">
                                                        <h3 className="text-lg font-montserrat font-semibold text-gray-900">В
                                                            пути</h3>
                                                        <p className="text-xs font-montserrat font-normal text-gray-500">Заказ
                                                            в
                                                            пути.
                                                            Наш курьер совершает доставку.</p>
                                                    </div>
                                                </li>
                                                <li className="relative">
                                                    <div className="flex items-center">
                                                        <div
                                                            className="z-10 flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full ring-8 ring-gray-500 shrink-0">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                 viewBox="0 0 24 24"
                                                                 strokeWidth="1.5" stroke="currentColor"
                                                                 className="w-3 h-3 text-gray-800">
                                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                                      d="M4.5 12.75l6 6 9-13.5"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3">
                                                        <h3 className="text-lg font-montserrat font-semibold text-gray-900">Завершена</h3>
                                                        <p className="text-xs font-montserrat font-normal text-gray-500">Доставка
                                                            завершена. Наш курьер доставил заказ.</p>
                                                    </div>
                                                </li>
                                            </ol>
                                            :
                                            delivery["status_id"] === 3 ?
                                                <ol className="flex items-center bg-white rounded-lg shadow-lg px-3 py-2">
                                                    <li className="relative">
                                                        <div className="flex items-center">
                                                            <div
                                                                className="z-10 flex items-center justify-center w-6 h-6 bg-green-100 rounded-full ring-8 ring-green-500 shrink-0">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                     viewBox="0 0 24 24"
                                                                     strokeWidth="1.5" stroke="currentColor"
                                                                     className="w-3 h-3 text-green-800">
                                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                                          d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12"/>
                                                                </svg>
                                                            </div>
                                                            <div className="flex w-full bg-green-500 h-0.5"></div>
                                                        </div>
                                                        <div className="mt-3 pr-8">
                                                            <h3 className="text-lg font-montserrat font-semibold text-gray-900">Создано</h3>
                                                            <p className="text-xs font-montserrat font-normal text-gray-500">Заказ
                                                                создан.
                                                                Скоро его примет курьер.</p>
                                                        </div>
                                                    </li>
                                                    <li className="relative">
                                                        <div className="flex items-center">
                                                            <div
                                                                className="z-10 flex items-center justify-center w-6 h-6 bg-green-100 rounded-full ring-8 ring-green-500 shrink-0">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                     viewBox="0 0 24 24"
                                                                     strokeWidth="1.5" stroke="currentColor"
                                                                     className="w-3 h-3 text-green-800">
                                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                                          d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
                                                                </svg>
                                                            </div>
                                                            <div className="flex w-full bg-green-500 h-0.5"></div>
                                                        </div>
                                                        <div className="mt-3 pr-8">
                                                            <h3 className="text-lg font-montserrat font-semibold text-gray-900">В
                                                                пути</h3>
                                                            <p className="text-xs font-montserrat font-normal text-gray-500">Заказ
                                                                в
                                                                пути.
                                                                Наш курьер совершает доставку.</p>
                                                        </div>
                                                    </li>
                                                    <li className="relative">
                                                        <div className="flex items-center">
                                                            <div
                                                                className="z-10 flex items-center justify-center w-6 h-6 bg-green-100 rounded-full ring-8 ring-green-500 shrink-0">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                     viewBox="0 0 24 24"
                                                                     strokeWidth="1.5" stroke="currentColor"
                                                                     className="w-3 h-3 text-green-800">
                                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                                          d="M4.5 12.75l6 6 9-13.5"/>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3">
                                                            <h3 className="text-lg font-montserrat font-semibold text-gray-900">Завершена</h3>
                                                            <p className="text-xs font-montserrat font-normal text-gray-500">Доставка
                                                                завершена. Наш курьер доставил заказ.</p>
                                                        </div>
                                                    </li>
                                                </ol>
                                                :
                                                <ol className="flex items-center bg-white rounded-lg shadow-lg px-3 py-2">
                                                    <li className="relative">
                                                        <div className="flex items-center">
                                                            <div
                                                                className="z-10 flex items-center justify-center w-6 h-6 bg-green-100 rounded-full ring-8 ring-green-500 shrink-0">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                     viewBox="0 0 24 24" strokeWidth="1.5"
                                                                     stroke="currentColor"
                                                                     className="w-3 h-3 text-green-800">
                                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                                          d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12"/>
                                                                </svg>
                                                            </div>
                                                            <div className="flex w-full bg-green-500 h-0.5"></div>
                                                        </div>
                                                        <div className="mt-3 pr-8">
                                                            <h3 className="text-lg font-montserrat font-semibold text-gray-900">Создана</h3>
                                                            <p className="text-xs font-montserrat font-normal text-gray-500">Заказ
                                                                создан. Скоро его примет курьер.</p>
                                                        </div>
                                                    </li>
                                                    <li className="relative">
                                                        <div className="flex items-center">
                                                            <div
                                                                className="z-10 flex items-center justify-center w-6 h-6 bg-red-100 rounded-full ring-8 ring-red-500 shrink-0">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                     viewBox="0 0 24 24" strokeWidth="1.5"
                                                                     stroke="currentColor"
                                                                     className="w-3 h-3 text-red-800">
                                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                                          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 pr-8">
                                                            <h3 className="text-lg font-montserrat font-semibold text-gray-900">Отклонена</h3>
                                                            <p className="text-xs font-montserrat font-normal text-gray-500">Заказ
                                                                отменен. Наши курьеры его не видят.</p>
                                                        </div>
                                                    </li>
                                                </ol>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default DeliveryInfo;
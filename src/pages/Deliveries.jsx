import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {UserContext} from "../context/UserContext";
import DeliveryAcceptPopup from "../components/DeliveryAcceptPopup";
import moment from "moment/moment";

const deliveryTypes = {
    1: "Пеший курьер",
    2: "Легковой автомобиль",
    3: "Минивэн",
    4: "Газель",
    5: "Удлинённая газель"
}

function Deliveries(props) {
    const [, setUser] = useContext(UserContext)
    const [deliveries, setDeliveries] = useState([])
    const navigate = useNavigate()
    const [page, setPage] = useState(1)
    const [error, setError] = useState('')
    const [location, setLocation] = useState(null)
    const [popup, setPopup] = useState(false)
    const [activeDelivery, setActiveDelivery] = useState(0)

    const successGeolocation = (pos) => {
        setLocation({
            "lat": pos.coords.latitude,
            "lon": pos.coords.longitude
        })
    }

    const failGeolocation = () => {
        setError("Ошибка при определении геолокации")
    }

    const fetchDeliveries = async () => {
        if (page <= 0) {
            setPage(1)
        }

        const requestOptions = {
            method: "GET",
            credentials: 'include'
        };
        const response = await fetch(`http://localhost:8080/api/delivery/search?page=${page}&lat=${location["lat"]}&lon=${location["lon"]}`, requestOptions);
        const data = await response.json();
        if (response.status === 401) {
            setDeliveries([])
            navigate('/login')
            setUser(null)
            return

        } else if (response.status !== 200) {
            setDeliveries([])
            setError(data["error"])
            return
        }

        setError('')
        setDeliveries(data)
    }

    function getLocation() {
        if (!navigator.geolocation) {
            alert("Геолокация не поддерживается браузером")
        } else {
            navigator.geolocation.getCurrentPosition(successGeolocation, failGeolocation);
            console.log("Определение геолокации")
        }
    }

    function handlePopup(idx) {
        setPopup(!popup)
        setActiveDelivery(idx)
        console.log("Попап открылся")
    }

    useEffect(() => {
        getLocation()
    }, [])

    useEffect(() => {
        if (location) {
            fetchDeliveries()
        }
    }, [location, page])

    return (
        <div className="max-w-full px-80 py-4 mx-auto">
            {/*Card*/}
            <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <div className="min-w-full inline-block align-middle">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                            {/*Header*/}
                            <div className="px-4 py-4 flex justify-between items-center border-gray-200">
                                <h5 className="font-montserrat font-semibold text-2xl text-gray-900">
                                    Список ожидающих заказов
                                </h5>
                                <button type="button" onClick={() => fetchDeliveries()}
                                        className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-montserrat font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
                                    </svg>
                                    Обновить
                                </button>
                            </div>

                            {/*Available Deliveries Table*/}
                            {popup && <DeliveryAcceptPopup delivery={deliveries[activeDelivery]} setPopup={setPopup}
                                                           setError={setError}/>}
                            {deliveries.length !== 0 ?
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="pl-6 py-3 text-left">
                                            <div className="flex items-center gap-x-2">
                                            <span
                                                className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                                Заказ
                                            </span>
                                            </div>
                                        </th>

                                        <th scope="col" className="px-3 py-3 text-left">
                                            <div className="flex items-center gap-x-2">
                                            <span
                                                className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                                Дата доставки
                                            </span>
                                            </div>
                                        </th>

                                        <th scope="col" className="px-3 py-3 text-left">
                                            <div className="flex items-center gap-x-2">
                                            <span
                                                className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                                Тип доставки
                                            </span>
                                            </div>
                                        </th>

                                        <th scope="col" className="px-3 py-3 text-left">
                                            <div className="flex items-center gap-x-2">
                                            <span
                                                className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                                Наличие грузчика
                                            </span>
                                            </div>
                                        </th>

                                        <th scope="col" className="px-3 py-3 text-left">
                                            <div className="flex items-center gap-x-2">
                                            <span
                                                className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                                Расстояние
                                            </span>
                                            </div>
                                        </th>

                                        <th scope="col" className="px-3 py-3 text-left">
                                            <div className="flex items-center gap-x-2">
                                            <span
                                                className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                                Цена
                                            </span>
                                            </div>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                    <>
                                        {deliveries.map((delivery, idx) =>
                                            <tr onClick={() => handlePopup(idx)} key={idx}
                                                className="hover:bg-gray-100">
                                                <td className="h-px w-px whitespace-nowrap">
                                                    <div className="pl-6 py-2">
                                                        <div
                                                            className="font-montserrat text-xs text-green-600 decoration-2 rounded hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300">№{delivery["id"]}</div>
                                                    </div>
                                                </td>
                                                <td className="h-px w-px whitespace-nowrap">
                                                    <div className="px-3 py-2">
                                            <span
                                                className="font-montserrat text-xs text-gray-600">{moment(delivery["time"]).format('HH:MM DD.MM.YYYY')}</span>
                                                    </div>
                                                </td>
                                                <td className="h-px w-px whitespace-nowrap">
                                                    <div className="px-3 py-2">
                                            <span
                                                className="font-montserrat text-xs text-gray-600">{deliveryTypes[delivery["type_id"]]}</span>
                                                    </div>
                                                </td>
                                                <td className="h-px w-px whitespace-nowrap">
                                                    <div className="px-3 py-2">
                                                        <span
                                                            className="font-montserrat text-xs text-gray-600">{delivery["has_loader"] ? "Есть" : "Нет"}</span>
                                                    </div>
                                                </td>
                                                <td className="h-px w-px whitespace-nowrap">
                                                    <div className="px-3 py-2">
                                                    <span
                                                        className="font-montserrat text-xs text-gray-600">{delivery["distance"]} м</span>
                                                    </div>
                                                </td>
                                                <td className="h-px w-px whitespace-nowrap">
                                                    <div className="px-3 py-2">
                                                    <span
                                                        className="font-montserrat text-xs text-gray-600">{delivery["price"]} ₽ </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                    </tbody>
                                </table>
                                :
                                <div className="text-xl p-4">🔎 К сожалению, заказы по заданным параметрам не
                                    найдены.</div>
                            }
                            <div className="px-6 py-4 gap-3 flex justify-end items-center border-t border-gray-200">
                                <div>
                                    <div className="inline-flex gap-x-2">
                                        {page === 1 ? <></> :
                                            <button onClick={() => setPage(page - 1)} type="button"
                                                    className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-montserrat font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 text-sm">
                                                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="16"
                                                     height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd"
                                                          d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                                                </svg>
                                                Пред
                                            </button>
                                        }
                                        <span
                                            className="py-2 px-3 block w-full border shadow-sm bg-white text-gray-700 rounded-md font-montserrat font-medium text-sm">{page}</span>
                                        {error !== '' ? <></> :
                                            <button onClick={() => setPage(page + 1)} type="button"
                                                    disabled={error !== ''}
                                                    className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-montserrat font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 text-sm">
                                                След
                                                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="16"
                                                     height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd"
                                                          d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                                                </svg>
                                            </button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Deliveries;
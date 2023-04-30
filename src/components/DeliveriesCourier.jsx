import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from "../context/UserContext";
import {Link, useNavigate} from "react-router-dom";
import DeliveryCard from "./DeliveryCard";

function DeliveriesCourier(props) {
    const [, setUser] = useContext(UserContext)
    const [deliveriesCourier, setDeliveriesCourier] = useState([])
    const navigate = useNavigate()
    const [page, setPage] = useState(1)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchDeliveriesCourier()
    }, [page])
    const fetchDeliveriesCourier = async () => {
        if (page <= 0) {
            setPage(1)
        }

        const requestOptions = {
            method: "GET",
            credentials: 'include'
        };
        const response = await fetch(`http://localhost:8080/api/delivery/?page=${page}`, requestOptions);
        const data = await response.json();

        if (response.status === 401) {
            setDeliveriesCourier([])
            navigate('/login')
            setUser(null)
            return

        } else if (response.status !== 200) {
            setDeliveriesCourier([])
            setError(data["error"])
            return
        }

        setError('')
        setDeliveriesCourier(data)
    }

    return (
        <div className="px-40">
            <h5 className="flex justify-center font-montserrat font-semibold text-2xl text-gray-900 my-2">
                Курьерские заказы
            </h5>
            {deliveriesCourier.length !== 0 ?
                <div className="container mx-auto p-2 antialiased">
                    {deliveriesCourier.map((delivery, idx) =>
                        <div key={idx} onClick={() => {
                            navigate(`/delivery/${delivery["id"]}`, {state: {from: 'courier'}})
                        }}>
                            <DeliveryCard delivery={delivery}/>
                        </div>
                    )}
                </div> :
                <div className="text-center font-semibold">🔎 К сожалению, заказы по заданным параметрам не
                    найдены.
                    <Link className="text-green-500" to='/deliveries'> Перейти к поиску заказов.</Link>
                </div>
            }
            <div className="py-2 gap-3 flex justify-end items-center">
                <div>
                    <div className="inline-flex gap-x-2 mb-4">
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
    );
}

export default DeliveriesCourier;
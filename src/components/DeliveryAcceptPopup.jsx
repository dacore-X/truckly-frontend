import React, {useContext} from 'react';
import {deliveryTypes} from "../pages/DeliveryInfo";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../context/UserContext";

function DeliveryAcceptPopup({delivery, setPopup, setError}) {
    const navigate = useNavigate()
    const [,setUser] = useContext(UserContext)
    const acceptDelivery = async () => {
        const requestOptions = {
            method: "POST",
            credentials: 'include'
        };
        const response = await fetch(`http://localhost:8080/api/delivery/${delivery["id"]}/accept`, requestOptions);
        const data = await response.json();
        if (response.status === 401) {
            navigate('/login')
            setUser(null)
            return
        }
        else if (response.status !== 200) {
            if (data["error"] === "multiple delivery accept"){
                navigate('/profile')
            }
            setError(data["error"])
            return
        }
        setPopup(false)
        navigate(`/delivery/${delivery["id"]}`, { state: { from: 'courier'} })
    }

    return (
        <div onClick={() => setPopup(false)} className="h-screen fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-10">
            <div className="w-96 mt-16 m-auto max-w-sm">
                <div className="bg-white shadow-2xl rounded-3xl relative">
                    <button onClick={()=>setPopup(false)} type="button"
                            className="absolute top-2 right-4 bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                        <span className="sr-only">Close menu</span>
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                    <h2 className="text-center text-gray-700 text-xl font-bold pt-4">Заказ №{delivery["id"]}</h2>
                    <div className="w-5/6 m-auto">
                        <h3 className="text-left text-gray-700 text-base font-semibold pt-2">Пункт отправки</h3>
                        <p className="font-montserrat text-sm text-gray-700">{delivery["from_object"]}</p>
                        <h3 className="text-left text-gray-700 text-base font-semibold pt-2">Пункт назначения</h3>
                        <p className="font-montserrat text-sm text-gray-700">{delivery["to_object"]}</p>
                        <h3 className="text-left text-gray-700 text-base font-semibold pt-2">Тип доставки</h3>
                        <p className="font-montserrat text-sm text-gray-700">{deliveryTypes[delivery["type_id"]]}</p>
                        <h3 className="text-left text-gray-700 text-base font-semibold pt-2">Наличие грузчика</h3>
                        <p className="font-montserrat text-sm text-gray-700">{delivery["has_loader"] ? "Есть" : "Нет"}</p>
                        <h3 className="text-left text-gray-700 text-base font-semibold pt-2">Цена</h3>
                        <p className="font-montserrat text-sm text-gray-700">{delivery["price"]} ₽</p>
                    </div>
                    <div className="w-4/6 m-auto mt-6">
                        <button onClick={acceptDelivery}
                            className="p-2 mb-4 w-full border-2 border-green-600 rounded-2xl bg-green-500 text-sm text-white font-montserrat font-bold hover:bg-green-600 hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                            type="button">Принять заказ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeliveryAcceptPopup;
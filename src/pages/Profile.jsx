import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from "../context/UserContext";
import {useNavigate} from "react-router-dom";
import emptyAvatar from "../img/avatar.png"
import moment from "moment/moment";
import DeliveriesCourier from "../components/DeliveriesCourier";
import DeliveryClient from "../components/DeliveryClient";

function Profile(props) {
    const [user, setUser] = useContext(UserContext)
    const [userInfo, setUserInfo] = useState(null)
    const navigate = useNavigate()
    const [error, setError] = useState('')

    const fetchMe = async () => {
        const requestOptions = {
            method: "GET",
            credentials: 'include'
        };
        const response = await fetch(`http://localhost:8080/api/user/me`, requestOptions);
        const data = await response.json();
        if (response.status === 401) {
            navigate('/login')
            setUser(null)
            return
        } else if (response.status !== 200) {
            setError(data["error"])
            return
        }

        setUserInfo(data)
    }

    useEffect(() => {
        fetchMe()
    }, [])

    return (
        <div>
            {userInfo && <>
                <div className="flex flex-col justify-center items-center pt-4 px-40">
                    {/*Profile Info*/}
                    <div
                        className="relative flex flex-col items-center rounded-xl mx-auto bg-clip-border">
                        <h5 className="flex justify-center font-montserrat font-semibold text-2xl text-gray-900 my-6">
                            Личный кабинет
                        </h5>
                        <div className="grid grid-cols-10 gap-4 px-2 w-full">
                            <div
                                className="col-span-1 flex flex-row place-items-center rounded-2xl bg-white bg-clip-border px-3 py-2 shadow-lg">
                                <svg aria-hidden="true" className="w-10 h-10 text-yellow-400" fill="currentColor"
                                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Rating star</title>
                                    <path
                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                                <p className="ml-2 font-montserrat font-bold text-gray-900">5.0</p>
                            </div>

                            <div
                                className="col-span-4 flex items-center space-x-3 rounded-2xl bg-white bg-clip-border px-3 py-2 shadow-lg">
                                <div className="flex-shrink-0">
                                    <img className="w-12 h-12 rounded-full object-cover" src={emptyAvatar}
                                         alt="empty avatar"></img>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-base font-montserrat font-semibold text-gray-900">
                                        {userInfo["name"]} {userInfo["surname"]}
                                    </p>
                                    <p className="text-sm font-montserrat font-medium text-gray-400">
                                        Аккаунт создан {moment(userInfo["created_at"]).format('DD.MM.YYYY')}
                                    </p>
                                </div>
                                <div className="grid grid-rows-2 gap-y-2">
                                    {userInfo["meta"]["is_admin"] ?
                                        <span
                                            className="inline-flex items-center bg-purple-100 text-xs font-montserrat font-medium mr-2 px-2.5 py-0.5 rounded-full">
                                    <span className="w-2 h-2 mr-1 bg-purple-500 rounded-full"></span>
                                    Администратор
                                    </span> : userInfo["meta"]["is_courier"] ?
                                            <span
                                                className="inline-flex items-center bg-yellow-100 text-xs font-montserrat font-medium mr-2 px-2.5 py-0.5 rounded-full">
                                    <span className="w-2 h-2 mr-1 bg-yellow-600 rounded-full"></span>
                                    Курьер
                                    </span> :
                                            <span
                                                className="inline-flex items-center bg-blue-100 text-xs font-montserrat font-medium mr-2 px-2.5 py-0.5 rounded-full">
                                    <span className="w-2 h-2 mr-1 bg-blue-600 rounded-full"></span>
                                    Клиент
                                    </span>
                                    }
                                    {userInfo["meta"]["is_banned"] ?
                                        <span
                                            className="inline-flex items-center bg-red-100 text-xs font-montserrat font-medium mr-2 px-2.5 py-0.5 rounded-full">
                                    <span className="w-2 h-2 mr-1 bg-red-600 rounded-full"></span>
                                     Заблокирован
                                </span> :
                                        <span
                                            className="inline-flex items-center bg-green-100 text-xs font-montserrat font-medium mr-2 px-2.5 py-0.5 rounded-full">
                                    <span className="w-2 h-2 mr-1 bg-green-600 rounded-full"></span>
                                     Доступен
                                </span>
                                    }
                                </div>
                            </div>

                            <div
                                className="col-span-3 flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-2 shadow-lg">
                                <p className="text-sm font-montserrat text-gray-600">Электронная почта</p>
                                <p className="text-base font-montserrat font-medium text-gray-900">
                                    {userInfo["email"]}
                                </p>
                            </div>

                            <div
                                className="col-span-2 flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-2 shadow-lg">
                                <p className="text-sm font-montserrat text-gray-600">Номер телефона</p>
                                <p className="text-base font-montserrat font-medium text-gray-900">
                                    {userInfo["phone_number"]}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <DeliveryClient/>
                {user["meta"]["is_courier"] &&
                    <DeliveriesCourier/>
                }
            </>
            }
            {/*<div>*/
            }
            {/*    <Link to={`/delivery/43`} state={{from: 'courier'}}>43 заказ как курьер</Link>*/
            }
            {/*</div>*/
            }
            {/*<div><Link to={`/delivery/43`}>43 заказ как клиент</Link></div>*/
            }
        </div>
    )
        ;
}

export default Profile;
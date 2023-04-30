import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {UserContext} from "../context/UserContext";
import DeliveryMap from "../components/DeliveryMap";
import {
    Chart,
    initTE,
} from "tw-elements";


function Analytics(props) {
    const [revenue, setRevenue] = useState(0)
    const [revenueDiff, setRevenueDiff] = useState(0)

    const [deliveriesToday, setDeliveriesToday] = useState(0)
    const [deliveriesTodayDiff, setDeliveriesTodayDiff] = useState(0)

    const [deliveriesCompleted, setDeliveriesCompleted] = useState(0)
    const [deliveriesCompletedDiff, setDeliveriesCompletedDiff] = useState(0)

    const [newClients, setNewClients] = useState(0)
    const [newClientsDiff, setNewClientsDiff] = useState(0)

    const [percents, setPercents] = useState([])

    const [error, setError] = useState('')
    const navigate = useNavigate()
    const [, setUser] = useContext(UserContext)
    const fetchAnalytics = async () => {
        const requestOptions = {
            method: "GET",
            credentials: 'include'
        };
        const response = await fetch(`http://localhost:8080/api/metrics/`, requestOptions)
        const data = await response.json()
        if (response.status === 401) {
            navigate('/login')
            setUser(null)
            return
        } else if (response.status !== 200) {
            setError(data["error"])
            return
        }

        // Setting revenue state
        setRevenue(data["metrics"]["revenue"]["revenue"])
        setRevenueDiff(data["metrics"]["revenue"]["revenue_diff"])

        // Setting deliveries metrics states
        setDeliveriesToday(data["metrics"]["deliveries_cnt"]["new_cnt"])
        setDeliveriesTodayDiff(data["metrics"]["deliveries_cnt"]["new_cnt_diff"])
        setDeliveriesCompleted(data["metrics"]["deliveries_cnt"]["completed_cnt"])
        setDeliveriesCompletedDiff(data["metrics"]["deliveries_cnt"]["completed_cnt_diff"])

        // Setting clients metrics
        setNewClients(data["metrics"]["new_clients_cnt"]["new_clients_cnt"])
        setNewClientsDiff(data["metrics"]["new_clients_cnt"]["new_clients_cnt_diff"])

        // Setting percents
        setPercents([
            data["metrics"]["delivery_types_percent"]["foot_percent"],
            data["metrics"]["delivery_types_percent"]["car_percent"],
            data["metrics"]["delivery_types_percent"]["minivan_percent"],
            data["metrics"]["delivery_types_percent"]["truck_percent"],
            data["metrics"]["delivery_types_percent"]["long_truck_percent"]
        ])
    }

    // TODO: move fetch method inside useEffect
    useEffect(() => {
        fetchAnalytics()
    }, [])

    useEffect(()=>{
        // initTE({Chart})
        const dataDoughnut = {
            type: 'doughnut',
            data: {
                labels: ["Пеший", "Автомобиль", "Минивэн", "Газель", "Удлинённая газель"],
                datasets: [
                    {
                        data: [percents[0], percents[1], percents[2], percents[3], percents[4]],
                        backgroundColor: [
                            'rgba(208, 0, 0, 1.0)',
                            'rgba(255, 186, 8, 1.0)',
                            'rgba(63, 136, 197, 1.0)',
                            'rgba(3, 43, 67, 1.0)',
                            'rgba(19, 111, 99, 1.0)',
                        ],
                    },
                ],
            },
        };
        console.log(dataDoughnut)
        if (dataDoughnut.data.datasets[0].data[0] !== undefined) {
            new Chart(document.getElementById('doughnut-chart'), dataDoughnut);
        }
    }, [percents])

    return (
        <div className="mt-4 grid grid-cols-10 gap-4 mx-40">
            {/*Metrics info*/}
            <div className="col-span-3 space-y-4">
                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span
                                className="text-3xl font-montserrat font-bold leading-none text-gray-900">{revenue} ₽</span>
                            <h3 className="text-base font-montserrat font-normal text-gray-500">Выручка</h3>
                        </div>
                        {revenueDiff >= 0 ?
                            <div
                                className="flex w-0 flex-1 items-center justify-end text-base font-montserrat font-bold text-green-500">
                                {revenueDiff}%
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                          d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                                          clipRule="evenodd"></path>
                                </svg>
                            </div>
                            :
                            <div
                                className="flex w-0 flex-1 items-center justify-end text-base font-montserrat font-bold text-red-500">
                                {revenueDiff}%
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                          d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"></path>
                                </svg>
                            </div>
                        }
                    </div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span
                                className="text-3xl font-montserrat font-bold leading-none text-gray-900">{deliveriesToday}</span>
                            <h3 className="text-base font-montserrat font-normal text-gray-500">Создано заказов за
                                сегодня</h3>
                        </div>
                        {deliveriesTodayDiff >= 0 ?
                            <div
                                className="flex w-0 flex-1 items-center justify-end text-base font-montserrat font-bold text-green-500">
                                {deliveriesTodayDiff}%
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                          d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                                          clipRule="evenodd"></path>
                                </svg>
                            </div>
                            :
                            <div
                                className="flex w-0 flex-1 items-center justify-end text-base font-montserrat font-bold text-red-500">
                                {deliveriesTodayDiff}%
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                          d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"></path>
                                </svg>
                            </div>
                        }

                    </div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span
                                className="text-3xl font-montserrat font-bold leading-none text-gray-900">{deliveriesCompleted}</span>
                            <h3 className="text-base font-montserrat font-normal text-gray-500">Завершено заказов за
                                сегодня</h3>
                        </div>
                        {deliveriesCompletedDiff >= 0 ?
                            <div
                                className="flex w-0 flex-1 items-center justify-end text-base font-montserrat font-bold text-green-500">
                                {deliveriesCompletedDiff}%
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                          d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                                          clipRule="evenodd"></path>
                                </svg>
                            </div>
                            :
                            <div
                                className="flex w-0 flex-1 items-center justify-end text-base font-montserrat font-bold text-red-500">
                                {deliveriesCompletedDiff}%
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                          d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"></path>
                                </svg>
                            </div>
                        }
                    </div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span
                                className="text-3xl font-montserrat font-bold leading-none text-gray-900">{newClients}</span>
                            <h3 className="text-base font-montserrat font-normal text-gray-500">Новых клиентов за
                                сегодня</h3>
                        </div>
                        {newClientsDiff >= 0 ?
                            <div
                                className="flex w-0 flex-1 items-center justify-end text-base font-montserrat font-bold text-green-500">
                                {newClientsDiff}%
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                          d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                                          clipRule="evenodd"></path>
                                </svg>
                            </div>
                            :
                            <div
                                className="flex w-0 flex-1 items-center justify-end text-base font-montserrat font-bold text-red-500">
                                {newClientsDiff}%
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                          d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"></path>
                                </svg>
                            </div>}

                    </div>
                </div>
                <div className="rounded-lg bg-white p-3 shadow">
                    <div className="flex items-center">
                        <div className="mx-auto w-4/6 overflow-hidden">
                            <canvas id="doughnut-chart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            {/*DeliveryMap*/}
            <div className="col-span-7 rounded-lg bg-white p-4 shadow">
                <DeliveryMap/>
            </div>
        </div>
    );
}

export default Analytics;
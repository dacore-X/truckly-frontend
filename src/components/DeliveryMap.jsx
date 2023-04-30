import React, {useContext, useEffect, useState} from "react";
import {load} from "@2gis/mapgl";
import icon from "../img/icon.png";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../context/UserContext";

const MapWrapper = React.memo(
    () => {
        return <div id='map-container' className="mt-4" style={{width: '810px', height: '570px'}}></div>
    },
    () => true,
);

function DeliveryMap() {
    const [deliveries, setDeliveries] = useState([]);
    const navigate = useNavigate()
    const [, setUser] = useContext(UserContext)
    const [error, setError] = useState('')

    const fetchDeliveries = async () => {
        const requestOptions = {
            method: "GET",
            credentials: 'include'
        };
        const response = await fetch(`http://localhost:8080/api/metrics/map`, requestOptions)
        const data = await response.json()
        if (response.status === 401) {
            navigate('/login')
            setUser(null)
            return
        } else if (response.status !== 200) {
            setError(data["error"])
        }
        setDeliveries(data["current_deliveries"])
    }

    useEffect(() => {

        let map
        load().then((mapglAPI) => {
            map = new mapglAPI.Map('map-container', {
                center: [37.6156, 55.7522],
                zoom: 14,
                key: '0dd12450-d7bc-4ea8-ac5a-dbde31f79dfd',
            });
            console.log(deliveries)
            deliveries.forEach(elem => {
                const marker = new mapglAPI.Marker(map, {
                    coordinates: [elem["from_object"]["longitude"], elem["from_object"]["latitude"]],
                    icon: icon
                });

                const popup = new mapglAPI.HtmlMarker(map, {
                    coordinates: [elem["from_object"]["longitude"], elem["from_object"]["latitude"]],
                    html:
                        `<div class="popup">
                <div class="popup-content">
                <div class='font-montserrat text-sm'>
            <div class='flex flex-row space-x-2'>
                <b>
                    Откуда:
                </b>
                <div>${elem["from_object"]["object"]}</div>
            </div>
            <div class='flex flex-row space-x-2'>
                <b>
                    Куда:
                </b>
                <div>${elem["to_object"]}</div>
            </div>
            <div class='flex flex-row space-x-2'>
                <b>
                    Стоимость:
                </b>
                <div>${elem["price"]}₽</div>
            </div>
        </div>

                </div>
                <div class="popup-close"></div>
            </div>`,
                });

                marker.on('click', () => (popupHtml.style.display = 'block'))
                const popupHtml = popup.getContent();

                function hidePopup() {
                    popupHtml.style.display = 'none';
                }
                hidePopup();

            // popupHtml.querySelector('.popup-close').addEventListener('click', hidePopup);
                map.on('click', hidePopup);
            });




        })

            // Удаляем карту при размонтировании компонента
            return () => map && map.destroy();
    }, [deliveries])
    return (
        <div>
            <button type="button" onClick={fetchDeliveries}
                    className="inline-flex items-center justify-center w-auto px-3 py-1 space-x-2 text-sm font-medium text-white transition bg-green-500 border border-green-700 rounded appearance-none cursor-pointer select-none hover:border-blue-800 hover:bg-green-800 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
                </svg>
                <span className="font-montserrat">Обновить</span>
            </button>
            <MapWrapper/>
        </div>
    )
}

export default DeliveryMap;
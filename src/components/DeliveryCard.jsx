import React from 'react';
import {deliveryColors, deliveryStatuses, deliveryTypes} from "../pages/DeliveryInfo";
import moment from "moment/moment";

function DeliveryCard({delivery}) {
    return (
        <div
            className="mx-auto rounded-lg text-gray-700 bg-white mb-3.5 h-30 w-full hover:bg-gray-100 focus:outline-none focus-visible:bg-white shadow-lg">
            <div className={`flex p-3 border-l-8 ${deliveryColors[delivery["status_id"]]["border"]} rounded-l-lg`}>
                <div className="space-y-1 border-r-2 pr-3">
                    <div className="text-left text-sm leading-5 font-montserrat font-semibold"><span
                        className="text-xs leading-4 font-normal text-gray-500"> Заказ №</span> {delivery["id"]}
                    </div>
                    <div className="text-left text-sm leading-5 font-montserrat font-semibold"><span
                        className="text-xs leading-4 font-normal text-gray-500 pr"> Цена </span> {delivery["price"]} ₽
                    </div>
                    <div className="text-left text-sm leading-5 font-montserrat font-semibold">
                        {moment(delivery["time"]).format('HH:MM DD.MM.YYYY')}
                    </div>
                </div>
                <div className="flex-1 border-r-2 pr-3">
                    <div className="ml-3 space-y-1">
                        <div className="text-left text-sm leading-4 font-montserrat font-semibold"><span
                            className="text-xs leading-4 font-normal text-gray-500"> Пункт отправки</span> {delivery["from_object"]}
                        </div>
                        <div className="text-left text-sm leading-4 font-montserrat font-semibold"><span
                            className="text-xs leading-4 font-normal text-gray-500"> Пункт получения</span> {delivery["to_object"]}
                        </div>
                    </div>
                </div>
                <div className="border-r-2 pr-3">
                    <div>
                        <div className="ml-3 my-3 p-1 w-48">
                            <div
                                className="text-center uppercase text-xs leading-4 font-montserrat font-medium">{deliveryTypes[delivery["type_id"]]}
                            </div>
                            <div
                                className="text-center text-sm leading-4 font-montserrat font-semibold text-gray-900">
                                {delivery["has_loader"] ? "Требуется грузчик" : "Без грузчика"}
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={`ml-3 my-5 ${deliveryColors[delivery["status_id"]]["bg"]} p-1 w-28 rounded-lg`}>
                        <div
                            className={`uppercase text-xs leading-4 font-montserrat font-semibold text-center ${deliveryColors[delivery["status_id"]]["text"]}`}>
                            {deliveryStatuses[delivery["status_id"]]}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeliveryCard;
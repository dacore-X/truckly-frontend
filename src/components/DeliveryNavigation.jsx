import React, {useEffect} from 'react';
import {load} from "@2gis/mapgl";
import {Directions} from '@2gis/mapgl-directions';

const MapWrapper = React.memo(
    () => {
        return <div id='map-container' className="" style={{width: '570px', height: '500px'}}></div>
    },
    () => true,
);

function DeliveryNavigation({delivery}) {
    console.log(delivery)
    useEffect(() => {
        let map
        load().then((mapglAPI) => {
            const centerLon = ((delivery["from_object"]["longitude"] + delivery["to_object"]["longitude"]) / 2).toFixed(5)
            const centerLat = ((delivery["from_object"]["latitude"] + delivery["to_object"]["latitude"]) / 2).toFixed(5)
            let zoom
            if (delivery["distance"] > 20000){
                zoom = 11
            } else if (delivery["distance"] > 5000) {
                zoom = 13
            } else {
                zoom = 14
            }
            map = new mapglAPI.Map('map-container', {
                center: [centerLon, centerLat],
                zoom: zoom,
                key: '0dd12450-d7bc-4ea8-ac5a-dbde31f79dfd',
            });

            const directions = new Directions(map, {
                directionsApiKey: '0dd12450-d7bc-4ea8-ac5a-dbde31f79dfd',

            });
            const from_point = [delivery["from_object"]["longitude"], delivery["from_object"]["latitude"]]
            const to_point = [delivery["to_object"]["longitude"], delivery["to_object"]["latitude"]]
            directions.carRoute({
                points: [from_point, to_point],
            });
        });

        // Удаляем карту при размонтировании компонента
        return () => {
            // directions && directions.clear();
            map && map.destroy();
        }
    })

    return (
        <div>
            <MapWrapper/>
        </div>
    );
}


export default DeliveryNavigation;
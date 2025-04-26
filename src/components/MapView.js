import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Style from '../style/Style';
import { getCurrentPosition } from '../utils/location';
import { fetchDirections } from '../utils/places';

/**
 * MapView Component
 * Displays a map with the user's current location
 * @param {Object} props - Component props
 * @param {Object} props.style - Additional styles for the container
 * @param {Function} props.onLocationChange - Callback when location changes
 * @param {Array} props.markers - Array of markers to display on the map
 */
const MapViewComponent = ({ 
    userLocation, 
    nearbyPlaces, 
    selectedPlace,
    onPlaceSelect 
}) => {
    const [region, setRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [route, setRoute] = useState(null);

    useEffect(() => {
        getCurrentLocation();
        if (selectedPlace && userLocation) {
            fetchDirections(userLocation, selectedPlace.location)
                .then(routeData => {
                    if (routeData) {
                        setRoute(routeData);
                    }
                });
        } else {
            setRoute(null);
        }
    }, [selectedPlace, userLocation]);

    const getCurrentLocation = async () => {
        try {
            const position = await getCurrentPosition();
            const newRegion = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.01, // Zoomed in more than default
                longitudeDelta: 0.01,
            };
            setRegion(newRegion);
        } catch (error) {
            console.error('Error getting location:', error);
        }
    };

    const getMarkerColor = (types) => {
        if (types.includes('hospital')) return '#FF0000';
        if (types.includes('police')) return '#0000FF';
        if (types.includes('fire_station')) return '#FFA500';
        if (types.includes('bus_station')) return '#008000';
        return '#000000';
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: userLocation?.latitude || 0,
                    longitude: userLocation?.longitude || 0,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation
                showsMyLocationButton
            >
                {userLocation && (
                    <Marker
                        coordinate={{
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
                        }}
                        title="You are here"
                        pinColor="blue"
                    />
                )}

                {nearbyPlaces?.hospitals?.map((hospital, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: hospital.location.latitude,
                            longitude: hospital.location.longitude,
                        }}
                        title={hospital.name}
                        description={`${hospital.distance} away`}
                        onPress={() => onPlaceSelect(hospital)}
                    />
                ))}

                {route && (
                    <Polyline
                        coordinates={decodePolyline(route.points)}
                        strokeWidth={3}
                        strokeColor="#2196F3"
                    />
                )}
            </MapView>
        </View>
    );
};

// Helper function to decode Google's polyline format
const decodePolyline = (encoded) => {
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;
    const coordinates = [];

    while (index < len) {
        let shift = 0;
        let result = 0;
        let byte;

        do {
            byte = encoded.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += dlat;

        shift = 0;
        result = 0;

        do {
            byte = encoded.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += dlng;

        coordinates.push({
            latitude: lat * 1e-5,
            longitude: lng * 1e-5,
        });
    }

    return coordinates;
};

const styles = StyleSheet.create({
    container: {
        height: 300,
        borderRadius: 10,
        overflow: 'hidden',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default MapViewComponent; 
const GOOGLE_MAPS_API_KEY = 'AIzaSyDWptdKEfofkAbIBS2NBFch1dU8lDOb-Iw'

// Function to calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    return distance.toFixed(1) // Return distance in kilometers with 1 decimal place
}

export const fetchNearbyPlaces = async (latitude, longitude, radius = 5000) => {
    try {
        // Fetch hospitals
        const hospitalResponse = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=hospital&key=${GOOGLE_MAPS_API_KEY}`
        )
        const hospitalData = await hospitalResponse.json()

        // Fetch police stations
        const policeResponse = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=police&key=${GOOGLE_MAPS_API_KEY}`
        )
        const policeData = await policeResponse.json()

        // Fetch fire stations
        const fireResponse = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=fire_station&key=${GOOGLE_MAPS_API_KEY}`
        )
        const fireData = await fireResponse.json()

        // Fetch bus stations
        const busResponse = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=bus_station&key=${GOOGLE_MAPS_API_KEY}`
        )
        const busData = await busResponse.json()

        // Process and combine all results
        const processResults = (data) => {
            if (data.status === 'OK') {
                return data.results
                    .map((place) => {
                        const placeLat = place.geometry.location.lat
                        const placeLng = place.geometry.location.lng
                        const distance = calculateDistance(
                            latitude,
                            longitude,
                            placeLat,
                            placeLng
                        )

                        return {
                            id: place.place_id,
                            name: place.name,
                            vicinity: place.vicinity,
                            location: {
                                latitude: placeLat,
                                longitude: placeLng,
                            },
                            rating: place.rating,
                            types: place.types,
                            icon: place.icon,
                            image: place.photos?.[0]?.photo_reference
                                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
                                : null,
                            distance: parseFloat(distance), // Store as number for sorting
                            distanceText: `${distance} km`, // Keep formatted string for display
                        }
                    })
                    .sort((a, b) => a.distance - b.distance) // Sort by distance
            }
            return []
        }

        return {
            hospitals: processResults(hospitalData),
            policeStations: processResults(policeData),
            fireStations: processResults(fireData),
            busStations: processResults(busData),
        }
    } catch (error) {
        console.error('Error fetching nearby places:', error)
        return {
            hospitals: [],
            policeStations: [],
            fireStations: [],
            busStations: [],
        }
    }
}

export const fetchDirections = async (origin, destination) => {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`
        )
        const data = await response.json()

        if (data.status === 'OK') {
            const route = data.routes[0]
            const points = route.overview_polyline.points
            return {
                distance: route.legs[0].distance.text,
                duration: route.legs[0].duration.text,
                points: points,
            }
        }
        return null
    } catch (error) {
        console.error('Error fetching directions:', error)
        return null
    }
}

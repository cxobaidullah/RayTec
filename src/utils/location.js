import Geolocation from '@react-native-community/geolocation'

/**
 * Get current position of the user
 * @returns {Promise<Object>} Promise that resolves to the position object
 */
export const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            (position) => resolve(position),
            (error) => reject(error),
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000,
            }
        )
    })
}

/**
 * Sample nearby locations data
 * This would typically come from an API in a real application
 */
export const nearbyLocations = {
    hospitals: [
        {
            id: 1,
            name: 'City General Hospital',
            distance: '2.5 km',
            image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500',
        },
        {
            id: 2,
            name: 'St. Mary Medical Center',
            distance: '3.1 km',
            image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500',
        },
    ],
    policeStations: [
        {
            id: 1,
            name: 'Central Police Station',
            distance: '1.8 km',
            image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500',
        },
        {
            id: 2,
            name: 'North District Police',
            distance: '2.3 km',
            image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500',
        },
    ],
    busStations: [
        {
            id: 1,
            name: 'Central Bus Terminal',
            distance: '1.2 km',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500',
        },
        {
            id: 2,
            name: 'North Bus Station',
            distance: '2.7 km',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500',
        },
    ],
}

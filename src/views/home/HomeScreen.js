import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    Linking,
    ActivityIndicator,
    Alert,
} from 'react-native';
import Style from '../../style/Style';
import MapViewComponent from '../../components/MapView';
import EmergencyButton from '../../components/EmergencyButton';
import { getCurrentPosition } from '../../utils/location';
import { fetchNearbyPlaces } from '../../utils/places';
import Spacing from '../../components/Spacing';
import LocationPermission from '../../components/LocationPermission';
import { useSelector } from 'react-redux';

/**
 * LocationCard Component
 * Displays a location card with image and details
 */
const LocationCard = ({ item, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardDistance}>{item.distanceText}</Text>
        </View>
    </TouchableOpacity>
);

/**
 * LocationSection Component
 * Displays a section of nearby locations
 */
const LocationSection = ({ title, data, onLocationSelect }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <FlatList
            data={data}
            renderItem={({ item }) => (
                <LocationCard 
                    item={item} 
                    onPress={onLocationSelect}
                />
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
        
        />
    </View>
);

export default HomeScreen = () => {
    const scrollViewRef = useRef(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [nearbyPlaces, setNearbyPlaces] = useState({
        hospitals: [],
        policeStations: [],
        fireStations: [],
        busStations: []
    });

    const user = useSelector((state) => state?.user?.user);
    console.log('user--->', JSON.stringify(user, null, 2))
    const [emergencyContact, setEmergencyContact] = useState(user?.emergencyPhone);

    useEffect(() => {
        if (hasPermission) {
            fetchLocation();
        }
    }, [hasPermission]);

    useEffect(() => {
        if (user?.emergencyContact) {
            setEmergencyContact(user?.emergencyPhone);
        }
    }, [user]);

    const fetchLocation = async () => {
        try {
            setLoading(true);
            const position = await getCurrentPosition();
            setCurrentLocation(position.coords);
            
            const places = await fetchNearbyPlaces(
                position.coords.latitude,
                position.coords.longitude
            );
            
            setNearbyPlaces(places);
        } catch (error) {
            Alert.alert('Error fetching location or places:', error);
            console.error('Error fetching location or places:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePermissionGranted = () => {
        setHasPermission(true);
    };

    const handleEmergencyCall = () => {
        if (emergencyContact) {
            Alert.alert(
                "Emergency Contact",
                `Do you want to call ${emergencyContact}?`,
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Call",
                        onPress: () => Linking.openURL(`tel:${emergencyContact}`)
                    }
                ]
            );
        } else {
            Alert.alert(
                "No Emergency Contact",
                "Please set up an emergency contact in your profile settings.",
                [{ text: "OK" }]
            );
        }
    };

    const handleLocationSelect = (place) => {
        setSelectedPlace(place);
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    if (!hasPermission) {
        return <LocationPermission onPermissionGranted={handlePermissionGranted} />;
    }

    if (loading) {
        return (
            <View style={[Style.container, styles.centerContent]}>
                <ActivityIndicator size="large" color={Style.colorPrimary.color} />
            </View>
        );
    }

    return (
        <View style={[Style.container, styles.container]}>
            <ScrollView 
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>Welcome to Safety App</Text>
                    {currentLocation && (
                        <Text style={styles.locationText}>
                            Your Location: {currentLocation?.latitude?.toFixed(4)}, {currentLocation?.longitude?.toFixed(4)}
                        </Text>
                    )}
                </View>

                <EmergencyButton onPress={handleEmergencyCall} />

                {nearbyPlaces.hospitals.length > 0 && (
                    <LocationSection
                        title="Nearby Hospitals"
                        data={nearbyPlaces.hospitals}
                        onLocationSelect={handleLocationSelect}
                    />
                )}

                {nearbyPlaces.policeStations.length > 0 && (
                    <LocationSection
                        title="Nearby Police Stations"
                        data={nearbyPlaces.policeStations}
                        onLocationSelect={handleLocationSelect}
                    />
                )}

                {nearbyPlaces.fireStations.length > 0 && (
                    <LocationSection
                        title="Nearby Fire Stations"
                        data={nearbyPlaces.fireStations}
                        onLocationSelect={handleLocationSelect}
                    />
                )}

                {nearbyPlaces.busStations.length > 0 && (
                    <LocationSection
                        title="Nearby Bus Stations"
                        data={nearbyPlaces.busStations}
                        onLocationSelect={handleLocationSelect}
                    />
                )}

                <Spacing val={20} />
                <Text style={styles.mapTitle}>Your Location on Map</Text>
                <View style={styles.mapContainer}>
                    <MapViewComponent 
                        userLocation={currentLocation}
                        nearbyPlaces={nearbyPlaces}
                        selectedPlace={selectedPlace}
                        onPlaceSelect={handleLocationSelect}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    header: {
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Style.colorPrimary.color,
    },
    locationText: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    card: {
        width: 200,
        marginRight: 12,
        borderRadius: 12,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 4,
    },
    cardImage: {
        width: '100%',
        height: 120,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    cardContent: {
        padding: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardDistance: {
        fontSize: 14,
        color: '#666',
    },
    mapTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapContainer: {
        height: 400,
        marginBottom: 20,
    },
});

// HeaderComponent.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HeaderComponent = ({ title, onFilterPress }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>{title}</Text>
      <TouchableOpacity
        onPress={onFilterPress}
        style={styles.filterButton}
      >
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#4c669f',
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection:'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
    },
    listContent: {
        paddingBottom: 20,
    },
    filterButton: {
        backgroundColor: Color.white,
        padding: 8,
        borderRadius: 5,
    },
    filterButtonText: {
        color: '#4c669f',
        fontWeight: '600',
    },
});

export default HeaderComponent;

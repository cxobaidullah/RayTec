import {
    getDatabase,
    push,
    ref,
    set,
    get,
    child,
    update,
    remove,
} from '@react-native-firebase/database'

export const addDataToDb = async (path, data) => {
    try {
        const db = getDatabase()
        const dbRef = ref(db, path)
        const newRef = push(dbRef) // Generate a new reference with a unique ID
        await set(newRef, data)
        return { success: true, key: newRef.key }
    } catch (error) {
        console.error('Error adding data to Firebase:', error)
        throw new Error('Failed to add data to Firebase')
    }
}
export const getDataFromDb = async (path) => {
    try {
        const db = getDatabase()
        const dbRef = ref(db)
        const snapshot = await get(child(dbRef, path))
        if (snapshot.exists()) {
            return snapshot.val() // Returns the data as a JavaScript object
        } else {
            console.log('No data available at the path:', path)
            return null
        }
    } catch (error) {
        console.error('Error fetching data from Firebase:', error)
        throw new Error('Failed to fetch data from Firebase')
    }
}
export const getDataById = async (path, id) => {
    try {
        const db = getDatabase()
        const dbRef = ref(db, `${path}/${id}`) // Create a reference using the path and ID
        const snapshot = await get(dbRef) // Get the data

        if (snapshot.exists()) {
            return snapshot.val() // Return the data
        } else {
            console.log('No data available for the specified ID')
            return null // Return null if no data exists
        }
    } catch (error) {
        console.error('Error getting data from Firebase:', error)
        throw new Error('Failed to get data from Firebase')
    }
}
export const updateDataInDb = async (path, id, newData) => {
    try {
        const db = getDatabase()
        const dbRef = ref(db, `${path}/${id}`) // Create a reference using the path and ID
        await update(dbRef, newData) // Update the data
        return { success: true }
    } catch (error) {
        console.error('Error updating data in Firebase:', error)
        throw new Error('Failed to update data in Firebase')
    }
}
export const deleteDataFromDb = async (path, id) => {
    try {
        const db = getDatabase()
        const dbRef = ref(db, `${path}/${id}`) // Create a reference using the path and ID
        await remove(dbRef) // Delete the data
        return { success: true }
    } catch (error) {
        console.error('Error deleting data from Firebase:', error)
        throw new Error('Failed to delete data from Firebase')
    }
}

export const storeUserData = async (userId, userData) => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`); // Reference for the user path
      await set(userRef, userData);
      console.log('User data stored successfully.');
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

/**
 * Campus Calories v2.0 - Database Module
 * IndexedDB operations for offline data persistence
 */

const DB_NAME = 'CampusCaloriesDB';
const DB_VERSION = 3;

const STORES = {
  USER_PROFILE: 'userProfile',
  FOOD_LOG: 'foodLog',
  PACKAGED_CACHE: 'packagedCache',
  SETTINGS: 'settings',
  SYNC_QUEUE: 'syncQueue'
};

let db = null;

// Initialize Database
async function initDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      console.log('Database initialized');
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      
      // User Profile Store
      if (!database.objectStoreNames.contains(STORES.USER_PROFILE)) {
        database.createObjectStore(STORES.USER_PROFILE, { keyPath: 'id' });
      }
      
      // Food Log Store with date index
      if (!database.objectStoreNames.contains(STORES.FOOD_LOG)) {
        const foodLogStore = database.createObjectStore(STORES.FOOD_LOG, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        foodLogStore.createIndex('date', 'date', { unique: false });
        foodLogStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
      
      // Packaged Food Cache
      if (!database.objectStoreNames.contains(STORES.PACKAGED_CACHE)) {
        const cacheStore = database.createObjectStore(STORES.PACKAGED_CACHE, { 
          keyPath: 'barcode' 
        });
        cacheStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
      
      // Settings Store
      if (!database.objectStoreNames.contains(STORES.SETTINGS)) {
        database.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }

      // Sync Queue Store
      if (!database.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        database.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// Sync Operations
async function addToSyncQueue(action, payload) {
  if (!db) return;
  return await putInStore(STORES.SYNC_QUEUE, {
    action,
    payload,
    timestamp: new Date().toISOString()
  });
}

async function getSyncQueue() {
  if (!db) return [];
  return await getAllFromStore(STORES.SYNC_QUEUE);
}

async function removeFromSyncQueue(id) {
  if (!db) return;
  return await deleteFromStore(STORES.SYNC_QUEUE, id);
}

// Generic CRUD Operations
async function getFromStore(storeName, key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function putInStore(storeName, data) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function deleteFromStore(storeName, key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function getAllFromStore(storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// User Profile Operations
async function getUserProfile() {
  return await getFromStore(STORES.USER_PROFILE, 'current');
}

async function saveUserProfile(profile) {
  profile.id = 'current';
  profile.updatedAt = new Date().toISOString();
  await putInStore(STORES.USER_PROFILE, profile);

  if (navigator.onLine && typeof syncProfileToCloud === 'function') {
    syncProfileToCloud(profile).catch(() => {
      addToSyncQueue('UPDATE_PROFILE', profile).catch(() => {});
    });
  } else {
    addToSyncQueue('UPDATE_PROFILE', profile).catch(() => {});
  }
}

// Food Log Operations
async function addFoodEntry(entry) {
  entry.timestamp = new Date().toISOString();
  const id = await putInStore(STORES.FOOD_LOG, entry);

  if (navigator.onLine && typeof syncFoodEntryToCloud === 'function') {
    syncFoodEntryToCloud(entry).catch(() => {
      addToSyncQueue('ADD_FOOD', entry).catch(() => {});
    });
  } else {
    addToSyncQueue('ADD_FOOD', entry).catch(() => {});
  }

  return id;
}

async function getFoodEntriesByDate(date) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.FOOD_LOG], 'readonly');
    const store = transaction.objectStore(STORES.FOOD_LOG);
    const index = store.index('date');
    const request = index.getAll(date);
    
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

async function updateFoodEntry(id, updates) {
  const entry = await getFromStore(STORES.FOOD_LOG, id);
  if (entry) {
    Object.assign(entry, updates);
    entry.updatedAt = new Date().toISOString();
    await putInStore(STORES.FOOD_LOG, entry);
  }
}

async function deleteFoodEntry(id) {
  await deleteFromStore(STORES.FOOD_LOG, id);
}

async function getFoodLogStats(date) {
  const entries = await getFoodEntriesByDate(date);
  return entries.reduce((stats, entry) => {
    stats.calories += entry.calories || 0;
    stats.protein += entry.protein || 0;
    stats.carbs += entry.carbs || 0;
    stats.fat += entry.fat || 0;
    return stats;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0, count: entries.length });
}

// Packaged Food Cache Operations
async function cachePackagedProduct(product) {
  product.timestamp = new Date().toISOString();
  await putInStore(STORES.PACKAGED_CACHE, product);
}

async function getCachedProduct(barcode) {
  const product = await getFromStore(STORES.PACKAGED_CACHE, barcode);
  if (product) {
    // Check if cache is older than 30 days
    const cacheAge = Date.now() - new Date(product.timestamp).getTime();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    if (cacheAge > thirtyDays) {
      await deleteFromStore(STORES.PACKAGED_CACHE, barcode);
      return null;
    }
  }
  return product;
}

async function searchCachedProducts(query) {
  const allProducts = await getAllFromStore(STORES.PACKAGED_CACHE);
  const lowerQuery = query.toLowerCase();
  return allProducts.filter(p => 
    p.name?.toLowerCase().includes(lowerQuery) ||
    p.brand?.toLowerCase().includes(lowerQuery)
  ).slice(0, 10);
}

// Settings Operations
async function getSetting(key, defaultValue = null) {
  const setting = await getFromStore(STORES.SETTINGS, key);
  return setting ? setting.value : defaultValue;
}

async function setSetting(key, value) {
  await putInStore(STORES.SETTINGS, { key, value });
}

// Onboarding Check
async function hasCompletedOnboarding() {
  const profile = await getUserProfile();
  return profile && profile.onboardingCompleted;
}

async function completeOnboarding() {
  const profile = await getUserProfile() || {};
  profile.onboardingCompleted = true;
  profile.onboardingCompletedAt = new Date().toISOString();
  await saveUserProfile(profile);
}

// Export/Import Data
async function exportAllData() {
  const data = {
    version: DB_VERSION,
    exportedAt: new Date().toISOString(),
    userProfile: await getUserProfile(),
    foodLog: await getAllFromStore(STORES.FOOD_LOG),
    settings: await getAllFromStore(STORES.SETTINGS)
  };
  return JSON.stringify(data, null, 2);
}

async function importData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    
    // Import user profile
    if (data.userProfile) {
      await saveUserProfile(data.userProfile);
    }
    
    // Import food log
    if (data.foodLog && Array.isArray(data.foodLog)) {
      for (const entry of data.foodLog) {
        // Remove auto-generated id to let IndexedDB assign new one
        delete entry.id;
        await addFoodEntry(entry);
      }
    }
    
    // Import settings
    if (data.settings && Array.isArray(data.settings)) {
      for (const setting of data.settings) {
        await setSetting(setting.key, setting.value);
      }
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Clear all data (for logout/reset)
async function clearAllData() {
  const stores = Object.values(STORES);
  for (const storeName of stores) {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    await store.clear();
  }
}

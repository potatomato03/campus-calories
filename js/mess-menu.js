/**
 * Campus Calories v2.0 - Mess Menu Data
 * Complete 7-day menu with L1-L4 section categorization
 */

const MESS_MENU = {
  monday: {
    breakfast: [
      { name: 'Uttapam', section: 'L4', type: 'unit', bread_key: 'uttapam', default: 1 },
      { name: 'Gobi Paratha', section: 'L4', type: 'unit', bread_key: 'paratha_aloo', default: 1 },
      { name: 'Bread Jam', section: 'L3', type: 'unit', bread_key: 'bread_jam', default: 2 },
      { name: 'Chutney', section: 'L3', type: 'gram', category: 'coconut_chutney' },
      { name: 'Curd', section: 'L2', type: 'gram', category: 'curd_buffalo' },
      { name: 'Milk', section: 'L3', type: 'ml', category: 'milk_buffalo', default: 200 },
      { name: 'Tea', section: 'L3', type: 'fixed', category: 'tea' },
      { name: 'Coffee', section: 'L3', type: 'fixed', category: 'coffee' }
    ],
    lunch: [
      { name: 'Cabbage Green Peas Dry', section: 'L1', type: 'gram', category: 'cabbage_peas' },
      { name: 'Black Chana Masala', section: 'L1', type: 'gram', category: 'chole' },
      { name: 'Chapati', section: 'L4', type: 'unit', bread_key: 'chapati', default: 2 },
      { name: 'Rice', section: 'L4', type: 'gram', category: 'rice_plain' },
      { name: 'Papad', section: 'L3', type: 'unit', bread_key: 'papad', default: 1 },
      { name: 'Sambar', section: 'L2', type: 'gram', category: 'sambar' },
      { name: 'Curd', section: 'L2', type: 'gram', category: 'curd_buffalo' },
      { name: 'Salad', section: 'L1', type: 'gram', category: 'salad' }
    ],
    snacks: [
      { name: 'Papadi Chat', section: 'L4', type: 'fixed', category: 'papadi_chat' },
      { name: 'Banana', section: 'L3', type: 'fixed', category: 'banana' },
      { name: 'Curd', section: 'L2', type: 'gram', category: 'curd_buffalo' },
      { name: 'Salad', section: 'L1', type: 'gram', category: 'salad' },
      { name: 'Tea', section: 'L3', type: 'fixed', category: 'tea' }
    ],
    dinner: [
      { name: 'Egg Curry', section: 'L1', type: 'gram', category: 'egg_curry' },
      { name: 'Dal', section: 'L2', type: 'gram', category: 'toor_dal' },
      { name: 'Methi Malai Matar', section: 'L1', type: 'gram', category: 'methi_malai_matar' },
      { name: 'Roti', section: 'L4', type: 'unit', bread_key: 'chapati', default: 2 },
      { name: 'Rice', section: 'L4', type: 'gram', category: 'rice_plain' },
      { name: 'Curd', section: 'L2', type: 'gram', category: 'curd_buffalo' },
      { name: 'Kheer', section: 'L3', type: 'gram', category: 'kheer' }
    ]
  },
  
  tuesday: {
    breakfast: [
      { name: 'Rawa Idli', section: 'L4', type: 'unit', bread_key: 'idli_rawa', default: 2 },
      { name: 'Poha', section: 'L4', type: 'gram', category: 'poha' },
      { name: 'Chutney', section: 'L3', type: 'gram', category: 'coconut_chutney' },
      { name: 'Sambar', section: 'L3', type: 'gram', category: 'sambar' },
      { name: 'Sprouts', section: 'L1', type: 'gram', category: 'sprouts' },
      { name: 'Bread Butter', section: 'L3', type: 'unit', bread_key: 'bread_butter', default: 2 },
      { name: 'Tea', section: 'L3', type: 'fixed', category: 'tea' },
      { name: 'Coffee', section: 'L3', type: 'fixed', category: 'coffee' }
    ],
    lunch: [
      { name: 'Veg Handi', section: 'L1', type: 'gram', category: 'veg_handi' },
      { name: 'Bhindi Kurkure', section: 'L1', type: 'gram', category: 'bhindi_kurkure' },
      { name: 'Tomato Dal', section: 'L2', type: 'gram', category: 'toor_dal' },
      { name: 'Chapati', section: 'L4', type: 'unit', bread_key: 'chapati', default: 2 },
      { name: 'Rice', section: 'L4', type: 'gram', category: 'rice_plain' },
      { name: 'Curd', section: 'L2', type: 'gram', category: 'curd_buffalo' },
      { name: 'Black Chana Salad', section: 'L1', type: 'gram', category: 'chana_salad' },
      { name: 'Pickle', section: 'L3', type: 'gram', category: 'pickle' }
    ],
    snacks: [
      { name: 'Samosa', section: 'L4', type: 'unit', bread_key: 'samosa', default: 1 },
      { name: 'Rusk', section: 'L3', type: 'fixed', category: 'rusk' },
      { name: 'Tea', section: 'L3', type: 'fixed', category: 'tea' }
    ],
    dinner: [
      { name: 'Veg Kofta Curry', section: 'L1', type: 'gram', category: 'veg_kofta' },
      { name: 'Amritsari Paratha', section: 'L4', type: 'unit', bread_key: 'paratha_amritsari', default: 1 },
      { name: 'Dal Makhani', section: 'L2', type: 'gram', category: 'dal_makhani' },
      { name: 'Roti', section: 'L4', type: 'unit', bread_key: 'chapati', default: 2 },
      { name: 'Rice', section: 'L4', type: 'gram', category: 'rice_plain' },
      { name: 'Gulab Jamoon', section: 'L3', type: 'fixed', category: 'gulab_jamun' },
      { name: 'Rasam', section: 'L2', type: 'gram', category: 'rasam' }
    ]
  },
  
  wednesday: {
    breakfast: [
      { name: 'Mysore Bonda', section: 'L4', type: 'unit', bread_key: 'bonda', default: 2 },
      { name: 'Masala Dosa', section: 'L4', type: 'unit', bread_key: 'dosa_masala', default: 1 },
      { name: 'Boiled Egg', section: 'L4', type: 'fixed', category: 'boiled_egg' },
      { name: 'Sambar', section: 'L3', type: 'gram', category: 'sambar' },
      { name: 'Chutney', section: 'L3', type: 'gram', category: 'coconut_chutney' },
      { name: 'Milk', section: 'L3', type: 'ml', category: 'milk_buffalo', default: 200 },
      { name: 'Tea', section: 'L3', type: 'fixed', category: 'tea' }
    ],
    lunch: [
      { name: 'Cluster Beans Dry', section: 'L1', type: 'gram', category: 'cluster_beans' },
      { name: 'Aloo Matar Gravy', section: 'L1', type: 'gram', category: 'aloo_matar_gravy' },
      { name: 'Dal Fry', section: 'L2', type: 'gram', category: 'toor_dal_fry' },
      { name: 'Chapati', section: 'L4', type: 'unit', bread_key: 'chapati', default: 2 },
      { name: 'Tamarind Rice', section: 'L4', type: 'gram', category: 'rice_tamarind' },
      { name: 'Curd', section: 'L2', type: 'gram', category: 'curd_buffalo' },
      { name: 'Salad', section: 'L1', type: 'gram', category: 'salad' },
      { name: 'Papad', section: 'L3', type: 'unit', bread_key: 'papad', default: 1 }
    ],
    snacks: [
      { name: 'White Pasta', section: 'L4', type: 'fixed', category: 'white_pasta' },
      { name: 'Parle G', section: 'L3', type: 'fixed', category: 'parle_g' },
      { name: 'Tea', section: 'L3', type: 'fixed', category: 'tea' },
      { name: 'Milk', section: 'L3', type: 'ml', category: 'milk_buffalo', default: 200 }
    ],
    dinner: [
      { name: 'Veg Pulao', section: 'L4', type: 'gram', category: 'rice_pulao' },
      { name: 'Dal Fry', section: 'L2', type: 'gram', category: 'toor_dal_fry' },
      { name: 'Roti', section: 'L4', type: 'unit', bread_key: 'chapati', default: 2 },
      { name: 'Paneer Curry', section: 'L1', type: 'gram', category: 'paneer_curry' },
      { name: 'Boondi Raita', section: 'L2', type: 'gram', category: 'raita' },
      { name: 'Peda', section: 'L3', type: 'fixed', category: 'peda' },
      { name: 'Pickle', section: 'L3', type: 'gram', category: 'pickle' }
    ]
  },
  
  thursday: {
    breakfast: [
      { name: 'Puri Bhaji', section: 'L4', type: 'unit', bread_key: 'poori', default: 3 },
      { name: 'Peanut Chutney', section: 'L3', type: 'gram', category: 'peanut_chutney' },
      { name: 'Pongal', section: 'L4', type: 'unit', bread_key: 'pongal', default: 1 },
      { name: 'Pancakes', section: 'L4', type: 'fixed', calories: 180, protein: 4, carbs: 28, fat: 5 },
      { name: 'Bread Jam', section: 'L3', type: 'unit', bread_key: 'bread_jam', default: 2 },
      { name: 'Tea', section: 'L3', type: 'fixed', category: 'tea' },
      { name: 'Coffee', section: 'L3', type: 'fixed', category: 'coffee' }
    ],
    lunch: [
      { name: 'Soya Keema Masala', section: 'L1', type: 'gram', category: 'soya_keema' },
      { name: 'Tori Sabji', section: 'L1', type: 'gram', category: 'tori_sabji' },
      { name: 'Dal Makhani', section: 'L2', type: 'gram', category: 'dal_makhani' },
      { name: 'Chapati', section: 'L4', type: 'unit', bread_key: 'chapati', default: 2 },
      { name: 'Rice', section: 'L4', type: 'gram', category: 'rice_plain' },
      { name: 'Sambar', section: 'L2', type: 'gram', category: 'sambar' },
      { name: 'Curd', section: 'L2', type: 'gram', category: 'curd_buffalo' },
      { name: 'Salad', section: 'L1', type: 'gram', category: 'salad' }
    ],
    snacks: [
      { name: 'Pani Puri', section: 'L4', type: 'fixed', category: 'pani_puri' },
      { name: 'Tea', section: 'L3', type: 'fixed', category: 'tea' },
      { name: 'Cut Fruit', section: 'L3', type: 'fixed', category: 'cut_fruit' }
    ],
    dinner: [
      { name: 'Ghee Karam Dosa', section: 'L4', type: 'unit', bread_key: 'dosa_plain', default: 1 },
      { name: 'Paneer Paratha', section: 'L4', type: 'unit', bread_key: 'paratha_paneer', default: 1 },
      { name: 'Navaratna Dal', section: 'L2', type: 'gram', category: 'mixed_dal' },
      { name: 'Hara Bhara Kabab', section: 'L1', type: 'fixed', category: 'hara_bhara_kabab' },
      { name: 'Rice', section: 'L4', type: 'gram', category: 'rice_plain' },
      { name: 'Amarkhand', section: 'L3', type: 'fixed', category: 'amarkhand' },
      { name: 'Rasam', section: 'L2', type: 'gram', category: 'rasam' }
    ]
  },
  
  friday: {
    breakfast: [
      { name: 'Vada', section: 'L4', type: 'unit', bread_key: 'vada', default: 2 },
      { name: 'Sambar', section: 'L3', type: 'gram', category: 'sambar' },
      { name: 'Besan Chilla', section: 'L4', type: 'unit', bread_key: 'chilla', default: 1 },
      { name: 'Green Chutney', section: 'L3', type: 'gram', category: 'green_chutney' },
      { name: 'Peanuts', section: 'L3', type: 'fixed', category: 'peanuts' },
      { name: 'Chocos', section: 'L3', type: 'fixed', category: 'chocos' },
      { name: 'Milk', section: 'L3', type: 'ml', category: 'milk_buffalo', default: 200 },
      { name: 'Tea', section: 'L3', type: 'fixed', category: 'tea' }
    ],
    lunch: [
      { name: 'Methi Poori', section: 'L4', type: 'unit', bread_key: 'poori_methi', default: 3 },
      { name: 'Chole', section: 'L1', type: 'gram', category: 'chole' },
      { name: 'Pepper Rasam', section: 'L2', type: 'gram', category: 'rasam' },
      { name: 'Rice', section: 'L4', type: 'gram', category: 'rice_plain' },
      { name: 'Carrot Green Peas Dry', section: 'L1', type: 'gram', category: 'carrot_peas' },
      { name: 'Curd', section: 'L2', type: 'gram', category: 'curd_buffalo' },
      { name: 'Fruit Custard', section: 'L3', type: 'fixed', category: 'fruit_custard' },
      { name: 'Salad', section: 'L1', type: 'gram', category: 'salad' }
    ],
    snacks: [
      { name: 'Punugulu', section: 'L4', type: 'fixed', category: 'punugulu' },
      { name: 'Cut Fruit', section: 'L3', type: 'fixed', category: 'cut_fruit' },
      { name: 'Tea', section: 'L3', type: 'fixed', category: 'tea' }
    ],
    dinner: [
      { name: 'Egg Burji', section: 'L1', type: 'gram', category: 'egg_bhurji' },
      { name: 'Rajma Masala', section: 'L1', type: 'gram', category: 'rajma' },
      { name: 'Tomato Dal', section: 'L2', type: 'gram', category: 'toor_dal' },
      { name: 'Roti', section: 'L4', type: 'unit', bread_key: 'chapati', default: 2 },
      { name: 'Rice', section: 'L4', type: 'gram', category: 'rice_plain' },
      { name: 'Atta Ka Halwa', section: 'L3', type: 'fixed', category: 'atta_halwa' },
      { name: 'Raita', section: 'L2', type: 'gram', category: 'raita' }
    ]
  },
  
  saturday: {
    breakfast: [
      { name: 'Aloo Paratha', section: 'L4', type: 'unit', bread_key: 'paratha_aloo', default: 2 },
      { name: 'Pesarattu with Upma', section: 'L4', type: 'unit', bread_key: 'pesarattu', default: 1 },
      { name: 'Boost', section: 'L3', type: 'fixed', category: 'boost' },
      { name: 'Sambar', section: 'L3', type: 'gram', category: 'sambar' },
      { name: 'Curd', section: 'L2', type: 'gram', category: 'curd_buffalo' },
      { name: 'Green Chutney', section: 'L3', type: 'gram', category: 'green_chutney' },
      { name: 'Tea', section: 'L3', type: 'fixed', category: 'tea' }
    ],
    lunch: [
      { name: 'Beetroot Channa Dry', section: 'L1', type: 'gram', category: 'beetroot_channa' },
      { name: 'Gobi Masala Curry', section: 'L1', type: 'gram', category: 'gobi_masala' },
      { name: 'Lemon Rice', section: 'L4', type: 'gram', category: 'rice_lemon' },
      { name: 'Mix Dal', section: 'L2', type: 'gram', category: 'mixed_dal' },
      { name: 'Chapati', section: 'L4', type: 'unit', bread_key: 'chapati', default: 2 },
      { name: 'Curd', section: 'L2', type: 'gram', category: 'curd_buffalo' },
      { name: 'Salad', section: 'L1', type: 'gram', category: 'salad' },
      { name: 'Papad', section: 'L3', type: 'unit', bread_key: 'papad', default: 1 }
    ],
    snacks: [
      { name: 'Vada Pav', section: 'L4', type: 'fixed', category: 'vada_pav' },
      { name: 'Rusk', section: 'L3', type: 'fixed', category: 'rusk' },
      { name: 'Tea', section: 'L3', type: 'fixed', category: 'tea' }
    ],
    dinner: [
      { name: 'Veg Fried Rice', section: 'L4', type: 'gram', category: 'rice_fried_veg' },
      { name: 'Veg Manchurian', section: 'L1', type: 'gram', category: 'veg_manchurian' },
      { name: 'Dal', section: 'L2', type: 'gram', category: 'toor_dal' },
      { name: 'Roti', section: 'L4', type: 'unit', bread_key: 'chapati', default: 2 },
      { name: 'Rasmalai', section: 'L3', type: 'fixed', category: 'rasmalai' },
      { name: 'Rasam', section: 'L2', type: 'gram', category: 'rasam' }
    ]
  },
  
  sunday: {
    breakfast: [
      { name: 'Chole Bhature', section: 'L4', type: 'unit', bread_key: 'poori', default: 2 },
      { name: 'Sabudana Kichidi', section: 'L4', type: 'gram', category: 'sabudana_khichdi' },
      { name: 'Sweet Corn', section: 'L3', type: 'fixed', category: 'sweet_corn' },
      { name: 'Green Chutney', section: 'L3', type: 'gram', category: 'green_chutney' },
      { name: 'Tea', section: 'L3', type: 'fixed', category: 'tea' },
      { name: 'Coffee', section: 'L3', type: 'fixed', category: 'coffee' }
    ],
    lunch: [
      { name: 'Aloo Dopyaza Dry', section: 'L1', type: 'gram', category: 'aloo_dopyaza' },
      { name: 'Veg Makhanwala', section: 'L1', type: 'gram', category: 'veg_makhanwala' },
      { name: 'Gongura Dal', section: 'L2', type: 'gram', category: 'gongura_dal' },
      { name: 'Pudina Rice', section: 'L4', type: 'gram', category: 'rice_pudina' },
      { name: 'Chapati', section: 'L4', type: 'unit', bread_key: 'chapati', default: 2 },
      { name: 'Curd', section: 'L2', type: 'gram', category: 'curd_buffalo' },
      { name: 'Jalebi', section: 'L3', type: 'fixed', category: 'jalebi' },
      { name: 'Salad', section: 'L1', type: 'gram', category: 'salad' }
    ],
    snacks: [
      { name: 'Veg Noodles', section: 'L4', type: 'gram', category: 'veg_noodles' },
      { name: 'Parle G', section: 'L3', type: 'fixed', category: 'parle_g' },
      { name: 'Tea', section: 'L3', type: 'fixed', category: 'tea' }
    ],
    dinner: [
      { name: 'Veg Biryani', section: 'L4', type: 'gram', category: 'rice_biryani_veg' },
      { name: 'Chicken Biryani', section: 'L4', type: 'gram', category: 'rice_biryani_chicken' },
      { name: 'Raita', section: 'L2', type: 'gram', category: 'raita' },
      { name: 'Dal Tadka', section: 'L2', type: 'gram', category: 'dal_tadka' },
      { name: 'Paneer Curry', section: 'L1', type: 'gram', category: 'paneer_curry' },
      { name: 'Roti', section: 'L4', type: 'unit', bread_key: 'chapati', default: 2 },
      { name: 'Ice Cream', section: 'L3', type: 'fixed', category: 'ice_cream' }
    ]
  }
};

// Get menu for a specific day and meal
function getMessMenu(day, meal) {
  const dayMenu = MESS_MENU[day.toLowerCase()];
  if (!dayMenu) return [];
  return dayMenu[meal] || [];
}

// Get current day menu
function getCurrentDayMenu(meal) {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()];
  return getMessMenu(today, meal);
}

// Get all days
function getAllDays() {
  return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
}

// Get all meal types
function getAllMealTypes() {
  return ['breakfast', 'lunch', 'snacks', 'dinner'];
}

// Initialize mess menu data (called on app start)
async function initializeMessMenuData() {
  // Store menu data in IndexedDB for offline access
  await setSetting('messMenu', MESS_MENU);
  await setSetting('messMenuVersion', '2.0');
  console.log('Mess menu data initialized');
}

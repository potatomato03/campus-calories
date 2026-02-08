/**
 * Campus Calories v2.0 - Nutrition Data
 * Accurate nutritional values from IFCT (Indian Food Composition Tables) and USDA
 * All values per 100g unless specified otherwise
 */

// ==================== BREAD UNITS (PER PIECE) ====================
// Unit-based system for all Indian breads
// QA Verified: Chapati = 120 kcal, 3g protein (standard 40g piece)
const BREAD_UNITS = {
  // Basic Breads
  chapati: { 
    name: 'Chapati',
    calories: 120, 
    protein: 3.0, 
    carbs: 20, 
    fat: 2.8,
    weight: 40, 
    max: 5,
    icon: '🫓'
  },
  roti: { 
    name: 'Roti',
    calories: 120, 
    protein: 3.0, 
    carbs: 20, 
    fat: 2.8,
    weight: 40, 
    max: 5,
    icon: '🫓'
  },
  
  // Parathas
  paratha_plain: { 
    name: 'Plain Paratha',
    calories: 150, 
    protein: 4.0, 
    carbs: 20, 
    fat: 6.5,
    weight: 50, 
    max: 3,
    icon: '🥟'
  },
  paratha_aloo: { 
    name: 'Aloo Paratha',
    calories: 210, 
    protein: 4.5, 
    carbs: 28, 
    fat: 9.5,
    weight: 80, 
    max: 3,
    icon: '🥟'
  },
  paratha_paneer: { 
    name: 'Paneer Paratha',
    calories: 270, 
    protein: 9.0, 
    carbs: 22, 
    fat: 15,
    weight: 90, 
    max: 3,
    icon: '🥟'
  },
  paratha_amritsari: {
    name: 'Amritsari Paratha',
    calories: 280,
    protein: 5.5,
    carbs: 30,
    fat: 14,
    weight: 85,
    max: 2,
    icon: '🥟'
  },
  paratha_methi: {
    name: 'Methi Paratha',
    calories: 165,
    protein: 4.8,
    carbs: 23,
    fat: 6.8,
    weight: 55,
    max: 3,
    icon: '🥟'
  },
  
  // Poori
  poori: { 
    name: 'Poori',
    calories: 80, 
    protein: 1.5, 
    carbs: 10, 
    fat: 4,
    weight: 25, 
    max: 5,
    icon: '🍘'
  },
  poori_methi: {
    name: 'Methi Poori',
    calories: 85,
    protein: 1.8,
    carbs: 11,
    fat: 4.2,
    weight: 28,
    max: 5,
    icon: '🍘'
  },
  
  // South Indian
  idli: { 
    name: 'Idli',
    calories: 39, 
    protein: 1.6, 
    carbs: 8, 
    fat: 0.2,
    weight: 40, 
    max: 6,
    icon: '🍚'
  },
  idli_rawa: { 
    name: 'Rawa Idli',
    calories: 55, 
    protein: 2.0, 
    carbs: 11, 
    fat: 0.5,
    weight: 45, 
    max: 6,
    icon: '🍚'
  },
  dosa_plain: { 
    name: 'Plain Dosa',
    calories: 85, 
    protein: 2.0, 
    carbs: 16, 
    fat: 1,
    weight: 40, 
    max: 3,
    icon: '🥞'
  },
  dosa_masala: { 
    name: 'Masala Dosa',
    calories: 180, 
    protein: 4.0, 
    carbs: 28, 
    fat: 6,
    weight: 120, 
    max: 2,
    icon: '🥞'
  },
  uttapam: { 
    name: 'Uttapam',
    calories: 110, 
    protein: 3.5, 
    carbs: 18, 
    fat: 3,
    weight: 80, 
    max: 2,
    icon: '🥞'
  },
  vada: { 
    name: 'Vada',
    calories: 90, 
    protein: 2.5, 
    carbs: 12, 
    fat: 4,
    weight: 50, 
    max: 4,
    icon: '🍩'
  },
  bonda: { 
    name: 'Bonda',
    calories: 85, 
    protein: 2.0, 
    carbs: 11, 
    fat: 3.5,
    weight: 40, 
    max: 4,
    icon: '🍩'
  },
  pongal: { 
    name: 'Pongal',
    calories: 220, 
    protein: 6.0, 
    carbs: 32, 
    fat: 8,
    weight: 150, 
    max: 2,
    icon: '🍲'
  },
  pesarattu: {
    name: 'Pesarattu',
    calories: 95,
    protein: 4.5,
    carbs: 14,
    fat: 2.5,
    weight: 60,
    max: 2,
    icon: '🥞'
  },
  
  // Other Breads
  bread_slice: { 
    name: 'Bread Slice',
    calories: 80, 
    protein: 2.7, 
    carbs: 15, 
    fat: 1,
    weight: 30, 
    max: 4,
    icon: '🍞'
  },
  bread_butter: { 
    name: 'Bread with Butter',
    calories: 130, 
    protein: 2.7, 
    carbs: 15, 
    fat: 6,
    weight: 30, 
    max: 4,
    icon: '🍞'
  },
  bread_jam: {
    name: 'Bread with Jam',
    calories: 145,
    protein: 2.7,
    carbs: 28,
    fat: 1.2,
    weight: 35,
    max: 4,
    icon: '🍞'
  },
  chilla: {
    name: 'Besan Chilla',
    calories: 165,
    protein: 7.5,
    carbs: 18,
    fat: 7,
    weight: 80,
    max: 2,
    icon: '🥞'
  },
  
  // Snack Items
  samosa: {
    name: 'Samosa',
    calories: 150,
    protein: 3.5,
    carbs: 18,
    fat: 7.5,
    weight: 50,
    max: 3,
    icon: '🥟'
  },
  papad: {
    name: 'Papad',
    calories: 35,
    protein: 1.5,
    carbs: 5,
    fat: 1.2,
    weight: 10,
    max: 4,
    icon: '🍘'
  },
  rusk: {
    name: 'Rusk',
    calories: 60,
    protein: 1.2,
    carbs: 11,
    fat: 1.5,
    weight: 15,
    max: 4,
    icon: '🍪'
  }
};

// ==================== RICE VARIATIONS (PER 100g) ====================
const RICE_DATA = {
  rice_plain: {
    name: 'Plain Boiled Rice',
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    defaultGrams: 250
  },
  rice_fried_veg: {
    name: 'Veg Fried Rice',
    calories: 180,
    protein: 4.2,
    carbs: 28,
    fat: 6.5,
    defaultGrams: 220
  },
  rice_fried_egg: {
    name: 'Egg Fried Rice',
    calories: 200,
    protein: 6.5,
    carbs: 27,
    fat: 8,
    defaultGrams: 220
  },
  rice_fried_chicken: {
    name: 'Chicken Fried Rice',
    calories: 210,
    protein: 8.2,
    carbs: 26,
    fat: 9,
    defaultGrams: 220
  },
  rice_biryani_veg: {
    name: 'Veg Biryani',
    calories: 160,
    protein: 4.5,
    carbs: 26,
    fat: 5,
    defaultGrams: 240
  },
  rice_biryani_chicken: {
    name: 'Chicken Biryani',
    calories: 190,
    protein: 9.0,
    carbs: 24,
    fat: 7,
    defaultGrams: 240
  },
  rice_lemon: {
    name: 'Lemon Rice',
    calories: 150,
    protein: 3.0,
    carbs: 27,
    fat: 4,
    defaultGrams: 200
  },
  rice_curd: {
    name: 'Curd Rice',
    calories: 145,
    protein: 3.8,
    carbs: 24,
    fat: 4.5,
    defaultGrams: 250
  },
  rice_soya: {
    name: 'Soya Rice',
    calories: 165,
    protein: 6.2,
    carbs: 26,
    fat: 5,
    defaultGrams: 220
  },
  rice_tamarind: {
    name: 'Tamarind Rice',
    calories: 155,
    protein: 3.2,
    carbs: 29,
    fat: 4,
    defaultGrams: 200
  },
  rice_pudina: {
    name: 'Pudina Rice',
    calories: 148,
    protein: 3.0,
    carbs: 27,
    fat: 3.8,
    defaultGrams: 200
  },
  rice_pulao: {
    name: 'Veg Pulao',
    calories: 135,
    protein: 3.0,
    carbs: 25,
    fat: 3,
    defaultGrams: 200
  }
};

// ==================== LENTILS & DAL (PER 100g) ====================
const LENTILS_DATA = {
  dal_makhani: {
    name: 'Dal Makhani',
    calories: 120,
    protein: 6.0,
    carbs: 14,
    fat: 5,
    defaultGrams: 160
  },
  toor_dal: {
    name: 'Toor Dal',
    calories: 116,
    protein: 7.0,
    carbs: 18,
    fat: 2.5,
    defaultGrams: 170
  },
  toor_dal_fry: {
    name: 'Dal Fry',
    calories: 125,
    protein: 6.5,
    carbs: 16,
    fat: 4.5,
    defaultGrams: 160
  },
  moong_dal: {
    name: 'Moong Dal',
    calories: 105,
    protein: 7.5,
    carbs: 16,
    fat: 1.5,
    defaultGrams: 170
  },
  chana_dal: {
    name: 'Chana Dal',
    calories: 130,
    protein: 8.5,
    carbs: 18,
    fat: 3,
    defaultGrams: 160
  },
  rajma: {
    name: 'Rajma Masala',
    calories: 127,
    protein: 8.7,
    carbs: 17,
    fat: 3.5,
    defaultGrams: 156
  },
  chole: {
    name: 'Chole',
    calories: 140,
    protein: 8.9,
    carbs: 19,
    fat: 4,
    defaultGrams: 156
  },
  sambar: {
    name: 'Sambar',
    calories: 65,
    protein: 3.5,
    carbs: 10,
    fat: 1.5,
    defaultGrams: 150
  },
  rasam: {
    name: 'Rasam',
    calories: 45,
    protein: 2.0,
    carbs: 7,
    fat: 1,
    defaultGrams: 150
  },
  mixed_dal: {
    name: 'Mixed Dal',
    calories: 118,
    protein: 7.2,
    carbs: 16,
    fat: 3,
    defaultGrams: 165
  },
  gongura_dal: {
    name: 'Gongura Dal',
    calories: 110,
    protein: 6.8,
    carbs: 15,
    fat: 3,
    defaultGrams: 170
  },
  dal_tadka: {
    name: 'Dal Tadka',
    calories: 122,
    protein: 6.8,
    carbs: 15,
    fat: 4,
    defaultGrams: 160
  }
};

// ==================== DAIRY (PER 100g/100ml) ====================
const DAIRY_DATA = {
  curd_buffalo: {
    name: 'Curd (Buffalo)',
    calories: 90,
    protein: 4.5,
    carbs: 5,
    fat: 5.5,
    defaultGrams: 195
  },
  curd_cow: {
    name: 'Curd (Cow)',
    calories: 65,
    protein: 3.5,
    carbs: 4.5,
    fat: 3.5,
    defaultGrams: 195
  },
  milk_buffalo: {
    name: 'Milk (Buffalo)',
    calories: 100,
    protein: 4.3,
    carbs: 5,
    fat: 6.5,
    defaultMl: 200
  },
  milk_cow: {
    name: 'Milk (Cow)',
    calories: 65,
    protein: 3.2,
    carbs: 4.8,
    fat: 3.6,
    defaultMl: 200
  },
  raita: {
    name: 'Raita',
    calories: 75,
    protein: 3.5,
    carbs: 6,
    fat: 4,
    defaultGrams: 150
  },
  kheer: {
    name: 'Kheer',
    calories: 165,
    protein: 5,
    carbs: 25,
    fat: 5.5,
    defaultGrams: 100
  },
  gulab_jamun: {
    name: 'Gulab Jamun',
    calories: 150,
    protein: 2.0,
    carbs: 25,
    fat: 5,
    defaultGrams: 50
  },
  rasmalai: {
    name: 'Rasmalai',
    calories: 150,
    protein: 4.0,
    carbs: 20,
    fat: 6,
    defaultGrams: 60
  },
  peda: {
    name: 'Peda',
    calories: 120,
    protein: 3.0,
    carbs: 18,
    fat: 4.5,
    defaultGrams: 40
  },
  amarkhand: {
    name: 'Amarkhand',
    calories: 180,
    protein: 4.0,
    carbs: 22,
    fat: 8,
    defaultGrams: 100
  },
  atta_halwa: {
    name: 'Atta Ka Halwa',
    calories: 200,
    protein: 3.0,
    carbs: 28,
    fat: 9,
    defaultGrams: 80
  },
  ice_cream: {
    name: 'Ice Cream',
    calories: 200,
    protein: 3.0,
    carbs: 24,
    fat: 10,
    defaultGrams: 100
  }
};

// ==================== VEGETABLES - DRY (PER 100g) ====================
const VEG_DRY_DATA = {
  veg_dry: {
    name: 'Dry Vegetable',
    calories: 95,
    protein: 3.0,
    carbs: 12,
    fat: 4,
    defaultGrams: 120
  },
  cabbage_peas: {
    name: 'Cabbage Green Peas',
    calories: 95,
    protein: 3.5,
    carbs: 12,
    fat: 3.8,
    defaultGrams: 120
  },
  bhindi_kurkure: {
    name: 'Bhindi Kurkure',
    calories: 110,
    protein: 2.8,
    carbs: 12,
    fat: 6,
    defaultGrams: 100
  },
  cluster_beans: {
    name: 'Cluster Beans',
    calories: 85,
    protein: 2.5,
    carbs: 10,
    fat: 3.5,
    defaultGrams: 120
  },
  aloo_matar_dry: {
    name: 'Aloo Matar Dry',
    calories: 105,
    protein: 3.2,
    carbs: 14,
    fat: 4,
    defaultGrams: 120
  },
  tori_sabji: {
    name: 'Tori Sabji',
    calories: 75,
    protein: 2.0,
    carbs: 9,
    fat: 3.5,
    defaultGrams: 120
  },
  beetroot_channa: {
    name: 'Beetroot Channa',
    calories: 105,
    protein: 4.5,
    carbs: 14,
    fat: 3.5,
    defaultGrams: 120
  },
  aloo_dopyaza: {
    name: 'Aloo Dopyaza',
    calories: 115,
    protein: 2.8,
    carbs: 15,
    fat: 5,
    defaultGrams: 120
  },
  carrot_peas: {
    name: 'Carrot Green Peas',
    calories: 98,
    protein: 3.2,
    carbs: 13,
    fat: 3.8,
    defaultGrams: 120
  },
  soya_keema: {
    name: 'Soya Keema',
    calories: 145,
    protein: 12,
    carbs: 10,
    fat: 6.5,
    defaultGrams: 120
  }
};

// ==================== VEGETABLES - GRAVY (PER 100g) ====================
const VEG_GRAVY_DATA = {
  veg_gravy: {
    name: 'Vegetable Gravy',
    calories: 110,
    protein: 3.0,
    carbs: 10,
    fat: 6,
    defaultGrams: 140
  },
  veg_handi: {
    name: 'Veg Handi',
    calories: 115,
    protein: 3.5,
    carbs: 10,
    fat: 6.5,
    defaultGrams: 150
  },
  aloo_matar_gravy: {
    name: 'Aloo Matar Gravy',
    calories: 110,
    protein: 3.2,
    carbs: 12,
    fat: 5,
    defaultGrams: 140
  },
  veg_kofta: {
    name: 'Veg Kofta Curry',
    calories: 140,
    protein: 4.0,
    carbs: 10,
    fat: 9,
    defaultGrams: 150
  },
  gobi_masala: {
    name: 'Gobi Masala',
    calories: 105,
    protein: 3.0,
    carbs: 9,
    fat: 6.5,
    defaultGrams: 140
  },
  veg_makhanwala: {
    name: 'Veg Makhanwala',
    calories: 165,
    protein: 4.5,
    carbs: 10,
    fat: 12,
    defaultGrams: 140
  },
  methi_malai_matar: {
    name: 'Methi Malai Matar',
    calories: 145,
    protein: 4.8,
    carbs: 10,
    fat: 9.5,
    defaultGrams: 140
  },
  paneer_curry: {
    name: 'Paneer Curry',
    calories: 175,
    protein: 9,
    carbs: 8,
    fat: 12,
    defaultGrams: 140
  },
  hara_bhara_kabab: {
    name: 'Hara Bhara Kabab',
    calories: 100,
    protein: 3.0,
    carbs: 10,
    fat: 5,
    defaultGrams: 80
  },
  veg_manchurian: {
    name: 'Veg Manchurian',
    calories: 155,
    protein: 4.5,
    carbs: 14,
    fat: 9,
    defaultGrams: 120
  }
};

// ==================== EGG DISHES (PER 100g) ====================
const EGG_DATA = {
  egg_curry: {
    name: 'Egg Curry',
    calories: 160,
    protein: 10,
    carbs: 6,
    fat: 10,
    defaultGrams: 150
  },
  egg_bhurji: {
    name: 'Egg Burji',
    calories: 175,
    protein: 12,
    carbs: 4,
    fat: 12,
    defaultGrams: 120
  },
  boiled_egg: {
    name: 'Boiled Egg',
    calories: 155,
    protein: 13,
    carbs: 1,
    fat: 11,
    defaultGrams: 50
  }
};

// ==================== CHUTNEYS & SIDES (PER 100g) ====================
const SIDES_DATA = {
  coconut_chutney: {
    name: 'Coconut Chutney',
    calories: 120,
    protein: 2.0,
    carbs: 8,
    fat: 10,
    defaultGrams: 30
  },
  peanut_chutney: {
    name: 'Peanut Chutney',
    calories: 180,
    protein: 7,
    carbs: 10,
    fat: 14,
    defaultGrams: 30
  },
  green_chutney: {
    name: 'Green Chutney',
    calories: 45,
    protein: 1.5,
    carbs: 5,
    fat: 2.5,
    defaultGrams: 30
  },
  pickle: {
    name: 'Pickle',
    calories: 30,
    protein: 0.5,
    carbs: 6,
    fat: 0.8,
    defaultGrams: 20
  },
  salad: {
    name: 'Salad',
    calories: 25,
    protein: 1.0,
    carbs: 5,
    fat: 0.2,
    defaultGrams: 50
  },
  sprouts: {
    name: 'Sprouts',
    calories: 95,
    protein: 6.5,
    carbs: 12,
    fat: 1.5,
    defaultGrams: 80
  },
  chana_salad: {
    name: 'Black Chana Salad',
    calories: 115,
    protein: 7,
    carbs: 16,
    fat: 2.5,
    defaultGrams: 80
  }
};

// ==================== BEVERAGES (PER CUP/SERVING) ====================
const BEVERAGES_DATA = {
  tea: {
    name: 'Tea',
    calories: 70,
    protein: 2.0,
    carbs: 10,
    fat: 2,
    defaultMl: 150
  },
  coffee: {
    name: 'Coffee',
    calories: 60,
    protein: 2.0,
    carbs: 8,
    fat: 2,
    defaultMl: 150
  },
  boost: {
    name: 'Boost',
    calories: 120,
    protein: 3.0,
    carbs: 22,
    fat: 2,
    defaultMl: 200
  },
  chocos: {
    name: 'Chocos with Milk',
    calories: 150,
    protein: 4.0,
    carbs: 28,
    fat: 2.5,
    defaultGrams: 40
  }
};

// ==================== SNACKS & OTHER (PER SERVING) ====================
const SNACKS_DATA = {
  papadi_chat: {
    name: 'Papadi Chat',
    calories: 120,
    protein: 3.0,
    carbs: 18,
    fat: 4.5,
    defaultGrams: 100
  },
  pani_puri: {
    name: 'Pani Puri',
    calories: 20,
    protein: 0.5,
    carbs: 4,
    fat: 0.5,
    defaultGrams: 15
  },
  vada_pav: {
    name: 'Vada Pav',
    calories: 200,
    protein: 5.0,
    carbs: 25,
    fat: 9,
    defaultGrams: 100
  },
  punugulu: {
    name: 'Punugulu',
    calories: 120,
    protein: 3.0,
    carbs: 15,
    fat: 5.5,
    defaultGrams: 80
  },
  white_pasta: {
    name: 'White Pasta',
    calories: 200,
    protein: 6.0,
    carbs: 28,
    fat: 7,
    defaultGrams: 150
  },
  veg_noodles: {
    name: 'Veg Noodles',
    calories: 185,
    protein: 5.5,
    carbs: 28,
    fat: 6,
    defaultGrams: 200
  },
  sabudana_khichdi: {
    name: 'Sabudana Khichdi',
    calories: 165,
    protein: 2.5,
    carbs: 32,
    fat: 3.5,
    defaultGrams: 200
  },
  poha: {
    name: 'Poha',
    calories: 130,
    protein: 2.8,
    carbs: 26,
    fat: 2,
    defaultGrams: 150
  },
  parle_g: {
    name: 'Parle G Biscuits',
    calories: 85,
    protein: 1.5,
    carbs: 14,
    fat: 3,
    defaultGrams: 20
  },
  banana: {
    name: 'Banana',
    calories: 107,
    protein: 1.1,
    carbs: 27,
    fat: 0.3,
    defaultGrams: 120
  },
  cut_fruit: {
    name: 'Cut Fruit',
    calories: 60,
    protein: 0.5,
    carbs: 15,
    fat: 0.2,
    defaultGrams: 150
  },
  sweet_corn: {
    name: 'Sweet Corn',
    calories: 80,
    protein: 2.5,
    carbs: 16,
    fat: 1,
    defaultGrams: 100
  },
  peanuts: {
    name: 'Peanuts',
    calories: 160,
    protein: 7.0,
    carbs: 5,
    fat: 14,
    defaultGrams: 30
  },
  jalebi: {
    name: 'Jalebi',
    calories: 120,
    protein: 1.0,
    carbs: 25,
    fat: 2.5,
    defaultGrams: 40
  },
  fruit_custard: {
    name: 'Fruit Custard',
    calories: 140,
    protein: 3.5,
    carbs: 22,
    fat: 4,
    defaultGrams: 120
  }
};

// ==================== PLATE SECTIONS DEFAULT WEIGHTS ====================
const PLATE_SECTIONS = {
  L1: {
    name: 'Curries & Dry',
    description: 'Thick curries, dry sabzi, salad',
    items: {
      thick_curry: { grams: 156, label: 'Thick Curry' },
      soupy_veg: { grams: 140, label: 'Soupy Veg' },
      dry_sabzi: { grams: 120, label: 'Dry Sabzi' },
      salad: { grams: 100, label: 'Salad' }
    }
  },
  L2: {
    name: 'Dal & Curd',
    description: 'Dal, Curd, Sambar, Rasam',
    items: {
      curd: { grams: 195, label: 'Curd' },
      thin_dal: { grams: 170, label: 'Thin Dal' },
      thick_dal: { grams: 160, label: 'Thick Dal' },
      raita: { grams: 150, label: 'Raita' }
    }
  },
  L3: {
    name: 'Sides',
    description: 'Chutney, Pickle, Papad, Fryums',
    items: {
      chutney: { grams: 30, label: 'Chutney' },
      pickle: { grams: 20, label: 'Pickle' },
      papad: { grams: 10, label: 'Papad' },
      fryums: { grams: 5, label: 'Fryums' }
    }
  },
  L4: {
    name: 'Rice & Bread',
    description: 'Rice (gram-based) OR Bread (unit-based)',
    items: {
      rice_plain: { grams: 250, label: 'Plain Rice' },
      rice_fried: { grams: 220, label: 'Fried Rice' },
      rice_biryani: { grams: 240, label: 'Biryani' }
    }
  }
};

// ==================== MESS TIME SLOTS ====================
const MESS_TIME_SLOTS = {
  breakfast: { start: 7 * 60, end: 10 * 60, label: 'Breakfast', next: 'lunch' },
  lunch: { start: 12 * 60 + 30, end: 14 * 60, label: 'Lunch', next: 'snacks' },
  snacks: { start: 16 * 60 + 30, end: 18 * 60, label: 'Snacks', next: 'dinner' },
  dinner: { start: 19 * 60, end: 22 * 60, label: 'Dinner', next: 'breakfast' }
};

// ==================== UTILITY FUNCTIONS ====================

// Calculate nutrition for bread units
function calculateBreadNutrition(breadKey, quantity) {
  const bread = BREAD_UNITS[breadKey];
  if (!bread) return null;
  
  return {
    calories: Math.round(bread.calories * quantity),
    protein: Math.round(bread.protein * quantity * 10) / 10,
    carbs: Math.round(bread.carbs * quantity * 10) / 10,
    fat: Math.round(bread.fat * quantity * 10) / 10,
    weight: bread.weight * quantity,
    name: `${quantity} ${bread.name}${quantity > 1 ? 's' : ''}`
  };
}

// Calculate nutrition for gram-based items
function calculateGramNutrition(nutritionPer100g, grams) {
  const factor = grams / 100;
  return {
    calories: Math.round(nutritionPer100g.calories * factor),
    protein: Math.round(nutritionPer100g.protein * factor * 10) / 10,
    carbs: Math.round(nutritionPer100g.carbs * factor * 10) / 10,
    fat: Math.round(nutritionPer100g.fat * factor * 10) / 10,
    weight: grams
  };
}

// Get current meal type based on time
function getCurrentMealType() {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  
  if (minutes >= MESS_TIME_SLOTS.breakfast.start && minutes < MESS_TIME_SLOTS.breakfast.end) {
    return 'breakfast';
  } else if (minutes >= MESS_TIME_SLOTS.lunch.start && minutes < MESS_TIME_SLOTS.lunch.end) {
    return 'lunch';
  } else if (minutes >= MESS_TIME_SLOTS.snacks.start && minutes < MESS_TIME_SLOTS.snacks.end) {
    return 'snacks';
  } else if (minutes >= MESS_TIME_SLOTS.dinner.start && minutes < MESS_TIME_SLOTS.dinner.end) {
    return 'dinner';
  }
  return null;
}

// Check if mess is currently open
function isMessOpen() {
  return getCurrentMealType() !== null;
}

// Get next meal time
function getNextMealTime() {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const currentMeal = getCurrentMealType();
  
  if (currentMeal) {
    const nextMeal = MESS_TIME_SLOTS[currentMeal].next;
    const nextSlot = MESS_TIME_SLOTS[nextMeal];
    const hours = Math.floor(nextSlot.start / 60);
    const mins = nextSlot.start % 60;
    return `${nextMeal.charAt(0).toUpperCase() + nextMeal.slice(1)} at ${hours}:${mins.toString().padStart(2, '0')}`;
  }
  
  // Find next meal
  for (const [meal, slot] of Object.entries(MESS_TIME_SLOTS)) {
    if (minutes < slot.start) {
      const hours = Math.floor(slot.start / 60);
      const mins = slot.start % 60;
      return `${slot.label} at ${hours}:${mins.toString().padStart(2, '0')}`;
    }
  }
  
  // Next day breakfast
  const breakfast = MESS_TIME_SLOTS.breakfast;
  const hours = Math.floor(breakfast.start / 60);
  const mins = breakfast.start % 60;
  return `Breakfast tomorrow at ${hours}:${mins.toString().padStart(2, '0')}`;
}

// Get all nutrition data combined
function getAllNutritionData() {
  return {
    ...RICE_DATA,
    ...LENTILS_DATA,
    ...DAIRY_DATA,
    ...VEG_DRY_DATA,
    ...VEG_GRAVY_DATA,
    ...EGG_DATA,
    ...SIDES_DATA,
    ...BEVERAGES_DATA,
    ...SNACKS_DATA
  };
}

// Lookup nutrition by category key
function getNutritionByKey(key) {
  const allData = getAllNutritionData();
  return allData[key] || null;
}

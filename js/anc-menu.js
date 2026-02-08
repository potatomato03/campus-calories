/**
 * Campus Calories v2.0 - ANC Menu Data
 * Food Court menu with prices and nutrition
 */

const ANC_MENU = {
  anc_rice: {
    name: 'Rice',
    icon: '🍚',
    items: [
      { name: 'Veg Fried Rice', price: 45, calories: 150, protein: 4.2, carbs: 25, fat: 5, weight: 200 },
      { name: 'Chicken Fried Rice', price: 75, calories: 190, protein: 8.2, carbs: 24, fat: 7, weight: 200 },
      { name: 'Prawns Schezwan Rice', price: 95, calories: 180, protein: 12, carbs: 22, fat: 6, weight: 200 },
      { name: 'Egg Fried Rice', price: 55, calories: 170, protein: 6.5, carbs: 24, fat: 6, weight: 200 },
      { name: 'Paneer Fried Rice', price: 65, calories: 175, protein: 7, carbs: 23, fat: 7, weight: 200 },
      { name: 'Mushroom Fried Rice', price: 60, calories: 145, protein: 4.5, carbs: 24, fat: 5, weight: 200 },
      { name: 'Jeera Rice', price: 40, calories: 135, protein: 3, carbs: 26, fat: 2.5, weight: 200 },
      { name: 'Veg Biryani', price: 55, calories: 160, protein: 4.5, carbs: 26, fat: 5, weight: 250 },
      { name: 'Chicken Biryani', price: 85, calories: 190, protein: 9, carbs: 24, fat: 7, weight: 250 },
      { name: 'Egg Biryani', price: 65, calories: 175, protein: 7.5, carbs: 25, fat: 6, weight: 250 },
      { name: 'Veg Pulao', price: 45, calories: 135, protein: 3, carbs: 25, fat: 3, weight: 200 },
      { name: 'Kashmiri Pulao', price: 55, calories: 155, protein: 3.5, carbs: 28, fat: 4, weight: 200 }
    ]
  },
  
  anc_noodles: {
    name: 'Noodles',
    icon: '🍜',
    items: [
      { name: 'Veg Hakka Noodles', price: 50, calories: 165, protein: 4.5, carbs: 28, fat: 5, weight: 200 },
      { name: 'Chicken Hakka Noodles', price: 80, calories: 195, protein: 10, carbs: 26, fat: 7, weight: 200 },
      { name: 'Veg Schezwan Noodles', price: 55, calories: 175, protein: 4.5, carbs: 29, fat: 6, weight: 200 },
      { name: 'Chicken Schezwan Noodles', price: 85, calories: 205, protein: 10, carbs: 27, fat: 8, weight: 200 },
      { name: 'Veg Chow Mein', price: 50, calories: 160, protein: 4, carbs: 27, fat: 5, weight: 200 },
      { name: 'Chicken Chow Mein', price: 80, calories: 190, protein: 9.5, carbs: 25, fat: 7, weight: 200 },
      { name: 'Pad Thai Noodles', price: 70, calories: 185, protein: 6, carbs: 28, fat: 6.5, weight: 200 },
      { name: 'Singapore Noodles', price: 75, calories: 180, protein: 5.5, carbs: 27, fat: 6, weight: 200 }
    ]
  },
  
  anc_pizza: {
    name: 'Pizza',
    icon: '🍕',
    items: [
      { name: 'Margherita Pizza', price: 90, calories: 220, protein: 8, carbs: 28, fat: 9, weight: 150 },
      { name: 'Veggie Pizza', price: 110, calories: 240, protein: 9, carbs: 30, fat: 10, weight: 150 },
      { name: 'Paneer Pizza', price: 125, calories: 265, protein: 12, carbs: 29, fat: 12, weight: 150 },
      { name: 'Chicken Pizza', price: 140, calories: 280, protein: 15, carbs: 28, fat: 13, weight: 150 },
      { name: 'Pepperoni Pizza', price: 150, calories: 290, protein: 14, carbs: 27, fat: 15, weight: 150 },
      { name: 'Cheese Burst Pizza', price: 160, calories: 320, protein: 13, carbs: 30, fat: 17, weight: 150 },
      { name: 'Mushroom Pizza', price: 115, calories: 235, protein: 9, carbs: 29, fat: 10, weight: 150 },
      { name: 'Corn & Cheese Pizza', price: 120, calories: 250, protein: 10, carbs: 31, fat: 11, weight: 150 }
    ]
  },
  
  anc_dosa: {
    name: 'Dosa',
    icon: '🥞',
    items: [
      { name: 'Plain Dosa', price: 35, calories: 85, protein: 2, carbs: 16, fat: 1, weight: 80 },
      { name: 'Masala Dosa', price: 45, calories: 175, protein: 4, carbs: 28, fat: 6, weight: 150 },
      { name: 'Onion Dosa', price: 40, calories: 95, protein: 2.5, carbs: 17, fat: 2, weight: 90 },
      { name: 'Paneer Dosa', price: 65, calories: 195, protein: 8, carbs: 24, fat: 9, weight: 150 },
      { name: 'Cheese Dosa', price: 70, calories: 210, protein: 7, carbs: 23, fat: 11, weight: 150 },
      { name: 'Mysore Masala Dosa', price: 55, calories: 185, protein: 4.5, carbs: 27, fat: 7, weight: 150 },
      { name: 'Rava Dosa', price: 45, calories: 110, protein: 2.5, carbs: 19, fat: 3, weight: 100 },
      { name: 'Set Dosa (2 pcs)', price: 50, calories: 140, protein: 3.5, carbs: 26, fat: 2.5, weight: 120 },
      { name: 'Neer Dosa', price: 35, calories: 75, protein: 1.5, carbs: 15, fat: 0.8, weight: 80 },
      { name: 'Ghee Roast Dosa', price: 60, calories: 165, protein: 3, carbs: 20, fat: 8, weight: 100 }
    ]
  },
  
  anc_uthappa: {
    name: 'Uthappa',
    icon: '🥘',
    items: [
      { name: 'Plain Uthappa', price: 40, calories: 110, protein: 3.5, carbs: 18, fat: 3, weight: 100 },
      { name: 'Onion Uthappa', price: 50, calories: 125, protein: 3.8, carbs: 19, fat: 3.5, weight: 110 },
      { name: 'Tomato Uthappa', price: 50, calories: 120, protein: 3.5, carbs: 19, fat: 3.2, weight: 110 },
      { name: 'Mixed Veg Uthappa', price: 60, calories: 140, protein: 4.2, carbs: 21, fat: 4, weight: 120 },
      { name: 'Paneer Uthappa', price: 75, calories: 165, protein: 8, carbs: 18, fat: 7, weight: 130 },
      { name: 'Cheese Uthappa', price: 80, calories: 180, protein: 7, carbs: 17, fat: 9, weight: 130 },
      { name: 'Mushroom Uthappa', price: 70, calories: 135, protein: 5, carbs: 19, fat: 4.5, weight: 120 }
    ]
  },
  
  anc_sandwiches: {
    name: 'Sandwiches',
    icon: '🥪',
    items: [
      { name: 'Veg Sandwich', price: 40, calories: 145, protein: 4, carbs: 22, fat: 5, weight: 120 },
      { name: 'Cheese Sandwich', price: 55, calories: 185, protein: 7, carbs: 21, fat: 8, weight: 130 },
      { name: 'Paneer Sandwich', price: 65, calories: 195, protein: 9, carbs: 20, fat: 9, weight: 140 },
      { name: 'Chicken Sandwich', price: 75, calories: 210, protein: 14, carbs: 19, fat: 9, weight: 150 },
      { name: 'Egg Sandwich', price: 50, calories: 175, protein: 10, carbs: 20, fat: 7, weight: 130 },
      { name: 'Grilled Sandwich', price: 60, calories: 165, protein: 5.5, carbs: 21, fat: 6.5, weight: 130 },
      { name: 'Club Sandwich', price: 85, calories: 240, protein: 10, carbs: 25, fat: 11, weight: 180 },
      { name: 'Veg Burger', price: 55, calories: 195, protein: 5, carbs: 28, fat: 7, weight: 150 },
      { name: 'Chicken Burger', price: 85, calories: 245, protein: 14, carbs: 26, fat: 10, weight: 180 },
      { name: 'Paneer Burger', price: 75, calories: 220, protein: 9, carbs: 25, fat: 9, weight: 170 }
    ]
  },
  
  anc_rolls: {
    name: 'Rolls',
    icon: '🌯',
    items: [
      { name: 'Veg Roll', price: 50, calories: 175, protein: 5, carbs: 24, fat: 7, weight: 150 },
      { name: 'Paneer Roll', price: 75, calories: 260, protein: 10, carbs: 23, fat: 12, weight: 180 },
      { name: 'Chicken Roll', price: 85, calories: 275, protein: 16, carbs: 22, fat: 12, weight: 180 },
      { name: 'Egg Roll', price: 60, calories: 210, protein: 10, carbs: 23, fat: 8, weight: 160 },
      { name: 'Cheese Roll', price: 70, calories: 245, protein: 8, carbs: 22, fat: 12, weight: 170 },
      { name: 'Double Egg Roll', price: 75, calories: 265, protein: 14, carbs: 23, fat: 11, weight: 180 },
      { name: 'Kathi Kabab Roll', price: 95, calories: 290, protein: 18, carbs: 22, fat: 13, weight: 200 },
      { name: 'Veg Frankie', price: 55, calories: 185, protein: 5.5, carbs: 25, fat: 7.5, weight: 160 }
    ]
  },
  
  anc_momos: {
    name: 'Momos',
    icon: '🥟',
    items: [
      { name: 'Veg Momos (6 pcs)', price: 50, calories: 180, protein: 5, carbs: 28, fat: 5, weight: 180 },
      { name: 'Paneer Momos (6 pcs)', price: 70, calories: 220, protein: 9, carbs: 25, fat: 8, weight: 200 },
      { name: 'Chicken Momos (6 pcs)', price: 80, calories: 240, protein: 14, carbs: 24, fat: 8, weight: 200 },
      { name: 'Cheese Momos (6 pcs)', price: 75, calories: 235, protein: 8, carbs: 24, fat: 10, weight: 200 },
      { name: 'Mushroom Momos (6 pcs)', price: 65, calories: 195, protein: 6, carbs: 27, fat: 5.5, weight: 190 },
      { name: 'Fried Veg Momos', price: 60, calories: 240, protein: 5, carbs: 30, fat: 10, weight: 180 },
      { name: 'Fried Chicken Momos', price: 90, calories: 295, protein: 14, carbs: 26, fat: 13, weight: 200 },
      { name: 'Wheat Momos (6 pcs)', price: 55, calories: 165, protein: 5.5, carbs: 29, fat: 3.5, weight: 180 }
    ]
  },
  
  anc_maggi: {
    name: 'Maggi',
    icon: '🍝',
    items: [
      { name: 'Plain Maggi', price: 30, calories: 160, protein: 4, carbs: 24, fat: 6, weight: 100 },
      { name: 'Veg Maggi', price: 40, calories: 175, protein: 4.5, carbs: 25, fat: 6.5, weight: 120 },
      { name: 'Cheese Maggi', price: 55, calories: 220, protein: 7, carbs: 24, fat: 10, weight: 130 },
      { name: 'Paneer Maggi', price: 60, calories: 235, protein: 9, carbs: 23, fat: 11, weight: 140 },
      { name: 'Egg Maggi', price: 50, calories: 210, protein: 9, carbs: 24, fat: 8, weight: 130 },
      { name: 'Double Masala Maggi', price: 40, calories: 185, protein: 4.5, carbs: 26, fat: 7, weight: 110 },
      { name: 'Maggi with Corn', price: 45, calories: 190, protein: 5, carbs: 27, fat: 6.5, weight: 120 },
      { name: 'Spicy Maggi', price: 35, calories: 170, protein: 4, carbs: 25, fat: 6, weight: 100 }
    ]
  },
  
  anc_eggs: {
    name: 'Eggs',
    icon: '🥚',
    items: [
      { name: 'Boiled Egg (2 pcs)', price: 25, calories: 155, protein: 13, carbs: 1, fat: 11, weight: 100 },
      { name: 'Egg Bhurji', price: 45, calories: 195, protein: 12, carbs: 3, fat: 14, weight: 120 },
      { name: 'Omelette', price: 40, calories: 165, protein: 11, carbs: 2, fat: 12, weight: 100 },
      { name: 'Cheese Omelette', price: 60, calories: 235, protein: 14, carbs: 3, fat: 18, weight: 120 },
      { name: 'Bread Omelette', price: 55, calories: 245, protein: 13, carbs: 17, fat: 15, weight: 130 },
      { name: 'Egg Fried Rice', price: 65, calories: 220, protein: 10, carbs: 26, fat: 8, weight: 200 },
      { name: 'Egg Curry', price: 55, calories: 175, protein: 11, carbs: 5, fat: 12, weight: 150 },
      { name: 'Masala Egg', price: 35, calories: 125, protein: 9, carbs: 3, fat: 8, weight: 80 }
    ]
  },
  
  anc_paratha: {
    name: 'Paratha',
    icon: '🫓',
    items: [
      { name: 'Aloo Paratha', price: 40, calories: 210, protein: 4.5, carbs: 28, fat: 9.5, weight: 80 },
      { name: 'Paneer Paratha', price: 65, calories: 270, protein: 9, carbs: 22, fat: 15, weight: 90 },
      { name: 'Gobi Paratha', price: 45, calories: 185, protein: 4.5, carbs: 26, fat: 7.5, weight: 75 },
      { name: 'Mooli Paratha', price: 40, calories: 165, protein: 4, carbs: 25, fat: 6, weight: 70 },
      { name: 'Onion Paratha', price: 40, calories: 175, protein: 4, carbs: 25, fat: 7, weight: 70 },
      { name: 'Mix Veg Paratha', price: 50, calories: 195, protein: 5, carbs: 26, fat: 8, weight: 80 },
      { name: 'Cheese Paratha', price: 70, calories: 285, protein: 9, carbs: 24, fat: 16, weight: 90 },
      { name: 'Plain Paratha', price: 25, calories: 150, protein: 4, carbs: 20, fat: 6.5, weight: 60 },
      { name: 'Lachha Paratha', price: 30, calories: 165, protein: 4, carbs: 22, fat: 7, weight: 65 },
      { name: 'Keema Paratha', price: 85, calories: 295, protein: 15, carbs: 23, fat: 14, weight: 100 }
    ]
  },
  
  anc_chinese: {
    name: 'Chinese',
    icon: '🥡',
    items: [
      { name: 'Veg Manchurian', price: 65, calories: 155, protein: 4.5, carbs: 14, fat: 9, weight: 150 },
      { name: 'Chicken Manchurian', price: 95, calories: 195, protein: 14, carbs: 12, fat: 11, weight: 150 },
      { name: 'Chilli Paneer', price: 85, calories: 220, protein: 10, carbs: 14, fat: 14, weight: 150 },
      { name: 'Chilli Chicken', price: 105, calories: 245, protein: 18, carbs: 12, fat: 14, weight: 150 },
      { name: 'Crispy Corn', price: 55, calories: 145, protein: 3.5, carbs: 20, fat: 6, weight: 100 },
      { name: 'Veg Spring Roll', price: 50, calories: 135, protein: 3, carbs: 18, fat: 6, weight: 80 },
      { name: 'Chicken Spring Roll', price: 70, calories: 165, protein: 9, carbs: 16, fat: 7, weight: 90 },
      { name: 'Hot & Sour Soup', price: 45, calories: 75, protein: 3, carbs: 10, fat: 2.5, weight: 200 },
      { name: 'Manchow Soup', price: 50, calories: 85, protein: 3.5, carbs: 11, fat: 3, weight: 200 },
      { name: 'Sweet Corn Soup', price: 45, calories: 95, protein: 3, carbs: 14, fat: 2.5, weight: 200 }
    ]
  },
  
  anc_pasta: {
    name: 'Pasta',
    icon: '🍝',
    items: [
      { name: 'White Sauce Pasta', price: 75, calories: 245, protein: 8, carbs: 28, fat: 12, weight: 200 },
      { name: 'Red Sauce Pasta', price: 70, calories: 195, protein: 6, carbs: 30, fat: 7, weight: 200 },
      { name: 'Pink Sauce Pasta', price: 80, calories: 220, protein: 7, carbs: 29, fat: 9, weight: 200 },
      { name: 'Pesto Pasta', price: 85, calories: 235, protein: 7, carbs: 26, fat: 12, weight: 200 },
      { name: 'Arrabbiata Pasta', price: 75, calories: 185, protein: 6, carbs: 31, fat: 5, weight: 200 },
      { name: 'Alfredo Pasta', price: 90, calories: 265, protein: 9, carbs: 25, fat: 15, weight: 200 },
      { name: 'Mac & Cheese', price: 85, calories: 285, protein: 11, carbs: 28, fat: 15, weight: 200 },
      { name: 'Baked Pasta', price: 95, calories: 295, protein: 12, carbs: 27, fat: 16, weight: 200 },
      { name: 'Veg Pasta', price: 65, calories: 175, protein: 5.5, carbs: 29, fat: 5.5, weight: 200 }
    ]
  },
  
  anc_chaat: {
    name: 'Chaat',
    icon: '🥗',
    items: [
      { name: 'Pani Puri (8 pcs)', price: 40, calories: 160, protein: 2, carbs: 32, fat: 2, weight: 120 },
      { name: 'Dahi Puri', price: 50, calories: 185, protein: 5, carbs: 28, fat: 6, weight: 150 },
      { name: 'Bhel Puri', price: 45, calories: 155, protein: 3, carbs: 28, fat: 4, weight: 120 },
      { name: 'Sev Puri', price: 45, calories: 175, protein: 3.5, carbs: 26, fat: 7, weight: 100 },
      { name: 'Dahi Bhalla', price: 55, calories: 195, protein: 6, carbs: 25, fat: 8, weight: 150 },
      { name: 'Aloo Tikki', price: 40, calories: 165, protein: 3, carbs: 22, fat: 7, weight: 100 },
      { name: 'Papdi Chaat', price: 50, calories: 180, protein: 4, carbs: 26, fat: 7, weight: 120 },
      { name: 'Samosa Chaat', price: 55, calories: 235, protein: 5, carbs: 28, fat: 11, weight: 150 },
      { name: 'Ragda Patties', price: 55, calories: 210, protein: 6, carbs: 28, fat: 8, weight: 150 },
      { name: 'Fruit Chaat', price: 45, calories: 95, protein: 1.5, carbs: 22, fat: 0.5, weight: 150 }
    ]
  },
  
  anc_addons: {
    name: 'Add-ons',
    icon: '➕',
    items: [
      { name: 'Extra Cheese', price: 15, calories: 90, protein: 6, carbs: 1, fat: 7, weight: 20 },
      { name: 'Extra Paneer', price: 25, calories: 85, protein: 6, carbs: 2, fat: 6, weight: 40 },
      { name: 'Extra Egg', price: 15, calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, weight: 50 },
      { name: 'Extra Chicken', price: 35, calories: 110, protein: 18, carbs: 0, fat: 4, weight: 80 },
      { name: 'Mayonnaise', price: 10, calories: 95, protein: 0.2, carbs: 0.5, fat: 10, weight: 15 },
      { name: 'Ketchup', price: 5, calories: 20, protein: 0.2, carbs: 5, fat: 0, weight: 20 },
      { name: 'Green Chutney', price: 5, calories: 15, protein: 0.5, carbs: 2, fat: 0.5, weight: 20 },
      { name: 'Extra Butter', price: 10, calories: 100, protein: 0, carbs: 0, fat: 11, weight: 15 },
      { name: 'Cold Drink (300ml)', price: 35, calories: 120, protein: 0, carbs: 30, fat: 0, weight: 300 },
      { name: 'Mineral Water', price: 20, calories: 0, protein: 0, carbs: 0, fat: 0, weight: 500 }
    ]
  },
  
  anc_other: {
    name: 'Other',
    icon: '🍽️',
    items: [
      { name: 'French Fries', price: 50, calories: 195, protein: 2.5, carbs: 25, fat: 10, weight: 100 },
      { name: 'Peri Peri Fries', price: 60, calories: 210, protein: 2.5, carbs: 26, fat: 11, weight: 100 },
      { name: 'Cheese Fries', price: 75, calories: 285, protein: 7, carbs: 25, fat: 17, weight: 120 },
      { name: 'Veg Cutlet', price: 35, calories: 125, protein: 3, carbs: 16, fat: 5.5, weight: 60 },
      { name: 'Paneer Cutlet', price: 55, calories: 175, protein: 8, carbs: 14, fat: 9, weight: 70 },
      { name: 'Chicken Cutlet', price: 65, calories: 195, protein: 14, carbs: 13, fat: 10, weight: 80 },
      { name: 'Veg Pakora', price: 40, calories: 145, protein: 3, carbs: 16, fat: 8, weight: 80 },
      { name: 'Paneer Pakora', price: 60, calories: 205, protein: 9, carbs: 15, fat: 12, weight: 90 },
      { name: 'Onion Rings', price: 45, calories: 165, protein: 2, carbs: 18, fat: 9, weight: 80 },
      { name: 'Garlic Bread', price: 55, calories: 185, protein: 5, carbs: 24, fat: 8, weight: 80 }
    ]
  }
};

// Get all ANC categories
function getAllAncCategories() {
  return Object.keys(ANC_MENU);
}

// Get items for a specific category
function getAncItems(category) {
  const cat = ANC_MENU[category];
  if (!cat) return [];
  return cat.items.map(item => ({
    ...item,
    category: cat.name,
    categoryIcon: cat.icon
  }));
}

// Get category info
function getAncCategoryInfo(category) {
  const cat = ANC_MENU[category];
  if (!cat) return null;
  return {
    key: category,
    name: cat.name,
    icon: cat.icon
  };
}

// Search ANC items
function searchAncItems(query) {
  const lowerQuery = query.toLowerCase();
  const results = [];
  
  Object.entries(ANC_MENU).forEach(([key, category]) => {
    category.items.forEach(item => {
      if (item.name.toLowerCase().includes(lowerQuery)) {
        results.push({
          ...item,
          category: category.name,
          categoryIcon: category.icon,
          categoryKey: key
        });
      }
    });
  });
  
  return results;
}

// Get all ANC items (flattened)
function getAllAncItems() {
  const allItems = [];
  Object.entries(ANC_MENU).forEach(([key, category]) => {
    category.items.forEach(item => {
      allItems.push({
        ...item,
        category: category.name,
        categoryIcon: category.icon,
        categoryKey: key
      });
    });
  });
  return allItems;
}

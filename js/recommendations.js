/**
 * Campus Calories v2.0 - Recommendation Engine
 * Smart food recommendations based on time, nutrition goals, and availability
 */

// ==================== VENDING MACHINE ITEMS (Agrawal) ====================
const VENDING_ITEMS = [
  {
    name: 'Max Protein Chips - Cheese',
    price: 45,
    calories: 140,
    protein: 10,
    carbs: 12,
    fat: 6,
    weight: 30,
    source: 'Vending Machine / Agrawal'
  },
  {
    name: 'Max Protein Chips - Peri Peri',
    price: 45,
    calories: 140,
    protein: 10,
    carbs: 12,
    fat: 6,
    weight: 30,
    source: 'Vending Machine / Agrawal'
  },
  {
    name: 'Max Protein Chips - Sour Cream',
    price: 45,
    calories: 140,
    protein: 10,
    carbs: 12,
    fat: 6,
    weight: 30,
    source: 'Vending Machine / Agrawal'
  },
  {
    name: 'Super You Protein Bar - Chocolate',
    price: 60,
    calories: 220,
    protein: 15,
    carbs: 18,
    fat: 8,
    weight: 50,
    source: 'Vending Machine / Agrawal'
  },
  {
    name: 'Super You Protein Bar - Peanut Butter',
    price: 60,
    calories: 230,
    protein: 16,
    carbs: 17,
    fat: 9,
    weight: 50,
    source: 'Vending Machine / Agrawal'
  },
  {
    name: 'Epigamia Greek Yogurt - Natural',
    price: 60,
    calories: 110,
    protein: 10,
    carbs: 8,
    fat: 4,
    weight: 90,
    source: 'Vending Machine / Agrawal'
  },
  {
    name: 'Epigamia Greek Yogurt - Strawberry',
    price: 65,
    calories: 125,
    protein: 9,
    carbs: 14,
    fat: 4,
    weight: 90,
    source: 'Vending Machine / Agrawal'
  },
  {
    name: 'YogaBar Protein Bar',
    price: 55,
    calories: 210,
    protein: 12,
    carbs: 20,
    fat: 8,
    weight: 45,
    source: 'Vending Machine / Agrawal'
  },
  {
    name: 'RiteBite Max Protein Bar',
    price: 50,
    calories: 195,
    protein: 11,
    carbs: 18,
    fat: 7,
    weight: 40,
    source: 'Vending Machine / Agrawal'
  },
  {
    name: 'Nature Valley Protein Bar',
    price: 55,
    calories: 190,
    protein: 10,
    carbs: 22,
    fat: 6,
    weight: 42,
    source: 'Vending Machine / Agrawal'
  }
];

// ==================== HIGH PROTEIN ANC RECOMMENDATIONS ====================
const HIGH_PROTEIN_ANC = [
  { name: 'Boiled Egg (2 pcs)', category: 'anc_eggs', proteinPerRupee: 0.52, reason: 'Best protein value' },
  { name: 'Chicken Momos (6 pcs)', category: 'anc_momos', proteinPerRupee: 0.18, reason: 'High protein snack' },
  { name: 'Paneer Roll', category: 'anc_rolls', proteinPerRupee: 0.13, reason: 'Protein rich' },
  { name: 'Chicken Roll', category: 'anc_rolls', proteinPerRupee: 0.19, reason: 'High protein meal' },
  { name: 'Egg Roll', category: 'anc_rolls', proteinPerRupee: 0.17, reason: 'Budget protein' },
  { name: 'Paneer Paratha', category: 'anc_paratha', proteinPerRupee: 0.14, reason: 'Vegetarian protein' },
  { name: 'Keema Paratha', category: 'anc_paratha', proteinPerRupee: 0.18, reason: 'High protein paratha' },
  { name: 'Chicken Biryani', category: 'anc_rice', proteinPerRupee: 0.11, reason: 'Protein rich rice' }
];

// ==================== RECOMMENDATION ENGINE ====================
const RecommendationEngine = {
  // Get current time-based recommendations
  getRecommendations(userProfile, dailyTotals) {
    const recommendations = [];
    const currentMeal = getCurrentMealType();
    const nextMeal = this.getNextMealType();
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const timeInMinutes = hour * 60 + minutes;
    
    // 1. Mess Meal Recommendation (if approaching meal time)
    const messRec = this.getMessRecommendation(currentMeal, nextMeal, timeInMinutes);
    if (messRec) {
      recommendations.push(messRec);
    }
    
    // 2. ANC High Protein Recommendations
    const ancRecs = this.getANCBudgetRecommendations(2);
    recommendations.push(...ancRecs);
    
    // 3. Vending Machine Recommendations
    const vendingRecs = this.getVendingRecommendations(2);
    recommendations.push(...vendingRecs);
    
    // Return only 5 recommendations
    return recommendations.slice(0, 5);
  },
  
  // Get mess meal recommendation based on timing
  getMessRecommendation(currentMeal, nextMeal, timeInMinutes) {
    if (!nextMeal) return null;
    
    const nextSlot = MESS_TIME_SLOTS[nextMeal];
    const timeUntilNext = nextSlot.start - timeInMinutes;
    
    // If next meal is within 60 minutes
    if (timeUntilNext > 0 && timeUntilNext <= 60) {
      const menu = getCurrentDayMenu(nextMeal);
      
      // Find highest protein item
      let bestItem = null;
      let maxProtein = 0;
      
      menu.forEach(item => {
        const nutrition = getItemNutrition(item);
        if (nutrition.protein > maxProtein) {
          maxProtein = nutrition.protein;
          bestItem = item;
        }
      });
      
      if (bestItem) {
        const nutrition = getItemNutrition(bestItem);
        return {
          type: 'mess',
          title: `${nextSlot.label} opens in ${timeUntilNext} min`,
          subtitle: 'Highest protein option',
          name: bestItem.name,
          calories: nutrition.calories,
          protein: nutrition.protein,
          section: bestItem.section,
          badge: 'Mess',
          badgeColor: '#0066EE',
          action: 'Add to Log'
        };
      }
    }
    
    return null;
  },
  
  // Get ANC budget-friendly high protein items
  getANCBudgetRecommendations(count) {
    const recs = [];
    
    // Get 2 boiled eggs recommendation (always good value)
    const eggItem = getAncItems('anc_eggs').find(i => i.name === 'Boiled Egg (2 pcs)');
    if (eggItem) {
      recs.push({
        type: 'anc',
        title: 'Evening Snack Suggestion',
        subtitle: 'High protein, low cost',
        name: eggItem.name,
        calories: eggItem.calories,
        protein: eggItem.protein,
        price: eggItem.price,
        weight: eggItem.weight,
        badge: 'ANC',
        badgeColor: '#FF9800',
        action: 'Add to Log'
      });
    }
    
    // Get another high protein item
    const paneerRoll = getAncItems('anc_rolls').find(i => i.name === 'Paneer Roll');
    if (paneerRoll) {
      recs.push({
        type: 'anc',
        title: 'Protein Rich Option',
        subtitle: 'Vegetarian protein source',
        name: paneerRoll.name,
        calories: paneerRoll.calories,
        protein: paneerRoll.protein,
        price: paneerRoll.price,
        weight: paneerRoll.weight,
        badge: 'ANC',
        badgeColor: '#FF9800',
        action: 'Add to Log'
      });
    }
    
    return recs;
  },
  
  // Get vending machine recommendations
  getVendingRecommendations(count) {
    const recs = [];
    
    // Sort by protein per rupee
    const sortedItems = [...VENDING_ITEMS].sort((a, b) => {
      const aRatio = a.protein / a.price;
      const bRatio = b.protein / b.price;
      return bRatio - aRatio;
    });
    
    // Pick top items
    for (let i = 0; i < Math.min(count, sortedItems.length); i++) {
      const item = sortedItems[i];
      recs.push({
        type: 'vending',
        title: 'Quick Protein Snack',
        subtitle: item.source,
        name: item.name,
        calories: item.calories,
        protein: item.protein,
        price: item.price,
        weight: item.weight,
        badge: 'Vending',
        badgeColor: '#4CAF50',
        action: 'Add to Log'
      });
    }
    
    return recs;
  },
  
  // Get next meal type
  getNextMealType() {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    
    for (const [meal, slot] of Object.entries(MESS_TIME_SLOTS)) {
      if (minutes < slot.start) {
        return meal;
      }
    }
    
    return 'breakfast'; // Next day
  },
  
  // Rotate recommendations every 4 hours
  shouldRotateRecommendations() {
    const now = new Date();
    const hour = now.getHours();
    return hour % 4 === 0;
  }
};

// ==================== RENDER RECOMMENDATIONS ====================
function renderRecommendations() {
  const container = document.getElementById('recommendations-container');
  if (!container) return;
  
  const recommendations = RecommendationEngine.getRecommendations();
  
  if (recommendations.length === 0) {
    container.innerHTML = '<p class="no-recommendations">No recommendations at this time</p>';
    return;
  }
  
  container.innerHTML = recommendations.map((rec, index) => `
    <div class="recommendation-card" data-type="${rec.type}" data-index="${index}">
      <div class="recommendation-header">
        <span class="recommendation-title">${rec.title}</span>
        <span class="recommendation-badge" style="background: ${rec.badgeColor}">${rec.badge}</span>
      </div>
      <p class="recommendation-subtitle">${rec.subtitle}</p>
      <div class="recommendation-item">
        <div class="recommendation-info">
          <span class="recommendation-name">${rec.name}</span>
          <span class="recommendation-weight">${rec.weight}g</span>
        </div>
        <div class="recommendation-stats">
          <span class="stat-calories">${rec.calories} kcal</span>
          <span class="stat-protein">${rec.protein}g protein</span>
          ${rec.price ? `<span class="stat-price">₹${rec.price}</span>` : ''}
        </div>
      </div>
      <button class="btn btn-primary btn-sm btn-add-rec" data-index="${index}">
        ${rec.action}
      </button>
    </div>
  `).join('');
  
  // Add click handlers
  container.querySelectorAll('.btn-add-rec').forEach(btn => {
    btn.addEventListener('click', () => addRecommendationToLog(parseInt(btn.dataset.index)));
  });
}

async function addRecommendationToLog(index) {
  const recommendations = RecommendationEngine.getRecommendations();
  const rec = recommendations[index];
  
  if (!rec) return;
  
  await addFoodEntry({
    name: rec.name,
    category: rec.type === 'vending' ? 'packaged' : rec.type,
    calories: rec.calories,
    protein: rec.protein,
    carbs: 0,
    fat: 0,
    date: AppState.selectedDate,
    portion: rec.weight ? `${rec.weight}g` : '1 serving',
    price: rec.price || 0,
    timestamp: Date.now()
  });
  
  showToast(`${rec.name} added to log`, 'success');
  await loadDailyLog();
}

// Initialize recommendations on page load
document.addEventListener('DOMContentLoaded', () => {
  // Render recommendations after a short delay to ensure data is loaded
  setTimeout(renderRecommendations, 500);
  
  // Refresh recommendations every 4 hours
  setInterval(() => {
    if (RecommendationEngine.shouldRotateRecommendations()) {
      renderRecommendations();
    }
  }, 60 * 60 * 1000); // Check every hour
});

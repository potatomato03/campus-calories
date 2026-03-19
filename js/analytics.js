/**
 * Campus Calories v2.0 - Analytics & Streaks Module
 */

let analyticsData = {
  currentStreak: 0,
  bestStreak: 0,
  avgCalories: 0,
  avgProtein: 0,
  achievements: {
    firstGoal: false,
    streak3: false,
    streak7: false,
    streak30: false
  }
};
window.analyticsData = analyticsData;

/**
 * Main initialization for the Analytics view
 */
window.initAnalytics = async function() {
  // Update UI with defaults first
  updateAnalyticsUI();

  if (!AppState.userProfile) return;

  try {
    const summaryData = await getWeeklyAnalytics();

    if (summaryData && summaryData.length > 0) {
      calculateStreaks(summaryData);
      calculateAverages(summaryData);
      checkAchievements();
      updateAnalyticsUI();
    } else {
      // For guest users or users with no data, try showing local data
      await initAnalyticsFromLocalData();
    }
  } catch (error) {
    console.error('Failed to load analytics:', error);
    // Try local data as fallback
    await initAnalyticsFromLocalData();
  }
}

/**
 * Fallback analytics from local IndexedDB for guest users
 */
async function initAnalyticsFromLocalData() {
  try {
    const today = new Date();
    let streak = 0;
    let totalCalories = 0;
    let totalProtein = 0;
    let daysWithData = 0;

    // Check last 7 days for averages and streak
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Use database.js function if available
      if (typeof getFoodEntriesByDate === 'function') {
        const entries = await getFoodEntriesByDate(dateStr);

        if (entries && entries.length > 0) {
          if (i < 7) {
            daysWithData++;
            entries.forEach(e => {
              totalCalories += e.calories || 0;
              totalProtein += e.protein || 0;
            });
          }
          // Count streak
          if (streak === i) {
            streak++;
          }
        } else if (i === 0) {
          // Today has no entries, that's okay
          continue;
        } else if (streak === i) {
          // Streak broken
          break;
        }
      }
    }

    analyticsData.currentStreak = streak;
    analyticsData.avgCalories = daysWithData > 0 ? Math.round(totalCalories / daysWithData) : 0;
    analyticsData.avgProtein = daysWithData > 0 ? Math.round(totalProtein / daysWithData) : 0;

    checkAchievements();
    updateAnalyticsUI();
  } catch (error) {
    console.error('Local analytics fallback failed:', error);
  }
}

/**
 * Calculates current consecutive streak of hitting goals
 * backwards from today.
 */
function calculateStreaks(summaries) {
  let streak = 0;
  
  // Sort descending by date (newest first)
  const sorted = summaries.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Check if today is logged and successful
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = sorted.find(s => s.date === todayStr);

  let checkDate = new Date();
  
  // If today isn't logged or goal wasn't hit, check if yesterday was. 
  // If neither, streak is 0.
  
  for (const summary of sorted) {
    const summaryDate = new Date(summary.date);
    
    // Check if the user stayed under or equal to their calorie goal
    const hitGoal = summary.total_calories <= summary.calorie_goal && summary.total_calories > 0;
    
    if (hitGoal) {
      streak++;
    } else {
      break; // Streak broken
    }
  }

  analyticsData.currentStreak = streak;
  analyticsData.bestStreak = Math.max(analyticsData.bestStreak, streak);
}

/**
 * Calculates weekly averages
 */
function calculateAverages(summaries) {
  if (summaries.length === 0) return;

  const sumCals = summaries.reduce((acc, curr) => acc + curr.total_calories, 0);
  const sumProt = summaries.reduce((acc, curr) => acc + curr.total_protein, 0);

  analyticsData.avgCalories = Math.round(sumCals / summaries.length);
  analyticsData.avgProtein = Math.round(sumProt / summaries.length);
}

/**
 * Evaluates which achievements the user has unlocked
 */
function checkAchievements() {
  if (analyticsData.currentStreak >= 1 || analyticsData.bestStreak >= 1) {
    analyticsData.achievements.firstGoal = true;
  }
  if (analyticsData.currentStreak >= 3 || analyticsData.bestStreak >= 3) {
    analyticsData.achievements.streak3 = true;
  }
  if (analyticsData.currentStreak >= 7 || analyticsData.bestStreak >= 7) {
    analyticsData.achievements.streak7 = true;
  }
  if (analyticsData.currentStreak >= 30 || analyticsData.bestStreak >= 30) {
    analyticsData.achievements.streak30 = true;
  }
}

/**
 * Renders the data to the DOM
 */
function updateAnalyticsUI() {
  const streakEl = document.getElementById('current-streak');
  const avgCalEl = document.getElementById('avg-calories');
  const avgProtEl = document.getElementById('avg-protein');

  if (streakEl) streakEl.textContent = `${analyticsData.currentStreak} Days`;
  if (avgCalEl) avgCalEl.textContent = analyticsData.avgCalories || '--';
  if (avgProtEl) avgProtEl.textContent = analyticsData.avgProtein || '--';

  // Update Badges
  const firstBadge = document.getElementById('badge-first-goal');
  const streak3Badge = document.getElementById('badge-streak-3');
  const streak7Badge = document.getElementById('badge-streak-7');
  const streak30Badge = document.getElementById('badge-streak-30');

  if (analyticsData.achievements.firstGoal && firstBadge) {
    firstBadge.classList.remove('locked');
  }
  if (analyticsData.achievements.streak3 && streak3Badge) {
    streak3Badge.classList.remove('locked');
  }
  if (analyticsData.achievements.streak7 && streak7Badge) {
    streak7Badge.classList.remove('locked');
  }
  if (analyticsData.achievements.streak30 && streak30Badge) {
    streak30Badge.classList.remove('locked');
  }
}

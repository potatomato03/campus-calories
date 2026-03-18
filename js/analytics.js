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
    streak7: false
  }
};
window.analyticsData = analyticsData;

/**
 * Main initialization for the Analytics view
 */
window.initAnalytics = async function() {
  if (!AppState.userProfile) return;

  try {
    const summaryData = await getWeeklyAnalytics();
    
    if (summaryData && summaryData.length > 0) {
      calculateStreaks(summaryData);
      calculateAverages(summaryData);
      checkAchievements();
      updateAnalyticsUI();
    }
  } catch (error) {
    console.error('Failed to load analytics:', error);
    showToast('Failed to load analytics data', 'error');
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
}

/**
 * Renders the data to the DOM
 */
function updateAnalyticsUI() {
  document.getElementById('current-streak').textContent = `${analyticsData.currentStreak} Days`;
  document.getElementById('avg-calories').textContent = analyticsData.avgCalories || 0;
  document.getElementById('avg-protein').textContent = analyticsData.avgProtein || 0;

  // Update Badges
  const firstBadge = document.getElementById('badge-first-goal');
  const streak3Badge = document.getElementById('badge-streak-3');
  const streak7Badge = document.getElementById('badge-streak-7');

  if (analyticsData.achievements.firstGoal && firstBadge) {
    firstBadge.classList.remove('locked');
  }
  if (analyticsData.achievements.streak3 && streak3Badge) {
    streak3Badge.classList.remove('locked');
  }
  if (analyticsData.achievements.streak7 && streak7Badge) {
    streak7Badge.classList.remove('locked');
  }
}

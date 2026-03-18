/**
 * Campus Calories v2.0 - Authentication Module
 * Supabase OAuth and session management + cloud sync
 */

// ==================== AUTH FUNCTIONS ====================

async function signUpWithEmail(email, password, fullName) {
  const client = getSupabase();
  if (!client) {
    showToast('Cloud features not configured', 'error');
    return;
  }

  try {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) throw error;
    
    if (data.session) {
      showToast('Signed up successfully!', 'success');
      // showScreen('onboarding-screen') will be handled by the auth state change listener automatically
    } else {
      showToast('Please check your email to verify your account.', 'info');
    }
  } catch (err) {
    console.error('Sign up error:', err);
    showAuthError('Sign up failed: ' + err.message);
  }
}

async function signInWithEmail(email, password) {
  const client = getSupabase();
  if (!client) {
    showToast('Cloud features not configured', 'error');
    return;
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    showToast('Logged in successfully', 'success');
  } catch (err) {
    console.error('Sign in error:', err);
    showAuthError('Login failed: ' + err.message);
  }
}

function showAuthError(msg) {
  const errDiv = document.getElementById('auth-error');
  if (errDiv) {
    errDiv.textContent = msg;
    errDiv.classList.remove('hidden');
    setTimeout(() => errDiv.classList.add('hidden'), 5000);
  } else {
    showToast(msg, 'error');
  }
}

async function signOutUser() {
  const client = getSupabase();
  if (!client) return;

  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;

    AppState.authUser = null;
    updateAuthUI(null);
    showToast('Signed out successfully', 'success');
  } catch (err) {
    console.error('Sign out error:', err);
    showToast('Sign out failed', 'error');
  }
}

async function getAuthSession() {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data: { session } } = await client.auth.getSession();
    return session;
  } catch {
    return null;
  }
}

async function getAuthUser() {
  const session = await getAuthSession();
  return session?.user || null;
}

function setupAuthListener() {
      const client = getSupabase();
  if (!client) return;

  client.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth state changed:', event);

    if (event === 'SIGNED_IN' && session) {
      AppState.authUser = session.user;
      await syncProfileFromCloud(session.user.id);
      
      // Navigate to app if coming from auth screen
      if (document.getElementById('auth-screen') && !document.getElementById('auth-screen').classList.contains('hidden')) {
        if (AppState.userProfile && AppState.userProfile.onboardingCompleted) {
          showScreen('dashboard-screen');
          await loadDailyLog();
        } else {
          showScreen('onboarding-screen');
        }
      }
    } else if (event === 'SIGNED_OUT') {
      AppState.authUser = null;
      AppState.userProfile = null;
      showScreen('auth-screen');
    }
  });
}

// Removed updateAuthUI as auth screen replaces toggling auth button visibility

// ==================== CLOUD SYNC ====================

async function syncProfileToCloud(profile) {
  const client = getSupabase();
  const user = AppState.authUser;
  if (!client || !user) return;

  try {
    const { error } = await client.from('user_profiles').upsert({
      id: user.id,
      gender: profile.gender,
      age: profile.age,
      weight: profile.weight,
      height: profile.height,
      activity_level: profile.activity,
      goal_mode: profile.goalMode || 'maintenance',
      daily_calorie_goal: profile.dailyCalorieGoal,
      daily_protein_goal: profile.dailyProteinGoal,
      custom_calories: profile.customCalories || null,
      custom_protein: profile.customProtein || null,
      onboarding_completed: profile.onboardingCompleted || false,
      updated_at: new Date().toISOString()
    });

    if (error) throw error;
    console.log('Profile synced to cloud');
  } catch (err) {
    console.error('Profile sync failed:', err);
  }
}

async function syncProfileFromCloud(userId) {
  const client = getSupabase();
  if (!client) return;

  try {
    const { data, error } = await client.from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found

    if (data) {
      const localProfile = {
        id: 'current',
        gender: data.gender,
        age: data.age,
        weight: data.weight,
        height: data.height,
        activity: data.activity_level,
        goalMode: data.goal_mode,
        dailyCalorieGoal: data.daily_calorie_goal,
        dailyProteinGoal: data.daily_protein_goal,
        customCalories: data.custom_calories,
        customProtein: data.custom_protein,
        onboardingCompleted: data.onboarding_completed,
        updatedAt: data.updated_at
      };

      await saveUserProfile(localProfile);
      AppState.userProfile = localProfile;
      console.log('Profile loaded from cloud');
    }
  } catch (err) {
    console.error('Failed to load cloud profile:', err);
  }
}

async function syncFoodEntryToCloud(entry) {
  const client = getSupabase();
  const user = AppState.authUser;
  if (!client || !user) return;

  try {
    const { error } = await client.from('daily_logs').insert({
      user_id: user.id,
      date: entry.date,
      name: entry.name,
      category: entry.category,
      calories: entry.calories || 0,
      protein: entry.protein || 0,
      carbs: entry.carbs || 0,
      fat: entry.fat || 0,
      portion: entry.portion,
      logged_at: new Date().toISOString()
    });

    if (error) throw error;
    console.log('Food entry synced to cloud');

    // Update daily summary
    await updateCloudDailySummary(entry.date);
  } catch (err) {
    console.error('Food entry sync failed:', err);
  }
}

async function updateCloudDailySummary(date) {
  const client = getSupabase();
  const user = AppState.authUser;
  if (!client || !user) return;

  try {
    const { data: entries, error: fetchError } = await client.from('daily_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date);

    if (fetchError) throw fetchError;

    const totals = (entries || []).reduce((acc, e) => ({
      total_calories: acc.total_calories + (e.calories || 0),
      total_protein: acc.total_protein + (e.protein || 0),
      total_carbs: acc.total_carbs + (e.carbs || 0),
      total_fat: acc.total_fat + (e.fat || 0),
      meal_count: acc.meal_count + 1
    }), { total_calories: 0, total_protein: 0, total_carbs: 0, total_fat: 0, meal_count: 0 });

    const profile = AppState.userProfile;

    const { error } = await client.from('daily_summaries').upsert({
      user_id: user.id,
      date: date,
      ...totals,
      calorie_goal: profile?.dailyCalorieGoal || profile?.calculatedCalories || 2000,
      protein_goal: profile?.dailyProteinGoal || profile?.calculatedProtein || 50,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,date'
    });

    if (error) throw error;
  } catch (err) {
    console.error('Daily summary update failed:', err);
  }
}

// ==================== ANALYTICS ====================

async function getWeeklyAnalytics() {
  const client = getSupabase();
  const user = AppState.authUser;
  if (!client || !user) return null;

  try {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data, error } = await client.from('daily_summaries')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', weekAgo.toISOString().split('T')[0])
      .lte('date', today.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Weekly analytics failed:', err);
    return null;
  }
}

async function getMonthlyAnalytics() {
  const client = getSupabase();
  const user = AppState.authUser;
  if (!client || !user) return null;

  try {
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);

    const { data, error } = await client.from('daily_summaries')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', monthAgo.toISOString().split('T')[0])
      .lte('date', today.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Monthly analytics failed:', err);
    return null;
  }
}

async function getAnalyticsByRange(startDate, endDate) {
  const client = getSupabase();
  const user = AppState.authUser;
  if (!client || !user) return null;

  try {
    const { data, error } = await client.from('daily_summaries')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Analytics query failed:', err);
    return null;
  }
}

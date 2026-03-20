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
    if (err.status === 429 || err.message.toLowerCase().includes('rate limit')) {
      showAuthError('Email rate limit exceeded. Please try again later or Continue as Guest.');
    } else {
      showAuthError('Sign up failed: ' + err.message);
    }
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

async function signInAsGuest() {
  AppState.authUser = { id: 'guest', isGuest: true, email: 'guest@local' };
  localStorage.setItem('guestMode', 'true');
  
  // Check if we have a local profile saved
  const profile = await getUserProfile();
  
  if (profile && profile.onboardingCompleted) {
    AppState.userProfile = profile;
    showScreen('dashboard-screen');
    if (typeof loadDailyLog === 'function') {
      await loadDailyLog();
    }
  } else {
    showScreen('onboarding-screen');
  }
  showToast('Continuing as Guest (Offline Mode)', 'success');
}

async function signInWithGoogle() {
  const client = getSupabase();
  if (!client) {
    showToast('Cloud features not configured', 'error');
    return;
  }

  try {
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) throw error;
    console.log('Google sign-in initiated');
  } catch (err) {
    console.error('Google sign-in error:', err);
    showAuthError('Google sign-in failed: ' + err.message);
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
  if (AppState.authUser?.isGuest || localStorage.getItem('guestMode') === 'true') {
    AppState.authUser = null;
    AppState.userProfile = null;
    localStorage.removeItem('guestMode');
    showScreen('auth-screen');
    showToast('Signed out successfully', 'success');
    return;
  }

  const client = getSupabase();
  if (!client) return;

  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;

    AppState.authUser = null;
    showToast('Signed out successfully', 'success');
  } catch (err) {
    console.error('Sign out error:', err);
    showToast('Sign out failed', 'error');
  }
}

async function getAuthSession() {
  if (localStorage.getItem('guestMode') === 'true') {
    return { user: { id: 'guest', isGuest: true, email: 'guest@local' } };
  }

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
      
      if (typeof processSyncQueue === 'function') processSyncQueue();
      
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
  if (!client || !user || user.isGuest) return;

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
    throw err;
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
  if (!client || !user || user.isGuest) return;

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
    throw err;
  }
}

async function updateCloudDailySummary(date) {
  const client = getSupabase();
  const user = AppState.authUser;
  if (!client || !user || user.isGuest) return;

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
  if (!client || !user || user.isGuest) return null;

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
  if (!client || !user || user.isGuest) return null;

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

// ==================== BACKGROUND SYNC QUEUE ====================

async function processSyncQueue() {
  if (!navigator.onLine) return;
  const user = AppState.authUser;
  if (!user || user.isGuest) return;
  
  if (typeof getSyncQueue !== 'function') return;
  
  try {
    const queue = await getSyncQueue();
    if (!queue || queue.length === 0) return;
    
    console.log(`Processing ${queue.length} offline sync items...`);
    
    for (const item of queue) {
      try {
        if (item.action === 'ADD_FOOD') {
          await syncFoodEntryToCloud(item.payload);
        } else if (item.action === 'UPDATE_PROFILE') {
          await syncProfileToCloud(item.payload);
        }
        await removeFromSyncQueue(item.id);
      } catch (err) {
        console.warn('Sync queue item failed, keeping for later:', err);
      }
    }
  } catch (err) {
    console.error('Error processing sync queue:', err);
  }
}

window.addEventListener('online', processSyncQueue);

/**
 * Campus Calories v2.0 - Main Application
 * Core application logic and UI controllers
 */

// ==================== APP STATE ====================
const AppState = {
  currentView: 'dashboard',
  selectedDate: new Date().toISOString().split('T')[0],
  userProfile: null,
  dailyTotals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  selectedItems: new Map(),
  plateSelections: { L1: [], L2: [], L3: [], L4: [] },
  currentMealType: 'breakfast',
  currentAncCategory: null,
  currentL4Tab: 'rice',
  selectedRice: null,
  selectedBreads: new Map(),
  riceGrams: 250,
  onboardingStep: 1,
  tempProfile: { goalMode: 'maintenance' },
  geminiApiKey: null,
  authUser: null
};

// ==================== TDEE CONSTANTS ====================
const TDEE_CONSTANTS = {
  bmrMaleMultiplier: 5,
  bmrFemaleMultiplier: -161,
  activityMultipliers: {
    lite: 1.375,
    moderate: 1.55,
    pro: 1.725
  },
  // Goal-based calorie adjustments from maintenance TDEE
  goalCalorieAdjustment: {
    cutting: -500,      // ~0.45 kg/week fat loss
    maintenance: 0,
    bulking: 300         // Lean bulk surplus
  },
  // Evidence-based protein per kg bodyweight by goal (g/kg)
  // Cutting: high protein preserves lean mass during deficit (Helms et al., 2014)
  // Maintenance: RDA-aligned for general health + active lifestyle
  // Bulking: adequate for muscle protein synthesis in caloric surplus
  proteinPerKg: {
    cutting: 2.0,
    maintenance: 1.0,
    bulking: 1.6
  },
  // Minimum safe daily calorie floors
  minCalories: {
    male: 1500,
    female: 1200
  }
};

// ==================== DOM ELEMENTS CACHE ====================
const DOM = {};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', initApp);

async function initApp() {
  console.log('Initializing Campus Calories v2.0...');

  try {
    await initDatabase();
    initSupabase();
    cacheDOMElements();
    setupEventListeners();

    // Setup auth listener BEFORE checking session - critical for OAuth callbacks
    setupAuthListener();

    // Check auth state
    const session = await getAuthSession();
    if (session) {
      AppState.authUser = session.user;
    } else {
      // Not authenticated, MUST login
      showScreen('auth-screen');
      return;
    }

    AppState.userProfile = await getUserProfile();

    const hasCompleted = await hasCompletedOnboarding();

    if (!hasCompleted || !AppState.userProfile) {
      showScreen('onboarding-screen');
    } else {
      showScreen('dashboard-screen');
      await loadDailyLog();
      // Load API Key
      AppState.geminiApiKey = await getSetting('geminiApiKey');
    }

    await initializeMessMenuData();

    console.log('App initialized successfully');
  } catch (error) {
    console.error('App initialization failed:', error);
    showToast('Failed to initialize app', 'error');
  }
}

function cacheDOMElements() {
  // Screens
  DOM.authScreen = document.getElementById('auth-screen');
  DOM.onboardingScreen = document.getElementById('onboarding-screen');
  DOM.dashboardScreen = document.getElementById('dashboard-screen');
  DOM.analyticsScreen = document.getElementById('analytics-screen');

  // Onboarding
  DOM.onboardingSteps = document.querySelectorAll('.onboarding-step');
  DOM.stepDots = document.querySelectorAll('.step-dot');
  DOM.onboardingPrev = document.getElementById('onboarding-prev');
  DOM.onboardingNext = document.getElementById('onboarding-next');
  DOM.calculatedCalories = document.getElementById('calculated-calories');
  DOM.calculatedProtein = document.getElementById('calculated-protein');
  DOM.toggleCustomGoals = document.getElementById('toggle-custom-goals');
  DOM.customGoalsInputs = document.getElementById('custom-goals-inputs');

  // Dashboard
  DOM.caloriesRing = document.getElementById('calories-ring');
  DOM.proteinRing = document.getElementById('protein-ring');
  DOM.overflowRing = document.getElementById('overflow-ring');
  DOM.remainingCalories = document.getElementById('remaining-calories');
  DOM.overflowIndicator = document.getElementById('overflow-indicator');
  DOM.consumedCalories = document.getElementById('consumed-calories');
  DOM.goalCalories = document.getElementById('goal-calories');
  DOM.proteinStats = document.getElementById('protein-stats');
  DOM.proteinBar = document.getElementById('protein-bar');
  DOM.foodLog = document.getElementById('food-log');
  DOM.mealCount = document.getElementById('meal-count');
  DOM.currentDate = document.getElementById('current-date');

  // Settings
  DOM.settingsScreen = document.getElementById('settings-screen');
  DOM.settingsBackBtn = document.getElementById('settings-back-btn');
  DOM.geminiApiKeyInput = document.getElementById('gemini-api-key');
  DOM.saveApiKeyBtn = document.getElementById('save-api-key');
  DOM.apiKeyStatus = document.getElementById('api-key-status');

  // Modal
  DOM.addMealModal = document.getElementById('add-meal-modal');
  DOM.categorySelection = document.getElementById('category-selection');
  DOM.messSelection = document.getElementById('mess-selection');
  DOM.plateView = document.getElementById('plate-view');
  DOM.ancSelection = document.getElementById('anc-selection');
  DOM.packagedSelection = document.getElementById('packaged-selection');
  DOM.customSelection = document.getElementById('custom-selection');
  DOM.l4SelectionModal = document.getElementById('l4-selection-modal');

  // Side Menu
  DOM.sideMenu = document.getElementById('side-menu');
  DOM.menuOverlay = document.getElementById('menu-overlay');

  // Toast
  DOM.toastContainer = document.getElementById('toast-container');
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
  // Header buttons
  document.getElementById('menu-btn')?.addEventListener('click', toggleSideMenu);
  document.getElementById('menu-overlay')?.addEventListener('click', toggleSideMenu);
  document.getElementById('close-menu')?.addEventListener('click', toggleSideMenu);
  document.getElementById('date-picker-btn')?.addEventListener('click', showDatePicker);

  // FAB
  document.getElementById('add-meal-fab')?.addEventListener('click', openAddMealModal);

  // Modal close
  document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
    el.addEventListener('click', closeAllModals);
  });

  // Auth form tabs
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const nameGroup = document.getElementById('auth-name-group');
  const submitBtn = document.getElementById('auth-submit-btn');
  const authForm = document.getElementById('auth-form');

  if (tabLogin && tabSignup && authForm) {
    tabLogin.addEventListener('click', () => {
      tabLogin.classList.add('active');
      tabSignup.classList.remove('active');
      nameGroup.classList.add('hidden');
      submitBtn.textContent = 'Log In';
    });

    tabSignup.addEventListener('click', () => {
      tabSignup.classList.add('active');
      tabLogin.classList.remove('active');
      nameGroup.classList.remove('hidden');
      submitBtn.textContent = 'Sign Up';
    });

    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const isSignup = tabSignup.classList.contains('active');
      const email = document.getElementById('auth-email').value;
      const password = document.getElementById('auth-password').value;
      const name = document.getElementById('auth-name').value;
      
      const prevText = submitBtn.textContent;
      submitBtn.textContent = 'Processing...';
      submitBtn.disabled = true;

      try {
        if (isSignup) {
          if (typeof signUpWithEmail === 'function') {
            await signUpWithEmail(email, password, name);
          }
        } else {
          if (typeof signInWithEmail === 'function') {
            await signInWithEmail(email, password);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        submitBtn.textContent = prevText;
        submitBtn.disabled = false;
      }
    });

    const guestBtn = document.getElementById('btn-guest-login');
    if (guestBtn) {
      guestBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const prevText = guestBtn.textContent;
        guestBtn.textContent = 'Logging in...';
        guestBtn.disabled = true;
        try {
          if (typeof signInAsGuest === 'function') {
            await signInAsGuest();
          }
        } catch (err) {
          console.error(err);
        } finally {
          guestBtn.textContent = prevText;
          guestBtn.disabled = false;
        }
      });
    }

    const googleBtn = document.getElementById('btn-google-signin');
    if (googleBtn) {
      googleBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const prevText = googleBtn.textContent;
        googleBtn.textContent = 'Signing in...';
        googleBtn.disabled = true;
        try {
          if (typeof signInWithGoogle === 'function') {
            await signInWithGoogle();
          }
        } catch (err) {
          console.error(err);
        } finally {
          googleBtn.textContent = prevText;
          googleBtn.disabled = false;
        }
      });
    }
  }

  // Category selection
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => selectCategory(card.dataset.category));
  });

  // Back buttons (only for modal sections, not screen navigation)
  document.querySelectorAll('.modal .back-btn').forEach(btn => {
    btn.addEventListener('click', goBackToCategories);
  });

  // Onboarding
  setupOnboardingListeners();

  // Mess selection
  setupMessListeners();

  // ANC selection
  setupAncListeners();

  // Packaged food
  setupPackagedListeners();

  // Custom entry
  setupCustomListeners();

  // L4 selection
  setupL4Listeners();

  // Plate view
  setupPlateListeners();

  // Settings
  setupSettingsListeners();

  // Side Menu Items
  setupSideMenuListeners();

  // Goals screen
  setupGoalsScreenListeners();
}

// ==================== NAVIGATION ====================
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => {
    // Only hide top level screens
    if (['auth-screen', 'onboarding-screen', 'dashboard-screen', 'analytics-screen', 'goals-screen'].includes(s.id)) {
      s.classList.add('hidden');
    }
  });

  document.getElementById(screenId)?.classList.remove('hidden');

  // specific initializers
  if (screenId === 'analytics-screen' && typeof initAnalytics === 'function') {
    initAnalytics();
  }
  if (screenId === 'goals-screen') {
    initGoalsScreen();
  }

  // Close menu if open
  DOM.sideMenu?.classList.remove('open');
  DOM.menuOverlay?.classList.remove('visible');
}

function showOnboarding() {
  showScreen('onboarding-screen');
  AppState.onboardingStep = 1;
  updateOnboardingUI();
}

function showDashboard() {
  showScreen('dashboard-screen');
  updateDashboardDate();
}

// ==================== ONBOARDING ====================
function setupOnboardingListeners() {
  // Gender selection
  document.querySelectorAll('.gender-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      AppState.tempProfile.gender = btn.dataset.gender;
    });
  });

  // Activity selection (onboarding only)
  document.querySelectorAll('#activity-options .activity-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('#activity-options .activity-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      AppState.tempProfile.activity = opt.dataset.activity;
    });
  });

  // Goal mode selection (Cutting / Maintenance / Bulking)
  document.querySelectorAll('#goal-mode-options .activity-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('#goal-mode-options .activity-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      AppState.tempProfile.goalMode = opt.dataset.goal;
      calculateGoals(); // Recalculate with new goal mode
    });
  });

  // Navigation
  DOM.onboardingPrev?.addEventListener('click', () => {
    if (AppState.onboardingStep > 1) {
      AppState.onboardingStep--;
      updateOnboardingUI();
    }
  });

  DOM.onboardingNext?.addEventListener('click', () => {
    if (validateOnboardingStep()) {
      if (AppState.onboardingStep < 4) {
        if (AppState.onboardingStep === 2) {
          calculateGoals();
        }
        AppState.onboardingStep++;
        updateOnboardingUI();
      } else {
        completeOnboardingFlow();
      }
    }
  });

  // Toggle custom goals
  DOM.toggleCustomGoals?.addEventListener('click', () => {
    DOM.customGoalsInputs?.classList.toggle('hidden');
  });
}

function validateOnboardingStep() {
  switch (AppState.onboardingStep) {
    case 1:
      const age = document.getElementById('onboarding-age')?.value;
      const weight = document.getElementById('onboarding-weight')?.value;
      const height = document.getElementById('onboarding-height')?.value;

      if (!AppState.tempProfile.gender) {
        showToast('Please select your gender', 'error');
        return false;
      }
      if (!age || !weight || !height) {
        showToast('Please fill in all fields', 'error');
        return false;
      }

      AppState.tempProfile.age = parseInt(age);
      AppState.tempProfile.weight = parseFloat(weight);
      AppState.tempProfile.height = parseInt(height);
      return true;

    case 2:
      if (!AppState.tempProfile.activity) {
        showToast('Please select your activity level', 'error');
        return false;
      }
      return true;

    case 3:
      const customCals = document.getElementById('custom-calories')?.value;
      const customProtein = document.getElementById('custom-protein')?.value;

      if (!DOM.customGoalsInputs?.classList.contains('hidden')) {
        if (customCals) AppState.tempProfile.customCalories = parseInt(customCals);
        if (customProtein) AppState.tempProfile.customProtein = parseInt(customProtein);
      }
      return true;

    default:
      return true;
  }
}

function calculateGoals() {
  const { gender, weight, height, age, activity } = AppState.tempProfile;
  const goalMode = AppState.tempProfile.goalMode || 'maintenance';

  // Validate required fields to prevent NaN
  if (!weight || !height || !age || !activity || !gender) {
    console.warn('Missing profile data for TDEE calculation');
    return;
  }

  // BMR Calculation (Mifflin-St Jeor equation)
  let bmr;
  if (gender === 'male') {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) + TDEE_CONSTANTS.bmrMaleMultiplier;
  } else {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) + TDEE_CONSTANTS.bmrFemaleMultiplier;
  }

  // TDEE = BMR × Activity Factor
  const activityMultiplier = TDEE_CONSTANTS.activityMultipliers[activity] || 1.55;
  const tdee = Math.round(bmr * activityMultiplier);

  // Apply goal-based calorie adjustment
  let adjustedCalories = tdee + (TDEE_CONSTANTS.goalCalorieAdjustment[goalMode] || 0);

  // Enforce minimum safe calorie floor
  const minCal = TDEE_CONSTANTS.minCalories[gender] || 1200;
  adjustedCalories = Math.max(adjustedCalories, minCal);

  // Goal-based protein target (g/kg bodyweight)
  const proteinGoal = Math.round(weight * (TDEE_CONSTANTS.proteinPerKg[goalMode] || 1.0));

  AppState.tempProfile.calculatedCalories = tdee;
  AppState.tempProfile.calculatedProtein = proteinGoal;
  AppState.tempProfile.dailyCalorieGoal = adjustedCalories;
  AppState.tempProfile.dailyProteinGoal = proteinGoal;

  // Update UI
  if (DOM.calculatedCalories) {
    DOM.calculatedCalories.textContent = adjustedCalories.toLocaleString();
  }
  if (DOM.calculatedProtein) {
    DOM.calculatedProtein.textContent = proteinGoal;
  }

  // Update goal note text
  const goalNoteEl = document.getElementById('goal-note-text');
  if (goalNoteEl) {
    const notes = {
      cutting: `TDEE (${tdee.toLocaleString()}) \u2212 500 kcal for fat loss`,
      maintenance: 'Based on your TDEE calculation',
      bulking: `TDEE (${tdee.toLocaleString()}) + 300 kcal for lean gains`
    };
    goalNoteEl.textContent = notes[goalMode] || notes.maintenance;
  }
}

function updateOnboardingUI() {
  // Show current step
  DOM.onboardingSteps.forEach((step, index) => {
    step.classList.toggle('active', index + 1 === AppState.onboardingStep);
  });

  // Update dots
  DOM.stepDots.forEach((dot, index) => {
    dot.classList.toggle('active', index + 1 === AppState.onboardingStep);
  });

  // Show/hide prev button
  DOM.onboardingPrev?.classList.toggle('hidden', AppState.onboardingStep === 1);

  // Update next button text
  if (DOM.onboardingNext) {
    DOM.onboardingNext.textContent = AppState.onboardingStep === 4 ? 'Get Started' : 'Continue';
  }
}

async function completeOnboardingFlow() {
  const profile = {
    ...AppState.tempProfile,
    goalMode: AppState.tempProfile.goalMode || 'maintenance',
    onboardingCompleted: true,
    onboardingCompletedAt: new Date().toISOString()
  };

  await saveUserProfile(profile);
  AppState.userProfile = profile;

  // Sync to cloud if authenticated
  syncProfileToCloud(profile).catch(() => {});

  showDashboard();
  showToast('Welcome to Campus Calories!', 'success');
}

// ==================== GOALS SCREEN ====================
function initGoalsScreen() {
  const profile = AppState.userProfile;
  if (!profile) return;

  // Update displayed values in Goals Screen
  const caloriesDisplay = document.getElementById('current-calorie-goal');
  const proteinDisplay = document.getElementById('current-protein-goal');
  const goalModeBadge = document.getElementById('current-goal-mode-badge');
  const goalsDescription = document.getElementById('goals-description');

  const calories = profile.dailyCalorieGoal || profile.calculatedCalories || 2000;
  const protein = profile.dailyProteinGoal || profile.calculatedProtein || 50;

  if (caloriesDisplay) {
    caloriesDisplay.textContent = calories.toLocaleString();
  }
  if (proteinDisplay) {
    proteinDisplay.textContent = protein;
  }

  // Update goal mode badge
  const goalMode = profile.goalMode || 'maintenance';
  if (goalModeBadge) {
    goalModeBadge.textContent = goalMode.charAt(0).toUpperCase() + goalMode.slice(1);
    goalModeBadge.className = 'goal-mode-badge ' + goalMode;
  }

  // Update description
  const descriptions = {
    cutting: 'Lose fat while preserving muscle with a 500 calorie deficit.',
    maintenance: 'Maintain your current weight with balanced nutrition.',
    bulking: 'Build muscle with a 300 calorie surplus for lean gains.'
  };
  if (goalsDescription) {
    goalsDescription.textContent = descriptions[goalMode] || descriptions.maintenance;
  }
}

function setupGoalsScreenListeners() {
  // Back button for goals screen
  const backBtn = document.getElementById('goals-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      showScreen('dashboard-screen');
    });
  }

  // Analytics back button
  const analyticsBackBtn = document.getElementById('analytics-back-btn');
  if (analyticsBackBtn) {
    analyticsBackBtn.addEventListener('click', () => {
      showScreen('dashboard-screen');
    });
  }

  // Header quick access buttons
  const goalsBtn = document.getElementById('goals-btn');
  const streakBtn = document.getElementById('streak-btn');
  if (goalsBtn) {
    goalsBtn.addEventListener('click', () => showScreen('goals-screen'));
  }
  if (streakBtn) {
    streakBtn.addEventListener('click', () => showScreen('analytics-screen'));
  }

  // Change Goal button opens modal
  const changeGoalBtn = document.getElementById('change-goal-btn');
  const goalEditModal = document.getElementById('goal-edit-modal');
  if (changeGoalBtn && goalEditModal) {
    changeGoalBtn.addEventListener('click', () => {
      openGoalEditModal();
    });
  }

  // Goal mode selection in modal
  const goalModeOptions = document.querySelectorAll('#goal-edit-modal .goal-mode-option');
  goalModeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      goalModeOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      updateGoalPreview(opt.dataset.goal);
    });
  });

  // Toggle custom fields
  const toggleCustomBtn = document.getElementById('toggle-custom-edit');
  const customFields = document.getElementById('custom-edit-fields');
  if (toggleCustomBtn && customFields) {
    toggleCustomBtn.addEventListener('click', () => {
      customFields.classList.toggle('hidden');
      toggleCustomBtn.textContent = customFields.classList.contains('hidden')
        ? 'Set custom values instead'
        : 'Use calculated values';
    });
  }

  // Save new goal button
  const saveNewGoalBtn = document.getElementById('save-new-goal-btn');
  if (saveNewGoalBtn) {
    saveNewGoalBtn.addEventListener('click', saveGoalsFromModal);
  }

  // Modal close button
  const modalClose = document.querySelector('#goal-edit-modal .modal-close');
  if (modalClose) {
    modalClose.addEventListener('click', closeGoalEditModal);
  }

  // Modal overlay click to close
  const modalOverlay = document.querySelector('#goal-edit-modal .modal-overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeGoalEditModal);
  }
}

function openGoalEditModal() {
  const modal = document.getElementById('goal-edit-modal');
  if (!modal) return;

  const profile = AppState.userProfile;
  const currentGoalMode = profile?.goalMode || 'maintenance';

  // Highlight current goal mode
  const goalModeOptions = document.querySelectorAll('#goal-edit-modal .goal-mode-option');
  goalModeOptions.forEach(opt => {
    opt.classList.toggle('selected', opt.dataset.goal === currentGoalMode);
  });

  // Update preview with current values
  updateGoalPreview(currentGoalMode);

  // Reset custom fields
  const customFields = document.getElementById('custom-edit-fields');
  const toggleCustomBtn = document.getElementById('toggle-custom-edit');
  if (customFields) customFields.classList.add('hidden');
  if (toggleCustomBtn) toggleCustomBtn.textContent = 'Set custom values instead';

  modal.classList.remove('hidden');
}

function closeGoalEditModal() {
  const modal = document.getElementById('goal-edit-modal');
  if (modal) modal.classList.add('hidden');
}

function updateGoalPreview(goalMode) {
  const profile = AppState.userProfile;
  if (!profile) return;

  // Get activity multiplier
  const activityMultiplier = TDEE_CONSTANTS.activityMultipliers[profile.activity] || 1.55;

  // Recalculate BMR and TDEE
  let bmr;
  if (profile.gender === 'male') {
    bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + TDEE_CONSTANTS.bmrMaleMultiplier;
  } else {
    bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + TDEE_CONSTANTS.bmrFemaleMultiplier;
  }

  const tdee = Math.round(bmr * activityMultiplier);
  let adjustedCalories = tdee + (TDEE_CONSTANTS.goalCalorieAdjustment[goalMode] || 0);

  // Enforce minimum
  const minCal = TDEE_CONSTANTS.minCalories[profile.gender] || 1200;
  adjustedCalories = Math.max(adjustedCalories, minCal);

  const proteinGoal = Math.round(profile.weight * (TDEE_CONSTANTS.proteinPerKg[goalMode] || 1.0));

  // Update preview display
  const previewCalories = document.getElementById('preview-calories');
  const previewProtein = document.getElementById('preview-protein');
  const previewNote = document.getElementById('preview-note');

  if (previewCalories) previewCalories.textContent = adjustedCalories.toLocaleString();
  if (previewProtein) previewProtein.textContent = proteinGoal;

  const notes = {
    cutting: `TDEE (${tdee.toLocaleString()}) − 500 kcal`,
    maintenance: 'Based on your TDEE calculation',
    bulking: `TDEE (${tdee.toLocaleString()}) + 300 kcal`
  };
  if (previewNote) previewNote.textContent = notes[goalMode] || notes.maintenance;
}

async function saveGoalsFromModal() {
  const selectedGoal = document.querySelector('#goal-edit-modal .goal-mode-option.selected');
  const goalMode = selectedGoal?.dataset.goal || 'maintenance';

  const customFields = document.getElementById('custom-edit-fields');
  const isCustom = customFields && !customFields.classList.contains('hidden');

  const customCalories = isCustom ? parseInt(document.getElementById('custom-cal-input')?.value) : null;
  const customProtein = isCustom ? parseInt(document.getElementById('custom-protein-input')?.value) : null;

  // Recalculate based on new goal mode
  const profile = AppState.userProfile;
  const activityMultiplier = TDEE_CONSTANTS.activityMultipliers[profile.activity] || 1.55;

  let bmr;
  if (profile.gender === 'male') {
    bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + TDEE_CONSTANTS.bmrMaleMultiplier;
  } else {
    bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + TDEE_CONSTANTS.bmrFemaleMultiplier;
  }

  const tdee = Math.round(bmr * activityMultiplier);
  let adjustedCalories = tdee + (TDEE_CONSTANTS.goalCalorieAdjustment[goalMode] || 0);
  const minCal = TDEE_CONSTANTS.minCalories[profile.gender] || 1200;
  adjustedCalories = Math.max(adjustedCalories, minCal);
  const proteinGoal = Math.round(profile.weight * (TDEE_CONSTANTS.proteinPerKg[goalMode] || 1.0));

  // Update profile
  const updatedProfile = {
    ...profile,
    goalMode,
    dailyCalorieGoal: (isCustom && customCalories) ? customCalories : adjustedCalories,
    dailyProteinGoal: (isCustom && customProtein) ? customProtein : proteinGoal,
    customCalories: customCalories || null,
    customProtein: customProtein || null,
    calculatedCalories: tdee,
    calculatedProtein: proteinGoal
  };

  await saveUserProfile(updatedProfile);
  AppState.userProfile = updatedProfile;

  // Sync to cloud
  syncProfileToCloud(updatedProfile).catch(() => {});

  closeGoalEditModal();
  initGoalsScreen(); // Refresh goals screen display
  showToast('Goals updated successfully!', 'success');
  updateProgressRings();
}

// ==================== DASHBOARD ====================
function updateDashboardDate() {
  const date = new Date();
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  if (DOM.currentDate) {
    DOM.currentDate.textContent = date.toLocaleDateString('en-US', options);
  }
}

async function loadDailyLog() {
  const stats = await getFoodLogStats(AppState.selectedDate);
  AppState.dailyTotals = stats;

  updateProgressRings();
  renderFoodLog();
}

function updateProgressRings() {
  const profile = AppState.userProfile;
  if (!profile) return;

  const { calories, protein } = AppState.dailyTotals;
  const calorieGoal = profile.dailyCalorieGoal || profile.calculatedCalories || 2000;
  const proteinGoal = profile.dailyProteinGoal || profile.calculatedProtein || 50;

  // Calculate remaining
  const remaining = Math.max(0, calorieGoal - calories);
  const overflow = calories > calorieGoal ? calories - calorieGoal : 0;

  // Update center text
  if (DOM.remainingCalories) {
    DOM.remainingCalories.textContent = remaining.toLocaleString();
  }

  // Show/hide overflow
  if (DOM.overflowIndicator) {
    DOM.overflowIndicator.classList.toggle('hidden', overflow === 0);
    if (overflow > 0) {
      DOM.overflowIndicator.textContent = `+${overflow.toLocaleString()}`;
    }
  }

  // Update stats
  if (DOM.consumedCalories) {
    DOM.consumedCalories.textContent = `${calories.toLocaleString()} kcal`;
  }
  if (DOM.goalCalories) {
    DOM.goalCalories.textContent = `${calorieGoal.toLocaleString()} kcal`;
  }
  if (DOM.proteinStats) {
    DOM.proteinStats.textContent = `${Math.round(protein)}g / ${proteinGoal}g`;
  }

  // Update side menu stats
  const menuStats = document.getElementById('menu-stats');
  if (menuStats) {
    menuStats.textContent = `${Math.round(calories)}/${calorieGoal} kcal`;
  }

  // Update protein bar
  if (DOM.proteinBar) {
    const proteinPercent = Math.min((protein / proteinGoal) * 100, 100);
    DOM.proteinBar.style.width = `${proteinPercent}%`;
  }

  // Update rings
  const calorieRadius = 120;
  const proteinRadius = 100;
  const calorieCircumference = 2 * Math.PI * calorieRadius;
  const proteinCircumference = 2 * Math.PI * proteinRadius;

  // Calorie ring (capped at 100%)
  const caloriePercent = Math.min(calories / calorieGoal, 1);
  const calorieOffset = calorieCircumference - (calorieCircumference * caloriePercent);

  // Protein ring
  const proteinPercent = Math.min(protein / proteinGoal, 1);
  const proteinOffset = proteinCircumference - (proteinCircumference * proteinPercent);

  if (DOM.caloriesRing) {
    DOM.caloriesRing.style.strokeDashoffset = calorieOffset;
  }
  if (DOM.proteinRing) {
    DOM.proteinRing.style.strokeDashoffset = proteinOffset;
  }

  // Show overflow ring if over limit
  if (DOM.overflowRing) {
    DOM.overflowRing.classList.toggle('hidden', calories <= calorieGoal);
  }
}

function renderFoodLog() {
  if (!DOM.foodLog) return;

  const entries = [];

  // Get entries from database
  getFoodEntriesByDate(AppState.selectedDate).then(entries => {
    if (entries.length === 0) {
      DOM.foodLog.innerHTML = `
        <div class="empty-log">
          <div class="empty-icon">🍽️</div>
          <p>No meals logged yet</p>
          <p class="empty-hint">Tap + to add your first meal</p>
        </div>
      `;
    } else {
      DOM.foodLog.innerHTML = entries.map(entry => `
        <div class="log-entry" data-id="${entry.id}">
          <div class="log-icon ${entry.category}">${getCategoryIcon(entry.category)}</div>
          <div class="log-details">
            <div class="log-name">${entry.name}</div>
            <div class="log-meta">${entry.portion || ''}</div>
          </div>
          <div class="log-stats">
            <span class="log-calories">${entry.calories} kcal</span>
            <span class="log-protein">${entry.protein}g protein</span>
          </div>
        </div>
      `).join('');
    }

    // Update meal count
    if (DOM.mealCount) {
      DOM.mealCount.textContent = `${entries.length} item${entries.length !== 1 ? 's' : ''}`;
    }
  });
}

function getCategoryIcon(category) {
  const icons = {
    mess: '🏫',
    anc: '🍔',
    packaged: '📦',
    custom: '✏️'
  };
  return icons[category] || '🍽️';
}

// ==================== MODAL ====================
function openAddMealModal() {
  if (DOM.addMealModal) {
    DOM.addMealModal.classList.remove('hidden');
    showCategorySelection();
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
  if (DOM.l4SelectionModal) {
    DOM.l4SelectionModal.classList.add('hidden');
  }
  resetSelections();
}

function resetSelections() {
  AppState.selectedItems.clear();
  AppState.plateSelections = { L1: [], L2: [], L3: [], L4: [] };
  AppState.selectedBreads.clear();
  AppState.selectedRice = null;
  AppState.riceGrams = 250;
}

function showCategorySelection() {
  DOM.categorySelection?.classList.remove('hidden');
  DOM.messSelection?.classList.add('hidden');
  DOM.plateView?.classList.add('hidden');
  DOM.ancSelection?.classList.add('hidden');
  DOM.packagedSelection?.classList.add('hidden');
  DOM.customSelection?.classList.add('hidden');

  // Update mess status
  updateMessStatus();
}

function selectCategory(category) {
  DOM.categorySelection?.classList.add('hidden');

  switch (category) {
    case 'mess':
      showMessSelection();
      break;
    case 'anc':
      showAncSelection();
      break;
    case 'packaged':
      showPackagedSelection();
      break;
    case 'custom':
      showCustomSelection();
      break;
  }
}

function goBackToCategories() {
  showCategorySelection();
}

// ==================== MESS SELECTION ====================
function setupMessListeners() {
  // Meal tabs
  document.querySelectorAll('.meal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.meal-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      AppState.currentMealType = tab.dataset.meal;
      loadMessItems();
    });
  });

  // Section tabs
  document.querySelectorAll('.section-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.section-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      AppState.currentSectionFilter = tab.dataset.section;
      loadMessItems();
    });
  });

  // Add mess items button
  document.getElementById('add-mess-items')?.addEventListener('click', addMessItemsToLog);
}

function updateMessStatus() {
  const isOpen = isMessOpen();
  const statusEl = document.getElementById('mess-status');

  if (statusEl) {
    statusEl.textContent = isOpen ? 'Open' : 'Closed';
    statusEl.style.color = isOpen ? 'var(--color-success)' : 'var(--color-danger)';
  }
}

function showMessSelection() {
  DOM.messSelection?.classList.remove('hidden');

  const isOpen = isMessOpen();
  const currentMeal = getCurrentMealType() || 'breakfast';

  // Update status banner
  const statusBanner = document.getElementById('mess-status-banner');
  const statusText = document.getElementById('mess-status-text');
  const statusTime = document.getElementById('mess-status-time');

  if (statusBanner) {
    statusBanner.classList.toggle('closed', !isOpen);
    if (statusText) {
      statusText.textContent = isOpen ? 'Mess is Open' : 'Mess is Closed';
    }
    if (statusTime && currentMeal) {
      const slot = MESS_TIME_SLOTS[currentMeal];
      const startH = Math.floor(slot.start / 60);
      const startM = slot.start % 60;
      const endH = Math.floor(slot.end / 60);
      const endM = slot.end % 60;
      statusTime.textContent = `${slot.label}: ${startH}:${startM.toString().padStart(2, '0')} - ${endH}:${endM.toString().padStart(2, '0')}`;
    }
  }

  // Set active tab to current meal
  document.querySelectorAll('.meal-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.meal === currentMeal);
  });
  AppState.currentMealType = currentMeal;
  AppState.currentSectionFilter = 'all';

  // Reset selections
  AppState.messSelections = new Map();
  updateSelectedSummary();

  loadMessItems();
}

function loadMessItems() {
  const itemsList = document.getElementById('mess-items-list');
  if (!itemsList) return;

  let items = getCurrentDayMenu(AppState.currentMealType);

  // Filter by section if not 'all'
  if (AppState.currentSectionFilter && AppState.currentSectionFilter !== 'all') {
    items = items.filter(item => item.section === AppState.currentSectionFilter);
  }

  itemsList.innerHTML = items.map((item, index) => {
    const nutrition = getItemNutrition(item);
    const selection = AppState.messSelections?.get(item.name);
    const quantity = selection?.quantity || 0;

    // Get weight for display
    let weightDisplay = '';
    if (item.type === 'unit' && item.bread_key) {
      const bread = BREAD_UNITS[item.bread_key];
      weightDisplay = bread ? `| ${bread.weight}g/pc` : '';
    } else if (item.type === 'gram' && item.category) {
      const data = getNutritionByKey(item.category);
      const grams = item.grams || data?.defaultGrams || 100;
      weightDisplay = `| ${grams}g`;
    } else if (item.type === 'ml') {
      weightDisplay = `| ${item.default || 200}ml`;
    } else if (item.weight) {
      weightDisplay = `| ${item.weight}g`;
    }

    return `
      <div class="mess-item-card ${quantity > 0 ? 'selected' : ''}" data-item='${JSON.stringify(item)}' data-index="${index}">
        <div class="mess-item-section">${item.section}</div>
        <div class="mess-item-info">
          <div class="mess-item-name">${item.name}</div>
          <div class="mess-item-meta">${nutrition.calories} kcal | ${nutrition.protein}g protein ${weightDisplay}</div>
        </div>
        <div class="mess-item-quantity">
          <button class="qty-btn-small qty-minus" data-name="${item.name}" ${quantity <= 0 ? 'disabled' : ''}>-</button>
          <span class="qty-display" id="qty-${item.name}">${quantity}</span>
          <button class="qty-btn-small qty-plus" data-name="${item.name}">+</button>
        </div>
      </div>
    `;
  }).join('');

  // Add quantity button handlers
  itemsList.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateItemQuantity(btn.dataset.name, -1);
    });
  });

  itemsList.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateItemQuantity(btn.dataset.name, 1);
    });
  });
}

function updateItemQuantity(itemName, delta) {
  if (!AppState.messSelections) {
    AppState.messSelections = new Map();
  }

  const current = AppState.messSelections.get(itemName);
  const currentQty = current?.quantity || 0;
  const newQty = Math.max(0, Math.min(currentQty + delta, 5)); // Max 5 items

  if (newQty === 0) {
    AppState.messSelections.delete(itemName);
  } else {
    // Get item data
    const items = getCurrentDayMenu(AppState.currentMealType);
    const item = items.find(i => i.name === itemName);
    if (item) {
      AppState.messSelections.set(itemName, { ...item, quantity: newQty });
    }
  }

  // Update UI
  const qtyDisplay = document.getElementById(`qty-${itemName}`);
  if (qtyDisplay) {
    qtyDisplay.textContent = newQty;
  }

  // Update card selection state
  const card = qtyDisplay?.closest('.mess-item-card');
  if (card) {
    card.classList.toggle('selected', newQty > 0);
  }

  // Update minus button state
  const minusBtn = card?.querySelector('.qty-minus');
  if (minusBtn) {
    minusBtn.disabled = newQty <= 0;
  }

  updateSelectedSummary();
}

function updateSelectedSummary() {
  const selections = AppState.messSelections || new Map();
  const count = selections.size;
  let totalCalories = 0;

  selections.forEach((item) => {
    const nutrition = getItemNutrition(item);
    totalCalories += nutrition.calories * item.quantity;
  });

  const summary = document.getElementById('selected-items-summary');
  const countEl = document.getElementById('selected-count');
  const calsEl = document.getElementById('selected-calories');
  const addBtn = document.getElementById('add-mess-items');

  if (summary) {
    summary.classList.toggle('hidden', count === 0);
  }
  if (countEl) {
    const totalItems = Array.from(selections.values()).reduce((sum, item) => sum + item.quantity, 0);
    countEl.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''} selected`;
  }
  if (calsEl) {
    calsEl.textContent = `${totalCalories} kcal`;
  }
  if (addBtn) {
    addBtn.disabled = count === 0;
    addBtn.textContent = count === 0 ? 'Add to Log' : `Add ${Array.from(selections.values()).reduce((sum, item) => sum + item.quantity, 0)} Items to Log`;
  }
}

async function addMessItemsToLog() {
  const selections = AppState.messSelections || new Map();
  let addedCount = 0;

  for (const [name, item] of selections) {
    const nutrition = getItemNutrition(item);
    const totalCalories = nutrition.calories * item.quantity;
    const totalProtein = nutrition.protein * item.quantity;

    await addFoodEntry({
      name: `${item.name} (${item.quantity})`,
      category: 'mess',
      calories: totalCalories,
      protein: totalProtein,
      carbs: 0,
      fat: 0,
      date: AppState.selectedDate,
      portion: `${item.quantity} serving${item.quantity > 1 ? 's' : ''}`,
      timestamp: Date.now()
    });
    addedCount += item.quantity;
  }

  showToast(`Added ${addedCount} item(s) to log`, 'success');
  closeAllModals();
  await loadDailyLog();
}

function getItemNutrition(item) {
  if (item.type === 'unit' && item.bread_key) {
    const bread = BREAD_UNITS[item.bread_key];
    const qty = item.default || 1;
    return {
      calories: bread.calories * qty,
      protein: Math.round(bread.protein * qty * 10) / 10
    };
  } else if (item.type === 'gram' && item.category) {
    const data = getNutritionByKey(item.category);
    const grams = item.grams || data?.defaultGrams || 100;
    const factor = grams / 100;
    return {
      calories: Math.round((data?.calories || 0) * factor),
      protein: Math.round((data?.protein || 0) * factor * 10) / 10
    };
  } else if (item.type === 'fixed' && item.category) {
    const data = getNutritionByKey(item.category);
    return {
      calories: data?.calories || item.calories || 0,
      protein: data?.protein || item.protein || 0
    };
  } else if (item.calories !== undefined) {
    return {
      calories: item.calories,
      protein: item.protein || 0
    };
  }
  return { calories: 0, protein: 0 };
}

function toggleItemSelection(card) {
  card.classList.toggle('selected');
  const item = JSON.parse(card.dataset.item);

  if (card.classList.contains('selected')) {
    AppState.selectedItems.set(item.name, item);
  } else {
    AppState.selectedItems.delete(item.name);
  }

  // Show add button if items selected
  const addBtn = document.getElementById('add-mess-items');
  if (addBtn) {
    addBtn.disabled = AppState.selectedItems.size === 0;
  }
}

// ==================== PLATE VIEW ====================
function setupPlateListeners() {
  // Plate sections
  document.querySelectorAll('.plate-section').forEach(section => {
    section.addEventListener('click', () => selectPlateSection(section.dataset.section));
  });

  // Add plate items
  document.getElementById('add-plate-items')?.addEventListener('click', addPlateItemsToLog);
}

function showPlateView() {
  DOM.messSelection?.classList.add('hidden');
  DOM.plateView?.classList.remove('hidden');

  // Load items for each section
  loadPlateSectionItems();
}

function loadPlateSectionItems() {
  const items = getCurrentDayMenu(AppState.currentMealType);

  // Clear sections
  ['l1-items', 'l2-items', 'l3-items', 'l4-items'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
  });

  // Distribute items to sections
  items.forEach(item => {
    const sectionId = {
      'L1': 'l1-items',
      'L2': 'l2-items',
      'L3': 'l3-items',
      'L4': 'l4-items'
    }[item.section];

    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        const badge = document.createElement('span');
        badge.className = 'section-item-badge';
        badge.textContent = item.name;
        el.appendChild(badge);
      }
    }
  });
}

function selectPlateSection(section) {
  // Show L4 modal for L4 section
  if (section === 'L4') {
    showL4SelectionModal();
    return;
  }

  // For other sections, show item selection
  const items = getCurrentDayMenu(AppState.currentMealType).filter(i => i.section === section);

  const detailsPanel = document.getElementById('plate-selection-details');
  const itemsList = document.getElementById('section-items-list');
  const title = document.getElementById('selected-section-title');

  if (title) {
    title.textContent = `${section} - ${PLATE_SECTIONS[section].name}`;
  }

  if (itemsList) {
    itemsList.innerHTML = items.map(item => `
      <div class="section-item-row" data-item='${JSON.stringify(item)}'>
        <div>
          <div class="section-item-name">${item.name}</div>
          <div class="section-item-nutrition">${getItemNutrition(item).calories} kcal</div>
        </div>
        <button class="section-item-add" onclick="addPlateItem('${section}', '${item.name}')">+</button>
      </div>
    `).join('');
  }

  detailsPanel?.classList.remove('hidden');
}

function addPlateItem(section, itemName) {
  const items = getCurrentDayMenu(AppState.currentMealType);
  const item = items.find(i => i.name === itemName);

  if (item) {
    AppState.plateSelections[section].push(item);
    updatePlateSectionUI(section);
    updateAddPlateButton();
  }
}

function updatePlateSectionUI(section) {
  const sectionEl = document.querySelector(`.plate-section[data-section="${section}"]`);
  if (sectionEl) {
    sectionEl.classList.toggle('has-selection', AppState.plateSelections[section].length > 0);
  }
}

function updateAddPlateButton() {
  const hasItems = Object.values(AppState.plateSelections).some(arr => arr.length > 0);
  const addBtn = document.getElementById('add-plate-items');
  if (addBtn) {
    addBtn.disabled = !hasItems;
  }
}

async function addPlateItemsToLog() {
  const allItems = Object.values(AppState.plateSelections).flat();

  for (const item of allItems) {
    const nutrition = getItemNutrition(item);
    await addFoodEntry({
      name: item.name,
      category: 'mess',
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: 0,
      fat: 0,
      date: AppState.selectedDate,
      portion: item.type === 'unit' ? `${item.default || 1} pc` : `${item.grams || 100}g`,
      timestamp: Date.now()
    });
  }

  showToast(`Added ${allItems.length} items to log`, 'success');
  closeAllModals();
  await loadDailyLog();
}

// ==================== L4 SELECTION ====================
function setupL4Listeners() {
  // L4 tabs
  document.querySelectorAll('.l4-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.l4-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      AppState.currentL4Tab = tab.dataset.tab;

      document.getElementById('l4-rice-panel')?.classList.toggle('hidden', tab.dataset.tab !== 'rice');
      document.getElementById('l4-bread-panel')?.classList.toggle('hidden', tab.dataset.tab !== 'bread');
    });
  });

  // Rice options
  document.querySelectorAll('.rice-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.rice-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      AppState.selectedRice = opt.dataset.rice;
    });
  });

  // Rice slider
  const riceSlider = document.getElementById('rice-slider');
  riceSlider?.addEventListener('input', (e) => {
    AppState.riceGrams = parseInt(e.target.value);
    document.getElementById('rice-grams').textContent = AppState.riceGrams;
  });

  // Slider presets
  document.querySelectorAll('.slider-presets button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.slider-presets button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const grams = parseInt(btn.dataset.grams);
      AppState.riceGrams = grams;
      if (riceSlider) riceSlider.value = grams;
      document.getElementById('rice-grams').textContent = grams;
    });
  });

  // Add L4 items
  document.getElementById('add-l4-items')?.addEventListener('click', addL4Items);

  // Close L4 modal
  document.querySelector('.subl-modal-close')?.addEventListener('click', () => {
    DOM.l4SelectionModal?.classList.add('hidden');
  });

  // Load bread options
  loadBreadOptions();
}

function loadBreadOptions() {
  const container = document.getElementById('bread-options');
  if (!container) return;

  container.innerHTML = Object.entries(BREAD_UNITS).map(([key, bread]) => `
    <div class="bread-option" data-bread="${key}">
      <span class="bread-icon">${bread.icon}</span>
      <span class="bread-name">${bread.name}</span>
      <span class="bread-stats">${bread.calories} kcal/pc</span>
      <div class="bread-quantity">
        <button class="qty-btn qty-minus" data-bread="${key}">-</button>
        <span class="qty-value" id="qty-${key}">0</span>
        <button class="qty-btn qty-plus" data-bread="${key}">+</button>
      </div>
    </div>
  `).join('');

  // Add quantity handlers
  container.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateBreadQuantity(btn.dataset.bread, -1);
    });
  });

  container.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateBreadQuantity(btn.dataset.bread, 1);
    });
  });
}

function updateBreadQuantity(breadKey, delta) {
  const current = AppState.selectedBreads.get(breadKey) || 0;
  const bread = BREAD_UNITS[breadKey];
  const newQty = Math.max(0, Math.min(current + delta, bread.max));

  if (newQty === 0) {
    AppState.selectedBreads.delete(breadKey);
  } else {
    AppState.selectedBreads.set(breadKey, newQty);
  }

  const qtyEl = document.getElementById(`qty-${breadKey}`);
  if (qtyEl) {
    qtyEl.textContent = newQty;
  }

  const option = document.querySelector(`.bread-option[data-bread="${breadKey}"]`);
  if (option) {
    option.classList.toggle('selected', newQty > 0);
  }
}

function showL4SelectionModal() {
  DOM.l4SelectionModal?.classList.remove('hidden');
}

async function addL4Items() {
  const items = [];

  // Add rice if selected
  if (AppState.selectedRice) {
    const rice = RICE_DATA[AppState.selectedRice];
    const nutrition = calculateGramNutrition(rice, AppState.riceGrams);
    items.push({
      name: `${rice.name} (${AppState.riceGrams}g)`,
      category: 'mess',
      ...nutrition,
      date: AppState.selectedDate,
      portion: `${AppState.riceGrams}g`,
      timestamp: Date.now()
    });
  }

  // Add breads
  AppState.selectedBreads.forEach((qty, breadKey) => {
    const nutrition = calculateBreadNutrition(breadKey, qty);
    items.push({
      name: nutrition.name,
      category: 'mess',
      ...nutrition,
      date: AppState.selectedDate,
      portion: `${qty} pc`,
      timestamp: Date.now()
    });
  });

  // Save to log
  for (const item of items) {
    await addFoodEntry(item);
  }

  if (items.length > 0) {
    showToast(`Added ${items.length} item(s) to log`, 'success');
    DOM.l4SelectionModal?.classList.add('hidden');
    await loadDailyLog();
  } else {
    showToast('Please select at least one item', 'error');
  }
}

// ==================== ANC SELECTION ====================
function setupAncListeners() {
  // Back to categories
  document.getElementById('back-to-categories')?.addEventListener('click', showAncCategories);
}

function showAncSelection() {
  DOM.ancSelection?.classList.remove('hidden');
  showAncCategories();
}

function showAncCategories() {
  const container = document.getElementById('anc-categories');
  const itemsContainer = document.getElementById('anc-items');

  if (container) {
    container.innerHTML = getAllAncCategories().map(key => {
      const info = getAncCategoryInfo(key);
      return `
        <div class="anc-category-card" data-category="${key}">
          <span class="anc-category-icon">${info.icon}</span>
          <span class="anc-category-name">${info.name}</span>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.anc-category-card').forEach(card => {
      card.addEventListener('click', () => selectAncCategory(card.dataset.category));
    });
  }

  container?.classList.remove('hidden');
  itemsContainer?.classList.add('hidden');
}

function selectAncCategory(category) {
  AppState.currentAncCategory = category;

  const container = document.getElementById('anc-categories');
  const itemsContainer = document.getElementById('anc-items');
  const title = document.getElementById('anc-category-title');
  const itemsList = document.getElementById('anc-items-list');

  const info = getAncCategoryInfo(category);
  if (title) title.textContent = info.name;

  const items = getAncItems(category);
  if (itemsList) {
    itemsList.innerHTML = items.map(item => `
      <div class="item-card" data-item='${JSON.stringify(item)}'>
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-meta">${item.calories} kcal | ${item.protein}g protein | ${item.weight}g</div>
        </div>
        <div class="item-price">₹${item.price}</div>
        <div class="item-checkbox"></div>
      </div>
    `).join('');

    itemsList.querySelectorAll('.item-card').forEach(card => {
      card.addEventListener('click', () => toggleAncItem(card));
    });
  }

  container?.classList.add('hidden');
  itemsContainer?.classList.remove('hidden');
}

function toggleAncItem(card) {
  card.classList.toggle('selected');
  const item = JSON.parse(card.dataset.item);

  if (card.classList.contains('selected')) {
    addAncItemToLog(item);
  }
}

async function addAncItemToLog(item) {
  await addFoodEntry({
    name: item.name,
    category: 'anc',
    calories: item.calories,
    protein: item.protein,
    carbs: item.carbs,
    fat: item.fat,
    date: AppState.selectedDate,
    portion: item.weight ? `${item.weight}g serving` : '1 serving',
    price: item.price,
    timestamp: Date.now()
  });

  showToast(`${item.name} (${item.weight}g) added to log`, 'success');
  await loadDailyLog();
}

// ==================== PACKAGED FOOD ====================
function setupPackagedListeners() {
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('packaged-search');

  searchBtn?.addEventListener('click', () => searchPackagedFood());
  searchInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchPackagedFood();
  });

  // Portion slider
  const portionSlider = document.getElementById('portion-slider');
  portionSlider?.addEventListener('input', updatePortionPreview);

  // Add portion
  document.getElementById('add-portion')?.addEventListener('click', addPortionToLog);
}

function showPackagedSelection() {
  DOM.packagedSelection?.classList.remove('hidden');
}

async function searchPackagedFood() {
  const query = document.getElementById('packaged-search')?.value.trim();
  if (!query) return;

  const resultsContainer = document.getElementById('search-results');
  if (resultsContainer) {
    resultsContainer.innerHTML = '<p style="text-align:center;padding:20px;">Searching...</p>';
  }

  try {
    // Check cache first
    const cached = await searchCachedProducts(query);

    if (cached.length > 0) {
      renderPackagedResults(cached);
      return;
    }

    // Fetch from API
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&json=1&page_size=10&countries_tags_en=india`
    );

    const data = await response.json();

    if (data.products && data.products.length > 0) {
      // Cache results
      for (const product of data.products) {
        await cachePackagedProduct({
          barcode: product.code,
          name: product.product_name || 'Unknown',
          brand: product.brands || '',
          image: product.image_url || '',
          calories: product.nutriments?.['energy-kcal_100g'] || 0,
          protein: product.nutriments?.proteins_100g || 0,
          carbs: product.nutriments?.carbohydrates_100g || 0,
          fat: product.nutriments?.fat_100g || 0
        });
      }

      renderPackagedResults(data.products);
    } else {
      resultsContainer.innerHTML = '<p style="text-align:center;padding:20px;">No products found</p>';
    }
  } catch (error) {
    console.error('Search error:', error);
    resultsContainer.innerHTML = '<p style="text-align:center;padding:20px;">Search failed. Try again.</p>';
  }
}

function renderPackagedResults(products) {
  const container = document.getElementById('search-results');
  if (!container) return;

  container.innerHTML = products.map(p => {
    const calories = p.calories || p.nutriments?.['energy-kcal_100g'] || 0;
    const protein = p.protein || p.nutriments?.proteins_100g || 0;

    return `
      <div class="product-card" data-product='${JSON.stringify({
      name: p.name || p.product_name,
      calories,
      protein,
      carbs: p.carbs || p.nutriments?.carbohydrates_100g || 0,
      fat: p.fat || p.nutriments?.fat_100g || 0
    })}'>
        <img src="${p.image || p.image_url || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}" 
             alt="" class="product-image" loading="lazy">
        <div class="product-info">
          <div class="product-name">${p.name || p.product_name || 'Unknown'}</div>
          <div class="product-brand">${p.brand || p.brands || ''}</div>
          <div class="product-nutrition">
            <span class="product-calories">${Math.round(calories)} kcal/100g</span>
            <span class="product-protein">${protein}g protein</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => showPortionModal(card.dataset.product));
  });
}

function showPortionModal(productJson) {
  const product = JSON.parse(productJson);
  AppState.currentPackagedProduct = product;

  document.getElementById('portion-product-name').textContent = product.name;
  document.getElementById('portion-per-100g').textContent = `${Math.round(product.calories)} kcal / 100g`;

  document.getElementById('portion-modal')?.classList.remove('hidden');
  updatePortionPreview();
}

function updatePortionPreview() {
  const slider = document.getElementById('portion-slider');
  const grams = parseInt(slider?.value || 100);

  document.getElementById('portion-grams').textContent = grams;

  const product = AppState.currentPackagedProduct;
  if (product) {
    const factor = grams / 100;
    const calories = Math.round(product.calories * factor);
    const protein = Math.round(product.protein * factor * 10) / 10;

    document.getElementById('portion-calories').textContent = `${calories} kcal`;
    document.getElementById('portion-protein').textContent = `${protein}g protein`;
  }
}

async function addPortionToLog() {
  const product = AppState.currentPackagedProduct;
  if (!product) return;

  const grams = parseInt(document.getElementById('portion-slider')?.value || 100);
  const factor = grams / 100;

  await addFoodEntry({
    name: product.name,
    category: 'packaged',
    calories: Math.round(product.calories * factor),
    protein: Math.round(product.protein * factor * 10) / 10,
    carbs: Math.round(product.carbs * factor * 10) / 10,
    fat: Math.round(product.fat * factor * 10) / 10,
    date: AppState.selectedDate,
    portion: `${grams}g`,
    timestamp: Date.now()
  });

  showToast(`${product.name} added to log`, 'success');
  document.getElementById('portion-modal')?.classList.add('hidden');
  await loadDailyLog();
}

// ==================== CUSTOM ENTRY ====================
function setupCustomListeners() {
  document.getElementById('add-custom-item')?.addEventListener('click', addCustomItem);

  // AI meal description listeners
  document.getElementById('ai-estimate-btn')?.addEventListener('click', estimateMealCalories);
  document.getElementById('ai-add-to-log')?.addEventListener('click', addAIEstimateToLog);
}

function showCustomSelection() {
  DOM.customSelection?.classList.remove('hidden');
  // Reset AI section
  document.getElementById('ai-result')?.classList.add('hidden');
  document.getElementById('ai-meal-description').value = '';
}

// AI Meal Calorie Estimation Database
const AI_FOOD_DATABASE = {
  // Indian Breads
  'chapati': { calories: 120, protein: 3, carbs: 20, fat: 2.8, weight: 40 },
  'roti': { calories: 120, protein: 3, carbs: 20, fat: 2.8, weight: 40 },
  'paratha': { calories: 210, protein: 4.5, carbs: 28, fat: 9.5, weight: 80 },
  'naan': { calories: 260, protein: 6, carbs: 42, fat: 8, weight: 80 },
  'dosa': { calories: 85, protein: 2, carbs: 16, fat: 1, weight: 40 },
  'idli': { calories: 39, protein: 1.6, carbs: 8, fat: 0.2, weight: 40 },
  'poori': { calories: 80, protein: 1.5, carbs: 10, fat: 4, weight: 25 },

  // Rice Items
  'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, weight: 100 },
  'fried rice': { calories: 180, protein: 4.2, carbs: 28, fat: 6.5, weight: 100 },
  'biryani': { calories: 160, protein: 4.5, carbs: 26, fat: 5, weight: 100 },
  'pulao': { calories: 135, protein: 3, carbs: 25, fat: 3, weight: 100 },

  // Dal & Curries
  'dal': { calories: 116, protein: 7, carbs: 18, fat: 2.5, weight: 100 },
  'sambar': { calories: 65, protein: 3.5, carbs: 10, fat: 1.5, weight: 100 },
  'curry': { calories: 110, protein: 3, carbs: 10, fat: 6, weight: 100 },
  'chole': { calories: 140, protein: 8.9, carbs: 19, fat: 4, weight: 100 },
  'rajma': { calories: 127, protein: 8.7, carbs: 17, fat: 3.5, weight: 100 },
  'paneer': { calories: 265, protein: 18, carbs: 6, fat: 20, weight: 100 },

  // Eggs
  'egg': { calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, weight: 50 },
  'omelette': { calories: 165, protein: 11, carbs: 2, fat: 12, weight: 100 },
  'boiled egg': { calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, weight: 50 },

  // Chicken
  'chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6, weight: 100 },
  'grilled chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6, weight: 100 },
  'chicken curry': { calories: 180, protein: 20, carbs: 5, fat: 9, weight: 100 },
  'butter chicken': { calories: 250, protein: 18, carbs: 8, fat: 16, weight: 100 },

  // Vegetables
  'vegetable': { calories: 95, protein: 3, carbs: 12, fat: 4, weight: 100 },
  'salad': { calories: 25, protein: 1, carbs: 5, fat: 0.2, weight: 50 },

  // Snacks
  'samosa': { calories: 150, protein: 3.5, carbs: 18, fat: 7.5, weight: 50 },
  'pakora': { calories: 145, protein: 3, carbs: 16, fat: 8, weight: 80 },

  // Western Foods
  'sandwich': { calories: 250, protein: 12, carbs: 28, fat: 10, weight: 150 },
  'burger': { calories: 295, protein: 17, carbs: 30, fat: 14, weight: 200 },
  'pizza': { calories: 266, protein: 11, carbs: 33, fat: 10, weight: 100 },
  'fries': { calories: 312, protein: 3.4, carbs: 41, fat: 15, weight: 100 },
  'pasta': { calories: 220, protein: 8, carbs: 28, fat: 9, weight: 200 },

  // Beverages
  'tea': { calories: 70, protein: 2, carbs: 10, fat: 2, weight: 150 },
  'coffee': { calories: 60, protein: 2, carbs: 8, fat: 2, weight: 150 },
  'milk': { calories: 100, protein: 4.3, carbs: 5, fat: 6.5, weight: 100 },
  'juice': { calories: 45, protein: 0.5, carbs: 11, fat: 0, weight: 100 },

  // Sweets
  'kheer': { calories: 165, protein: 5, carbs: 25, fat: 5.5, weight: 100 },
  'halwa': { calories: 200, protein: 3, carbs: 28, fat: 9, weight: 80 },
  'gulab jamun': { calories: 150, protein: 2, carbs: 25, fat: 5, weight: 50 },
  'ice cream': { calories: 200, protein: 3, carbs: 24, fat: 10, weight: 100 }
};

// ==================== SETTINGS ====================
function setupSettingsListeners() {
  DOM.saveApiKeyBtn?.addEventListener('click', saveGeminiApiKey);

  // Back button
  DOM.settingsBackBtn?.addEventListener('click', () => {
    // If navigating back from settings, go to dashboard
    showDashboard();
  });

  // Check saved key on load
  if (DOM.geminiApiKeyInput && AppState.geminiApiKey) {
    DOM.geminiApiKeyInput.value = AppState.geminiApiKey;
  }
}

async function saveGeminiApiKey() {
  const key = DOM.geminiApiKeyInput?.value.trim();
  if (!key) {
    showToast('Please enter an API Key', 'error');
    return;
  }

  try {
    await setSetting('geminiApiKey', key);
    AppState.geminiApiKey = key;

    if (DOM.apiKeyStatus) {
      DOM.apiKeyStatus.textContent = 'API Key saved successfully!';
      DOM.apiKeyStatus.style.color = 'var(--color-success)';
      setTimeout(() => DOM.apiKeyStatus.textContent = '', 3000);
    }
  } catch (error) {
    console.error('Failed to save API Key:', error);
    showToast('Failed to save API Key', 'error');
  }
}

// AI Calorie Estimation Function
async function estimateMealCalories() {
  const description = document.getElementById('ai-meal-description')?.value.trim();
  if (!description) {
    showToast('Please describe your meal', 'error');
    return;
  }

  // Check for API Key
  if (!AppState.geminiApiKey) {
    if (confirm('Gemini API Key is missing. Would you like to add it in Settings for better accuracy?')) {
      showSettings();
      closeAllModals();
      return;
    }
    // Fallback to local
    console.warn('Gemini API Key missing, falling back to local');
    const result = parseMealDescription(description);
    displayAIResult(result, description);
    return;
  }

  const btn = document.getElementById('ai-estimate-btn');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="ai-btn-text">Estimating...</span>';
  btn.disabled = true;

  try {
    console.log('Calling Gemini API...');
    const result = await callGeminiAPI(description);
    console.log('Gemini API result:', result);

    // Validate result structure
    if (!result || typeof result.calories !== 'number') {
      throw new Error('Invalid response format from AI');
    }

    displayAIResult(result, description);
    showToast('Estimated using Gemini AI', 'success');
  } catch (error) {
    console.error('AI Estimation failed:', error);
    showToast(`AI Error: ${error.message}. Using basic estimator.`, 'error');

    // Fallback to local on error, but notify user
    const result = parseMealDescription(description);
    displayAIResult(result, description);
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

function showSettings() {
  showScreen('settings-screen');
}

async function callGeminiAPI(description) {
  const API_KEY = AppState.geminiApiKey;
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  const prompt = `
    Analyze the following meal description and provide nutritional information (calories, protein in grams, carbs in grams, fat in grams).
    Return ONLY a valid JSON object with keys: "calories", "protein", "carbs", "fat".
    Do not wrap in markdown code blocks.
    
    Meal: "${description}"
  `;

  const response = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;

  // Clean potential markdown
  const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanText);
}

function displayAIResult(result, description) {
  // Display results
  document.getElementById('ai-calories').textContent = Math.round(result.calories);
  document.getElementById('ai-protein').textContent = Math.round(result.protein) + 'g';
  document.getElementById('ai-carbs').textContent = Math.round(result.carbs) + 'g';
  document.getElementById('ai-fat').textContent = Math.round(result.fat) + 'g';

  // Store for adding to log
  AppState.aiEstimate = result;
  AppState.aiEstimate.name = description.substring(0, 50) + (description.length > 50 ? '...' : '') + ' (AI)';

  document.getElementById('ai-result')?.classList.remove('hidden');
}

function parseMealDescription(description) {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  // Extract quantities and food items
  const words = description.split(/\s+/);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // Check for numbers (quantities)
    const quantity = parseInt(word);
    if (!isNaN(quantity) && quantity > 0 && quantity < 20) {
      // Look for food item in next words
      for (let j = i + 1; j < Math.min(i + 4, words.length); j++) {
        const foodName = words.slice(i + 1, j + 1).join(' ');
        const foodData = findFoodInDatabase(foodName);

        if (foodData) {
          totalCalories += foodData.calories * quantity;
          totalProtein += foodData.protein * quantity;
          totalCarbs += foodData.carbs * quantity;
          totalFat += foodData.fat * quantity;
          break;
        }
      }
    } else {
      // Check single word
      const foodData = findFoodInDatabase(word);
      if (foodData) {
        totalCalories += foodData.calories;
        totalProtein += foodData.protein;
        totalCarbs += foodData.carbs;
        totalFat += foodData.fat;
      }
    }
  }

  // If no food found, provide a generic estimate
  if (totalCalories === 0) {
    // Generic meal estimate based on description length as a proxy
    totalCalories = 400;
    totalProtein = 15;
    totalCarbs = 50;
    totalFat = 15;
  }

  return {
    calories: Math.round(totalCalories),
    protein: Math.round(totalProtein * 10) / 10,
    carbs: Math.round(totalCarbs * 10) / 10,
    fat: Math.round(totalFat * 10) / 10
  };
}

function findFoodInDatabase(foodName) {
  // Direct match
  if (AI_FOOD_DATABASE[foodName]) {
    return AI_FOOD_DATABASE[foodName];
  }

  // Partial match
  for (const [key, value] of Object.entries(AI_FOOD_DATABASE)) {
    if (foodName.includes(key) || key.includes(foodName)) {
      return value;
    }
  }

  return null;
}

async function addAIEstimateToLog() {
  if (!AppState.aiEstimate) {
    showToast('Please estimate calories first', 'error');
    return;
  }

  await addFoodEntry({
    name: AppState.aiEstimate.name,
    category: 'custom',
    calories: AppState.aiEstimate.calories,
    protein: AppState.aiEstimate.protein,
    carbs: AppState.aiEstimate.carbs,
    fat: AppState.aiEstimate.fat,
    date: AppState.selectedDate,
    portion: 'AI Estimated',
    timestamp: Date.now()
  });

  showToast('AI estimated meal added to log', 'success');
  document.getElementById('ai-result')?.classList.add('hidden');
  document.getElementById('ai-meal-description').value = '';
  await loadDailyLog();
}

async function addCustomItem() {
  const name = document.getElementById('custom-name')?.value.trim();
  const calories = parseInt(document.getElementById('custom-calories-input')?.value) || 0;
  const protein = parseFloat(document.getElementById('custom-protein-input')?.value) || 0;
  const carbs = parseFloat(document.getElementById('custom-carbs-input')?.value) || 0;
  const fat = parseFloat(document.getElementById('custom-fat-input')?.value) || 0;

  if (!name) {
    showToast('Please enter a food name', 'error');
    return;
  }

  if (calories === 0) {
    showToast('Please enter calories', 'error');
    return;
  }

  await addFoodEntry({
    name,
    category: 'custom',
    calories,
    protein,
    carbs,
    fat,
    date: AppState.selectedDate,
    portion: '1 serving',
    timestamp: Date.now()
  });

  showToast(`${name} added to log`, 'success');
  closeAllModals();
  await loadDailyLog();
}

// ==================== SIDE MENU ====================
function setupSideMenuListeners() {
  // Side Menu Click Handler
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const view = item.dataset.view;

      // Allow default link behavior if no data-view (e.g. admin.html)
      if (!view) return;

      e.preventDefault();

      if (view === 'settings') {
        showSettings();
      } else if (view === 'dashboard') {
        showScreen('dashboard-screen');
      } else if (view === 'analytics') {
        showScreen('analytics-screen');
        if (typeof initAnalytics === 'function') initAnalytics();
      } else if (view === 'goals') {
        showScreen('goals-screen');
      } else if (view === 'history') {
        showToast('History coming soon!');
      }

      toggleSideMenu(); // Close menu
    });
  });
}

function toggleSideMenu() {
  DOM.sideMenu?.classList.toggle('active');
  DOM.menuOverlay?.classList.toggle('active');
}

// ==================== DATE PICKER ====================
function showDatePicker() {
  // Simple date picker using native input
  const input = document.createElement('input');
  input.type = 'date';
  input.value = AppState.selectedDate;
  input.style.position = 'fixed';
  input.style.top = '50%';
  input.style.left = '50%';
  input.style.transform = 'translate(-50%, -50%)';
  input.style.zIndex = '9999';

  input.addEventListener('change', async (e) => {
    AppState.selectedDate = e.target.value;
    updateDashboardDate();
    await loadDailyLog();
    document.body.removeChild(input);
  });

  input.addEventListener('blur', () => {
    if (input.parentNode) {
      document.body.removeChild(input);
    }
  });

  document.body.appendChild(input);
  input.click();
}

// ==================== TOAST ====================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  DOM.toastContainer?.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

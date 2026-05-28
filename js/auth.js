// ====================================================================
// GANESHSTORE - UNIFIED AUTHENTICATION ENGINE (FIREBASE + MOCK + SUPABASE SYNC)
// ====================================================================
// This file is the single source of truth for GaneshStore auth.
// It handles:
// 1. Firebase Auth initialization (if API keys are replaced)
// 2. Mock Auth fallback (if API keys are placeholders)
// 3. Dynamic header updates ("My Account" -> Custom user dropdown)
// 4. Airtight sync with Supabase profiles table for shopping cart & wishlist persistence

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE", // Replace with your actual Firebase API Key
  authDomain: "YOUR_AUTH_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID_HERE",
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE"
};

// Check if Firebase has been configured with real API keys
const hasRealFirebaseConfig = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "YOUR_API_KEY_HERE" &&
  firebaseConfig.apiKey.trim() !== "";

let db = null;

// Initialize Firebase if configured
if (hasRealFirebaseConfig) {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("🔥 Firebase initialized successfully!");
  } catch (error) {
    console.error("❌ Failed to initialize Firebase:", error);
  }
} else {
  console.log("ℹ️ Running in Premium Mock Auth mode. (Edit js/auth.js to connect real Firebase)");
}

// Injects drop-down styling dynamically to head
const dropdownStyle = document.createElement('style');
dropdownStyle.innerHTML = `
  .auth-dropdown {
    position: relative;
    display: inline-block;
  }
  .auth-dropdown-menu {
    display: none;
    position: absolute;
    right: 0;
    top: 100%;
    background-color: #ffffff;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.1);
    z-index: 9999;
    border-radius: 8px;
    border: 1px solid #eeeeee;
    overflow: hidden;
    animation: dropdownFadeIn 0.25s ease;
  }
  .auth-dropdown-menu a {
    color: #333333 !important;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    font-size: 13px;
    font-weight: 500;
    transition: background-color 0.2s ease, color 0.2s ease;
  }
  .auth-dropdown-menu a:hover {
    background-color: #f8f9fa;
    color: #717fe0 !important;
  }
  .auth-dropdown:hover .auth-dropdown-menu {
    display: block;
  }
  @keyframes dropdownFadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(dropdownStyle);

// Helper to get cookies by name
function getCookieValue(name) {
  let result = document.cookie.match(
    "(^|[^;]+)\\s*" + name + "\\s*=\\s*([^;]+)"
  );
  return result ? decodeURIComponent(result.pop()) : "";
}

// Syncs user profile with Supabase to make cart/wishlist features fully operational
function syncUserProfileWithSupabase(uid, name, email) {
  if (window.supabaseClient) {
    console.log("🔄 Syncing user profile with Supabase...", email);
    return window.supabaseClient
      .from('profiles')
      .select('*')
      .eq('email', email)
      .then(response => {
        let profile = response.data && response.data[0];
        if (profile) {
          console.log("✅ Supabase profile loaded:", profile);
          localStorage.setItem('userProfile', JSON.stringify(profile));
          localStorage.setItem('user', 'loggedin');
          return profile;
        } else {
          // Check by ID as fallback
          return window.supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', uid)
            .then(idResponse => {
              let idProfile = idResponse.data && idResponse.data[0];
              if (idProfile) {
                console.log("✅ Supabase profile loaded by ID:", idProfile);
                localStorage.setItem('userProfile', JSON.stringify(idProfile));
                localStorage.setItem('user', 'loggedin');
                return idProfile;
              } else {
                // Profile doesn't exist, create a new record!
                const newProfileId = (uid && uid.includes('-') && uid.length === 36) ? uid : crypto.randomUUID();
                const newProfile = {
                  id: newProfileId,
                  full_name: name || email.split('@')[0],
                  email: email,
                  phone_number: "1234567890" // default placeholder phone to avoid non-null constraint on old database schemas
                };
                
                return window.supabaseClient
                  .from('profiles')
                  .insert(newProfile)
                  .then(insertRes => {
                    if (insertRes.error) {
                      console.warn("⚠️ Supabase email insert failed (old schema without email column), trying fallback profile...", insertRes.error);
                      // Fallback profile matching the original profiles schema
                      const fallbackProfile = {
                        id: newProfileId,
                        full_name: newProfile.full_name,
                        phone_number: "1234567890"
                      };
                      return window.supabaseClient
                        .from('profiles')
                        .insert(fallbackProfile)
                        .then(() => {
                          localStorage.setItem('userProfile', JSON.stringify(fallbackProfile));
                          localStorage.setItem('user', 'loggedin');
                          return fallbackProfile;
                        });
                    }
                    localStorage.setItem('userProfile', JSON.stringify(newProfile));
                    localStorage.setItem('user', 'loggedin');
                    return newProfile;
                  });
              }
            });
        }
      })
      .catch(err => {
        console.error("❌ Supabase sync error:", err);
        // Fail-safe local backup profile
        const localProfile = { id: uid, full_name: name, email: email, phone_number: "1234567890" };
        localStorage.setItem('userProfile', JSON.stringify(localProfile));
        localStorage.setItem('user', 'loggedin');
        return localProfile;
      });
  } else {
    // Supabase not loaded, keep local profile
    const localProfile = { id: uid, full_name: name, email: email, phone_number: "1234567890" };
    localStorage.setItem('userProfile', JSON.stringify(localProfile));
    localStorage.setItem('user', 'loggedin');
    return Promise.resolve(localProfile);
  }
}

// Main auth observer / startup checker
document.addEventListener("DOMContentLoaded", () => {
  if (hasRealFirebaseConfig) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("👤 User logged in (Firebase):", user.email);
        updateHeaderUI(user);
      } else {
        console.log("👤 No user logged in (Firebase)");
        updateHeaderUI(null);
      }
    });
  } else {
    // Mock Auth observer
    const mockUser = getMockUser();
    if (mockUser) {
      console.log("👤 User logged in (Mock):", mockUser.email);
      updateHeaderUI(mockUser);
    } else {
      console.log("👤 No user logged in (Mock)");
      updateHeaderUI(null);
    }
  }
});

// Update the header UI element ("My Account" -> Custom dynamic dropdown)
function updateHeaderUI(user) {
  const accountLinks = findMyAccountLinks();
  
  if (user) {
    const displayName = user.displayName || user.email.split('@')[0];
    const userUid = user.uid || "mock-uid-123";
    
    document.cookie = "CustomerName=" + encodeURIComponent(displayName) + "; path=/";
    document.cookie = "CustomerNumber=" + encodeURIComponent(userUid) + "; path=/";
    localStorage.setItem("user", "loggedin");
  }
  
  accountLinks.forEach(link => {
    if (user) {
      const displayName = user.displayName || user.email.split('@')[0];
      const initials = displayName.substring(0, 2).toUpperCase();
      
      const dropdownContainer = document.createElement("div");
      dropdownContainer.className = "auth-dropdown flex-c-m trans-04 p-lr-25";
      dropdownContainer.style.cursor = "pointer";
      
      dropdownContainer.innerHTML = `
        <span style="display: flex; align-items: center; gap: 8px;">
          <span style="background-color: #717fe0; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; text-transform: uppercase;">
            ${initials}
          </span>
          <span style="font-weight: 500;">${displayName} ▾</span>
        </span>
        <div class="auth-dropdown-menu">
          <a href="wishlist.html"><i class="zmdi zmdi-favorite-outline" style="margin-right: 8px;"></i> My Wishlist</a>
          <a href="shoping-cart.html"><i class="zmdi zmdi-shopping-cart" style="margin-right: 8px;"></i> My Cart</a>
          <a href="#" onclick="logoutUser(event)"><i class="zmdi zmdi-power" style="margin-right: 8px;"></i> Log Out</a>
        </div>
      `;
      
      link.parentNode.replaceChild(dropdownContainer, link);
    } else {
      link.setAttribute("href", "contact.html");
      link.innerHTML = "My Account";
      if (link.parentNode && link.parentNode.classList.contains("auth-dropdown")) {
        const newLink = document.createElement("a");
        newLink.className = "flex-c-m trans-04 p-lr-25";
        newLink.setAttribute("href", "contact.html");
        newLink.innerHTML = "My Account";
        link.parentNode.parentNode.replaceChild(newLink, link.parentNode);
      }
    }
  });
}

function findMyAccountLinks() {
  const links = document.querySelectorAll("a");
  const matches = [];
  links.forEach(link => {
    const text = link.textContent.trim().toLowerCase();
    if (text === "my account" || text === "my account ▾" || text.includes("my account")) {
      matches.push(link);
    }
  });
  return matches;
}

// Global Logout action
function logoutUser(e) {
  if (e) e.preventDefault();
  
  document.cookie = "CustomerName=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  document.cookie = "CustomerNumber=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  localStorage.setItem("user", "loggedout");
  localStorage.removeItem('userProfile');
  localStorage.setItem('cartItems', '[]');
  localStorage.setItem('wishlist', '[]');
  
  if (hasRealFirebaseConfig) {
    firebase.auth().signOut()
      .then(() => {
        localStorage.removeItem('ganeshStore_user');
        window.location.reload();
      })
      .catch(err => console.error("Error signing out:", err));
  } else {
    localStorage.removeItem('ganeshStore_user_mock');
    window.location.reload();
  }
}

function getMockUser() {
  const user = localStorage.getItem('ganeshStore_user_mock');
  return user ? JSON.parse(user) : null;
}

// Helper to display warning/success alerts dynamically on both interfaces
function triggerDisplayMessage(type, message) {
  if (typeof showContactMessage === "function") {
    showContactMessage(type, message);
  } else if (typeof showMessage === "function") {
    showMessage(type, message);
  } else {
    alert(message);
  }
}

// ====================================================================
// CONSOLIDATED AUTH ACTION HANDLERS (SUPPORTS BOTH REAL & MOCK MODES)
// ====================================================================

window.handleGoogleSignIn = function() {
  if (hasRealFirebaseConfig) {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        const name = user.displayName || user.email.split('@')[0];
        
        triggerDisplayMessage('success', 'Google Sign-In successful! Syncing profile...');
        
        syncUserProfileWithSupabase(user.uid, name, user.email).then(() => {
          setTimeout(() => { window.location.reload(); }, 1200);
        });
      })
      .catch((error) => {
        triggerDisplayMessage('error', error.message);
      });
  } else {
    // Mock Google Sign In
    const name = "Sai Ganesh";
    const email = "saiganesh@gmail.com";
    const uid = "mock-uid-google-123";
    
    const mockUser = { uid, email, displayName: name, photoURL: null };
    localStorage.setItem('ganeshStore_user_mock', JSON.stringify(mockUser));
    
    triggerDisplayMessage('success', 'Google Sign-In simulated! Syncing profile...');
    
    syncUserProfileWithSupabase(uid, name, email).then(() => {
      setTimeout(() => { window.location.reload(); }, 1200);
    });
  }
};

window.handleEmailLogin = function(event) {
  if (event) event.preventDefault();
  
  // Dynamic lookup of inputs to support both prefixed and flat IDs
  const emailInput = document.getElementById('c-login-email') || document.getElementById('login-email');
  const passInput = document.getElementById('c-login-password') || document.getElementById('login-password');
  
  if (!emailInput || !passInput) return;
  
  const email = emailInput.value.trim();
  const pass = passInput.value;

  if (hasRealFirebaseConfig) {
    firebase.auth().signInWithEmailAndPassword(email, pass)
      .then((userCredential) => {
        const user = userCredential.user;
        const name = user.displayName || user.email.split('@')[0];
        
        triggerDisplayMessage('success', 'Login successful! Syncing profile...');
        
        syncUserProfileWithSupabase(user.uid, name, user.email).then(() => {
          setTimeout(() => { window.location.reload(); }, 1200);
        });
      })
      .catch((error) => {
        triggerDisplayMessage('error', error.message);
      });
  } else {
    // Mock Login
    if (pass.length < 6) {
      triggerDisplayMessage('error', 'Password must be at least 6 characters long.');
      return;
    }
    const name = email.split('@')[0];
    const uid = "mock-uid-email-456";
    
    const mockUser = { uid, email, displayName: name, photoURL: null };
    localStorage.setItem('ganeshStore_user_mock', JSON.stringify(mockUser));
    
    triggerDisplayMessage('success', 'Welcome back! Syncing profile...');
    
    syncUserProfileWithSupabase(uid, name, email).then(() => {
      setTimeout(() => { window.location.reload(); }, 1200);
    });
  }
};

window.handleEmailSignUp = function(event) {
  if (event) event.preventDefault();
  
  const nameInput = document.getElementById('c-signup-name') || document.getElementById('signup-name');
  const emailInput = document.getElementById('c-signup-email') || document.getElementById('signup-email');
  const passInput = document.getElementById('c-signup-password') || document.getElementById('signup-password');
  
  if (!nameInput || !emailInput || !passInput) return;
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const pass = passInput.value;

  if (pass.length < 6) {
    triggerDisplayMessage('error', 'Password must be at least 6 characters long.');
    return;
  }

  if (hasRealFirebaseConfig) {
    firebase.auth().createUserWithEmailAndPassword(email, pass)
      .then((userCredential) => {
        const user = userCredential.user;
        return user.updateProfile({ displayName: name }).then(() => {
          user.sendEmailVerification().catch(e => console.error(e));
          
          triggerDisplayMessage('success', 'Account created! Syncing profile...');
          
          syncUserProfileWithSupabase(user.uid, name, user.email).then(() => {
            setTimeout(() => { window.location.reload(); }, 1500);
          });
        });
      })
      .catch((error) => {
        triggerDisplayMessage('error', error.message);
      });
  } else {
    // Mock Sign Up
    const uid = "mock-uid-signup-789";
    const mockUser = { uid, email, displayName: name, photoURL: null };
    localStorage.setItem('ganeshStore_user_mock', JSON.stringify(mockUser));
    
    triggerDisplayMessage('success', 'Registration simulated! Syncing profile...');
    
    syncUserProfileWithSupabase(uid, name, email).then(() => {
      setTimeout(() => { window.location.reload(); }, 1200);
    });
  }
};

window.handleForgotPassword = function(event) {
  if (event) event.preventDefault();
  
  const emailInput = document.getElementById('c-login-email') || document.getElementById('login-email');
  if (!emailInput || !emailInput.value) {
    triggerDisplayMessage('error', 'Please enter your email address in the Sign In form first.');
    return;
  }
  
  const email = emailInput.value.trim();

  if (hasRealFirebaseConfig) {
    firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        triggerDisplayMessage('success', 'Password reset email sent! Check your inbox.');
      })
      .catch((error) => {
        triggerDisplayMessage('error', error.message);
      });
  } else {
    triggerDisplayMessage('success', 'Simulation: A password reset email has been sent to ' + email);
  }
};

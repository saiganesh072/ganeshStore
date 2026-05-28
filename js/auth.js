// ====================================================================
// GANESHSTORE - DUAL-MODE AUTHENTICATION ENGINE (FIREBASE + MOCK AUTH)
// ====================================================================
// This script automatically initializes Firebase Auth if API keys are set.
// If API keys are placeholders, it seamlessly falls back to a robust Mock Auth mode,
// allowing the login/signup system to be immediately functional and testable!

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
  console.log("ℹ️ Running in Premium Mock Auth mode. (No Firebase credentials detected. Edit js/auth.js to connect real Firebase)");
}

// Ensure style is injected for the dropdown menu
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
    // Mock Auth logic
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
  
  accountLinks.forEach(link => {
    if (user) {
      const displayName = user.displayName || user.email.split('@')[0];
      const initials = displayName.substring(0, 2).toUpperCase();
      
      // Create a premium dropdown instead of the plain link
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
      // Logged out - link goes to login page
      link.setAttribute("href", "login.html");
      link.innerHTML = "My Account";
      // Remove dropdown wrapper if previously created
      if (link.parentNode && link.parentNode.classList.contains("auth-dropdown")) {
        const newLink = document.createElement("a");
        newLink.className = "flex-c-m trans-04 p-lr-25";
        newLink.setAttribute("href", "login.html");
        newLink.innerHTML = "My Account";
        link.parentNode.parentNode.replaceChild(newLink, link.parentNode);
      }
    }
  });
}

// Find all elements containing "My Account"
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

// Logout action
function logoutUser(e) {
  if (e) e.preventDefault();
  
  if (hasRealFirebaseConfig) {
    firebase.auth().signOut()
      .then(() => {
        localStorage.removeItem('ganeshStore_user');
        window.location.reload();
      })
      .catch(err => console.error("Error signing out:", err));
  } else {
    // Mock Logout
    localStorage.removeItem('ganeshStore_user_mock');
    window.location.reload();
  }
}

// ====================================================================
// MOCK AUTH IMPLEMENTATION (FOR INSTANT PREVIEW & OFFLINE TESTING)
// ====================================================================

function getMockUser() {
  const user = localStorage.getItem('ganeshStore_user_mock');
  return user ? JSON.parse(user) : null;
}

// Add Mock functions to window context if Firebase is not active
if (!hasRealFirebaseConfig) {
  window.handleGoogleSignIn = function() {
    const mockUser = {
      uid: "mock-google-id-12345",
      email: "saiganesh@gmail.com",
      displayName: "Sai Ganesh",
      photoURL: null
    };
    localStorage.setItem('ganeshStore_user_mock', JSON.stringify(mockUser));
    
    // Trigger Success Banner in login.html if it's open
    if (typeof showMessage === "function") {
      showMessage('success', 'Google Sign-In simulated! Redirecting...');
    }
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1200);
  };

  window.handleEmailLogin = function(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;

    if (pass.length < 6) {
      if (typeof showMessage === "function") {
        showMessage('error', 'Password must be at least 6 characters long.');
      }
      return;
    }

    const mockUser = {
      uid: "mock-email-id-998877",
      email: email,
      displayName: email.split('@')[0],
      photoURL: null
    };
    localStorage.setItem('ganeshStore_user_mock', JSON.stringify(mockUser));

    if (typeof showMessage === "function") {
      showMessage('success', 'Sign In simulated! Welcome to GaneshStore.');
    }
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1200);
  };

  window.handleEmailSignUp = function(event) {
    event.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const pass = document.getElementById('signup-password').value;

    if (pass.length < 6) {
      if (typeof showMessage === "function") {
        showMessage('error', 'Password must be at least 6 characters long.');
      }
      return;
    }

    const mockUser = {
      uid: "mock-signup-id-554433",
      email: email,
      displayName: name,
      photoURL: null
    };
    localStorage.setItem('ganeshStore_user_mock', JSON.stringify(mockUser));

    if (typeof showMessage === "function") {
      showMessage('success', 'Account registration simulated! Redirecting...');
    }
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1200);
  };

  window.handleForgotPassword = function(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    if (!email) {
      if (typeof showMessage === "function") {
        showMessage('error', 'Please enter your email address first.');
      }
      return;
    }
    if (typeof showMessage === "function") {
      showMessage('success', 'Simulation: A password reset email has been sent to ' + email);
    }
  };
}

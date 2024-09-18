document.addEventListener("DOMContentLoaded", () => {
    const loginEmailButton = document.getElementById('login-email');
    const loginPhoneButton = document.getElementById('login-phone');
    const loginGoogleButton = document.getElementById('login-google');
    const loginFormContent = document.getElementById('login-form-content');
  
    loginEmailButton.addEventListener('click', () => {
      loginFormContent.innerHTML = `
        <form id="email-login-form">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required>
          <button type="submit">Log In</button>
        </form>
      `;
      loginFormContent.classList.remove('hidden');
    });
  
    loginPhoneButton.addEventListener('click', () => {
      loginFormContent.innerHTML = `
        <form id="phone-login-form">
          <label for="phone">Phone Number:</label>
          <input type="tel" id="phone" name="phone" required>
          <button type="submit">Send OTP</button>
        </form>
      `;
      loginFormContent.classList.remove('hidden');
    });
  
    loginGoogleButton.addEventListener('click', () => {
      // Handle Google login here
      alert("Google login functionality is not implemented.");
    });
  });
  
  function closeLogin() {
    window.close(); // Adjust as needed, possibly redirect or hide the modal
  }
  document.addEventListener("DOMContentLoaded", () => {
    const loginEmailButton = document.getElementById('login-email');
    const loginPhoneButton = document.getElementById('login-phone');
    const loginGoogleButton = document.getElementById('login-google');
    const loginFormContent = document.getElementById('login-form-content');
  
    // Initialize Google Sign-In
    window.onload = function() {
      gapi.load('auth2', function() {
        gapi.auth2.init({
          client_id: '449900263204-paokn6tnkflcvmq6oh09vq27etf3q141.apps.googleusercontent.com'
        }).then(function(auth2) {
          // Attach the click handler to the Google Sign-In button
          const googleButton = document.getElementById('google-signin-button');
          auth2.attachClickHandler(googleButton, {},
            function(googleUser) {
              const profile = googleUser.getBasicProfile();
              console.log('ID: ' + profile.getId());
              console.log('Name: ' + profile.getName());
              console.log('Image URL: ' + profile.getImageUrl());
              console.log('Email: ' + profile.getEmail());
              // Redirect or handle user login here
            }, function(error) {
              console.log(JSON.stringify(error, undefined, 2));
            });
        });
      });
    };
  
    loginEmailButton.addEventListener('click', () => {
      loginFormContent.innerHTML = `
        <form id="email-login-form">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required>
          <button type="submit">Log In</button>
        </form>
      `;
      loginFormContent.classList.remove('hidden');
    });
  
    loginPhoneButton.addEventListener('click', () => {
      loginFormContent.innerHTML = `
        <form id="phone-login-form">
          <label for="phone">Phone Number:</label>
          <input type="tel" id="phone" name="phone" required>
          <button type="submit">Send OTP</button>
        </form>
      `;
      loginFormContent.classList.remove('hidden');
    });
  
    loginGoogleButton.addEventListener('click', () => {
      document.getElementById('google-signin-button').click();
    });
  });
  
  function closeLogin() {
    window.close(); // Adjust as needed, possibly redirect or hide the modal
  }
function handleCredentialResponse(response) {
    // The response.credential contains the JWT ID token
    console.log('Encoded JWT ID token: ' + response.credential);
    
    // You can send the token to your backend for further validation or use it directly
    // Example: Send it to your backend using fetch() or XMLHttpRequest()
    fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_token: response.credential }),
    }).then((res) => {
      return res.json();
    }).then((data) => {
      console.log(data); // Handle login success/failure
    });
}

// Import and configure the Firebase SDK
// Option 1: Use Firebase CDN
// Add Firebase products that you want to use
// Initialize Firebase (replace with your Firebase config)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Initialize Firebase Auth
  const auth = firebase.auth();
  
  // Phone Number OTP Login
  document.getElementById('get-otp').addEventListener('click', function() {
    const phoneNumber = document.getElementById('phone').value;
    if (phoneNumber) {
      const appVerifier = new firebase.auth.RecaptchaVerifier('get-otp', {
        'size': 'invisible',
        'callback': function(response) {
          // reCAPTCHA solved, proceed with phone auth
          sendOTP(phoneNumber);
        }
      });
  
      function sendOTP(phoneNumber) {
        auth.signInWithPhoneNumber(phoneNumber, appVerifier)
          .then(function (confirmationResult) {
            // SMS sent, prompt user to type the OTP
            document.getElementById('otp').style.display = 'block';
            document.getElementById('verify-otp').style.display = 'block';
  
            // Store confirmationResult to use for verifying OTP
            window.confirmationResult = confirmationResult;
          })
          .catch(function (error) {
            console.error("Error during OTP sending: ", error);
          });
      }
    } else {
      alert("Please enter a valid phone number.");
    }
  });
  
  // Verify OTP
  document.getElementById('verify-otp').addEventListener('click', function() {
    const otp = document.getElementById('otp').value;
    confirmationResult.confirm(otp).then(function (result) {
      // User signed in successfully.
      const user = result.user;
      console.log("User signed in: ", user);
    }).catch(function (error) {
      console.error("Error verifying OTP: ", error);
    });
  });
  
// login-modal.js - Handles loading the login popup

document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const modal = document.getElementById('loginModal');
    const modalContent = document.querySelector('.modal-content');
    const loginBtn = document.querySelector('nav a[href="#login"]');
    
    // Open modal when login button is clicked
    if (loginBtn) {
      loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loadLoginModal();
      });
    }
    
    // Function to load login.html content
    function loadLoginModal() {
      fetch('login.html')
        .then(response => response.text())
        .then(html => {
          // Create temporary container to parse HTML
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = html;
          
          // Get the login content (assuming login.html has a div with class 'login-container')
          const loginContent = tempDiv.querySelector('.login-container').innerHTML;
          
          // Insert into modal with close button
          modalContent.innerHTML = `
            <span class="close-modal">&times;</span>
            ${loginContent}
          `;
          
          // Show modal
          modal.style.display = 'block';
          document.body.style.overflow = 'hidden'; // Prevent scrolling
          
          // Initialize any login form functionality
          initLoginForm();
          
          // Add close event
          document.querySelector('.close-modal').addEventListener('click', closeModal);
        })
        .catch(error => {
          console.error('Error loading login modal:', error);
          // Fallback - redirect to login page if modal fails
          window.location.href = 'login.html';
        });
    }
    
    function closeModal() {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
    
    // Close modal when clicking outside content
    window.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
    
    // Close with ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
      }
    });
    
    // Initialize login form
    function initLoginForm() {
      const loginForm = document.getElementById('loginForm');
      if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Get form values
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          
          // Simple validation
          if (!email || !password) {
            showAlert('Please fill in all fields', 'error');
            return;
          }
          
          // Here you would normally send to your server
          console.log('Login attempt:', { email, password });
          
          // Simulate successful login
          showAlert('Login successful!', 'success');
          setTimeout(() => {
            closeModal();
            // Update UI to show logged in state
            updateLoginUI(true);
          }, 1500);
        });
      }
    }
    
    function showAlert(message, type) {
      // Remove existing alerts
      const existingAlert = document.querySelector('.login-alert');
      if (existingAlert) existingAlert.remove();
      
      const alertDiv = document.createElement('div');
      alertDiv.className = `login-alert alert-${type}`;
      alertDiv.textContent = message;
      
      const loginForm = document.getElementById('loginForm');
      if (loginForm) {
        loginForm.prepend(alertDiv);
        
        setTimeout(() => {
          alertDiv.remove();
        }, 3000);
      }
    }
    
    function updateLoginUI(isLoggedIn) {
      if (isLoggedIn) {
        loginBtn.innerHTML = '<i class="fas fa-user"></i> Account';
        loginBtn.href = '#account';
      }
    }
  });

//   register page
// Add this to the initLoginForm function
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      // ... existing login form code ...
      
      // Handle register link
      const registerLink = loginForm.querySelector('a[href="#register"]');
      if (registerLink) {
        registerLink.addEventListener('click', function(e) {
          e.preventDefault();
          closeModal();
          loadRegisterModal();
        });
      }
    }
  }
  
  // Add new function to load registration modal
  function loadRegisterModal() {
    fetch('register.html')
      .then(response => response.text())
      .then(html => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const registerContent = tempDiv.querySelector('.register-container').innerHTML;
        
        modalContent.innerHTML = `
          <span class="close-modal">&times;</span>
          ${registerContent}
        `;
        
        modal.style.display = 'block';
        initRegisterForm();
        document.querySelector('.close-modal').addEventListener('click', closeModal);
        
        // Handle login link in registration form
        const loginLink = document.querySelector('.login-link');
        if (loginLink) {
          loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal();
            loadLoginModal();
          });
        }
      })
      .catch(error => {
        console.error('Error loading registration modal:', error);
        window.location.href = 'register.html';
      });
  }
  
  // Initialize registration form
  function initRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;
        
        // Validation
        if (password !== confirm) {
          showAlert('Passwords do not match', 'error');
          return;
        }
        
        // Here you would send to your server
        console.log('Registration attempt:', { name, email, password });
        
        // Simulate successful registration
        showAlert('Registration successful!', 'success');
        setTimeout(() => {
          closeModal();
          loadLoginModal(); // Return to login after registration
        }, 1500);
      });
    }
  }
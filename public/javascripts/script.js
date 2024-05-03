// Signup page validation script 
document.getElementById("pwd").addEventListener("input", function () {
  var password = this.value;

  // Check password complexity and update suggestion message
  var regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;
  var suggestionMessage = "Password should contain at least one uppercase letter, one special symbol, and one number.";
  if (regex.test(password)) {
      suggestionMessage = ""; // Clear suggestion message if password meets complexity requirements
  }

  document.getElementById("passwordSuggestion").textContent = suggestionMessage;
});

function validateForm() {
  var password = document.getElementById("pwd").value;
  var confirmPassword = document.getElementById("pwd2").value;

  // Check if passwords match
  if (password !== confirmPassword) {
      document.getElementById("passwordError").textContent = "Passwords don't match";
      document.getElementById("passwordError").style.display = "block";
      return false; // Prevent form submission
  }

  // Check password complexity
  var regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;
  if (!regex.test(password)) {
      document.getElementById("passwordError").textContent = "Password must contain at least one uppercase letter, one special symbol, and one number";
      document.getElementById("passwordError").style.display = "block";
      return false; // Prevent form submission
  }

  return true; // Allow form submission
}

function togglePasswordVisibility() {
  var pwdInput = document.getElementById("pwd");
  var eyeIcon = document.getElementById("eyeIcon");

  
  if (pwdInput.type === "password") {
    pwdInput.type = "text";
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.title = "Hide password"; 
    eyeIcon.classList.add("fa-eye");
  } else {
    pwdInput.type = "password";
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.title = "Show password";
    eyeIcon.classList.add("fa-eye-slash");
  }

}

  function showFlashMessage(message) {
      const flashDiv = document.getElementById('flash-messages');
      setTimeout(() => {
          flashDiv.style.display = 'none';
      }, 8000);
  }

  // Show flash message
  showFlashMessage('{{error}}');


 


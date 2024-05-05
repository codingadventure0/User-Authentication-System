// Popup code of Profile Update
// Get the modal
var modal = document.getElementById("updateProfilePictureModal");

// Get the button that opens the modal
var editImgBtn = document.querySelector(".edit-img");
var editDetails = document.querySelector(".edit-button")

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the pencil icon, open the modal
editImgBtn.onclick = function() {
  modal.style.top = "0"; 
  modal.style.left = "0"; 
  modal.style.display = "block";
}

// When the user clicks the Update details, open the modal
editDetails.onclick = function() {
  modal.style.top = "0"; 
  modal.style.left = "0";
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
  span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
//window.onclick = function(event) {
//  if (event.target == modal) {
//    modal.style.display = "none";
//  }
//}

// Handle saving the new profile details
var updateProfileDetailsBtn = document.getElementById("updateProfileDetailsBtn");
updateProfileDetailsBtn.onclick = function() {
    var newProfilePictureUrl = document.getElementById("profilePictureUrlInput").value;
    var newName = document.getElementById("nameInput").value;
    var newBatch = document.getElementById("batchInput").value;
    var newGender = document.getElementById("gender").value; // Get selected gender
    
    fetch('/user/updateProfilePictureUrl', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            newProfilePictureUrl: newProfilePictureUrl,
            newName: newName,
            newBatch: newBatch,
            newGender: newGender 
          })
    }).then(response => {
        window.location.href = '/user/profile';
    });
}


// Get the modal for resetting password
var resetPasswordModal = document.getElementById("resetPasswordModal");

// Get the button that opens the modal
var resetPasswordBtn = document.querySelector(".reset-button");

// When the user clicks the Reset Password button, open the modal
resetPasswordBtn.onclick = function() {
resetPasswordModal.style.display = "block";
};


// Get the span element that closes the reset password modal
var resetPasswordCloseBtn = document.getElementById("resetPasswordModal").getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the reset password modal
resetPasswordCloseBtn.onclick = function() {
resetPasswordModal.style.display = "none";
};


window.onclick = function(event) {
if (event.target == resetPasswordModal) {
    resetPasswordModal.style.display = "none";
}else if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Handle resetting the password
var resetPasswordBtn = document.getElementById("resetPasswordBtn");
resetPasswordBtn.onclick = function() {
var oldPassword = document.getElementById("oldPassword").value;
var newPassword = document.getElementById("newPassword").value;
var confirmPassword = document.getElementById("confirmPassword").value;

// Validate input fields

// Send AJAX request to server
fetch('/user/resetPassword', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
    })
}).then(response => {
    // Handle response
    // Display success or error message to user
    resetPasswordModal.style.display = "none";
});
};
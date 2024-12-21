function editProfile() {
  // Hide profile details and show the edit form
  document.getElementById('profile-details').style.display = 'none';
  document.getElementById('profile-form').style.display = 'block';
}

function saveProfile(event) {
  // Prevent form submission
  event.preventDefault();

  // Get the values from the input fields
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const preferences = document.getElementById('preferences').value;

  // Update the profile details with the new values
  document.getElementById('user-name').textContent = name;
  document.getElementById('user-email').textContent = email;
  document.getElementById('user-preferences').textContent = preferences;

  // Hide the edit form and show the updated profile details
  document.getElementById('profile-form').style.display = 'none';
  document.getElementById('profile-details').style.display = 'block';

  // Show a confirmation message (you can replace this with a more sophisticated notification)
  alert('Profile updated successfully!');
}

function cancelEdit() {
  // Hide the edit form and show the profile details without saving
  document.getElementById('profile-form').style.display = 'none';
  document.getElementById('profile-details').style.display = 'block';
}

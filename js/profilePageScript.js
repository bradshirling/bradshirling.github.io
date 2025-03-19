function loadProfilePicture(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const outputCreate = document.getElementById('profile-picture');
        const outputEdit = document.getElementById('profile-picture-display');
        outputCreate.src = reader.result;
        outputEdit.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

function saveProfile() {
    const name = document.getElementById('profile-name').value;
    const bio = document.getElementById('profile-bio').value;
    const pictureSrc = document.getElementById('profile-picture').src;

    if (name && bio) {
        document.getElementById('profile-name-text').textContent = name;
        document.getElementById('profile-bio-text').textContent = bio;
        document.getElementById('profile-picture-display').src = pictureSrc;
        document.getElementById('profile-name').value = '';
        document.getElementById('profile-bio').value = '';
        document.getElementById('profile-picture').src = '../images/default-profile.png';
        document.getElementById('create-profile-section').classList.add('hidden');
        document.getElementById('profile-information-section').classList.remove('hidden');
        document.getElementById('edit-profile-button').style.display = 'block';
    } else {
        alert('Please enter both name and bio.');
    }
}

function enableEditing() {
    const editButtons = document.querySelectorAll('.edit-button');
    const isEditing = editButtons[0].style.display === 'inline-block';

    if (isEditing) {
        editButtons.forEach(button => {
            button.style.display = 'none';
        });
        document.getElementById('edit-profile-picture-button').style.display = 'none';
        document.getElementById('save-changes-button').style.display = 'none';
        document.getElementById('edit-profile-button').style.display = 'block';
    } else {
        editButtons.forEach(button => {
            button.style.display = 'inline-block';
        });
        document.getElementById('edit-profile-picture-button').style.display = 'block';
        document.getElementById('save-changes-button').style.display = 'block';
        document.getElementById('edit-profile-button').style.display = 'none';
    }
}

function saveChanges() {
    enableEditing();
}

function editProfile(field) {
    if (field === 'name') {
        const name = prompt('Edit Name:', document.getElementById('profile-name-text').textContent);
        if (name !== null) {
            document.getElementById('profile-name-text').textContent = name;
        }
    } else if (field === 'bio') {
        const bio = prompt('Edit Bio:', document.getElementById('profile-bio-text').textContent);
        if (bio !== null) {
            document.getElementById('profile-bio-text').textContent = bio;
        }
    }
}

function toggleMode() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('mode', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

document.addEventListener('DOMContentLoaded', (event) => {
    const mode = localStorage.getItem('mode');
    if (mode === 'light') {
        document.body.classList.add('light-mode');
        document.getElementById('mode-toggle').checked = true;
    }
});

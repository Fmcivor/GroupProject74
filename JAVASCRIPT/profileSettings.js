//LEAD DEVELOPER - FINTAN 
//Form styling and show button - MATTHEW



//^ DEVELOPMENT PURPOSES

let userID = sessionStorage.getItem("userID");
let username = sessionStorage.getItem("username");
let displayName = sessionStorage.getItem("displayName");

let errorMessage = '<ul>';

const usernameInput = document.getElementById('username');
const displayNameInput = document.getElementById('displayName');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword')
const saveProfileBtn = document.getElementById('saveProfileBtn');
const exitBtn = document.getElementById('exitBtn');
const messageContainer = document.getElementById('messageContainer');


document.addEventListener('DOMContentLoaded', function () {

    usernameInput.value = username;
    displayNameInput.value = displayName
});

const showButton = document.getElementById('togglePassword');
showButton.addEventListener('click', togglePassword);

function togglePassword() {
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    if (password.type == "password") {
        password.type = "text";
        confirmPassword.type = "text";
    } else {
        password.type = "password";
        confirmPassword.type = "password";
    }
}

document.getElementById('password').addEventListener('input', function (event) {
    const confirmPasswordField = document.getElementById('confirmPassword');
    if (event.target.value.trim() == '') {
        confirmPasswordField.classList.add('disabled');
        confirmPasswordField.setAttribute('disabled', true);
        confirmPasswordField.value = '';

    }
    else {
        confirmPasswordField.classList.remove('disabled');
        confirmPasswordField.removeAttribute('disabled');
    }
});



exitBtn.addEventListener('click', function () {
    window.location.href = 'mainMenu.html';
});


saveProfileBtn.addEventListener('click', validateChanges);



async function validateChanges(event) {
    event.preventDefault();
    saveProfileBtn.setAttribute('disabled',true);
    //reset
    errorMessage = '<ul>';

    let enteredUsername = usernameInput.value;
    let enteredDisplayName = displayNameInput.value;
    let enteredPassword = passwordInput.value;
    let enteredConfirmPassword = confirmPasswordInput.value;

    let validUsername = await validateUsername(enteredUsername);
    let validDisplayName = validateDisplayName(enteredDisplayName);
    let validPassword = true;
    let validConfirmPassword = true;
    if (enteredPassword.trim() != '') {
        validPassword = validatePassword(enteredPassword);
        validConfirmPassword = validateConfirmPassword(enteredPassword, enteredConfirmPassword);
    }


    if (validUsername && validDisplayName && validPassword && validConfirmPassword) {
        await updateProfile(enteredUsername, enteredDisplayName, enteredPassword);
        usernameInput.classList.remove('invalid')
        displayNameInput.classList.remove('invalid')
        passwordInput.classList.remove('invalid')
        confirmPasswordInput.classList.remove('invalid')

        passwordInput.value = '';
        confirmPasswordInput.value = '';
        confirmPasswordInput.classList.add('disabled');
        confirmPasswordInput.setAttribute('disabled', true);

        
    }
    else {
        displayMessage(false);
    }

    saveProfileBtn.removeAttribute('disabled');
}

async function validateUsername(enteredUsername) {
    let usernameRegex = /^[a-zA-Z0-9.]{5,20}$/;
    if (usernameRegex.test(enteredUsername) == false) {
        errorMessage += '<li>The username must be bewtween 5 and 20 characters and consist of letters and numbers only.</li>';
        usernameInput.classList.add('invalid');
        return false;
    }

    let query = `SELECT userID FROM tblUser WHERE username = '${enteredUsername}' AND userID != '${userID}' `;
    dbConfig.set('query', query);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        if (result.success) {
            if (result.data.length > 0) {
                errorMessage += '<li>The username is already in use</li>';
                usernameInput.classList.add('invalid');
                return false;
            }
        }
    } catch (error) {
        alert('error checking if username is taken');
        console.log(error);
        usernameInput.classList.add('invalid');
        return false;
    }

    usernameInput.classList.remove('invalid');
    return true;
}

function validateDisplayName(enteredDisplayName) {
    let displayNameRegex = /^[a-zA-Z]{1,15}$/;

    if (displayNameRegex.test(enteredDisplayName) == false) {
        errorMessage += '<li>The display name must not be null and contain letters only.</li>';
        displayNameInput.classList.add('invalid');
        return false;
    }

    displayNameInput.classList.remove('invalid');
    return true;
}

function validatePassword(enteredPassword) {
    let passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,20}$/;

    if (passwordRegex.test(enteredPassword) == false) {
        errorMessage += '<li>The password must be 8 or more characters long and contain at least 1 upper case character, number and special character.</li>';
        passwordInput.classList.add('invalid');
        return false;
    }

    passwordInput.classList.remove('invalid');
    return true;
}

function validateConfirmPassword(enteredPassword, enteredConfirmPassword) {
    if (enteredPassword !== enteredConfirmPassword) {
        errorMessage += '<li>The passwords must match.</li>';
        return false;
    }

    confirmPasswordInput.classList.remove('invalid');
    return true;
}


async function updateProfile(enteredUsername, enteredDisplayName, enteredPassword) {
    let query;
    if (enteredPassword == '') {
        query = `UPDATE tblUser SET username = '${enteredUsername}', displayName ='${enteredDisplayName}' WHERE userID =${userID}`;
    }
    else {
        query = `UPDATE tblUser SET username = '${enteredUsername}', displayName ='${enteredDisplayName}', userPassword = '${enteredPassword}' WHERE userID =${userID}`;
    }
    dbConfig.set('query', query);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        if (result.success && result.affected_rows ==1) {
            displayMessage(true);
            sessionStorage.setItem("username", enteredUsername);
            sessionStorage.setItem("displayName", enteredDisplayName);
        }
    } catch (error) {
        alert("Error updating", error);
        console.log(error);
    }
}

function displayMessage(success) {
    let header = '';
    let headerColor = '';
    let message = '';
    if (success) {
        header = 'Success';
        headerColor = 'white';
        message += '<p>Your profile has successfully been updated!</p>';
        document.getElementById('messageContent').innerHTML = message;
    }
    else {
        header = 'Invalid';
        headerColor = 'red';

        errorMessage += '<ul>';

        document.getElementById('messageContent').innerHTML = errorMessage;
    }


    const headerElement = document.getElementById('messageHeader');
    headerElement.textContent = header;
    headerElement.style.color = headerColor;

    messageContainer.style.display = 'flex';



}

const closeBtn = document.querySelector('.closeBtn');
closeBtn.addEventListener('click', function () {
    messageContainer.style.display = 'none';
});

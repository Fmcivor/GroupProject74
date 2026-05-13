//LEAD DEVELOPER - FINTAN 
//Form styling and show button - MATTHEW


//^ DEVELOPMENT PURPOSES


let errorMessage = '<ul>';
sessionStorage.setItem("easyReadOn",JSON.stringify(false));


const loginBtn = document.getElementById('loginBtn');
const exitBtn = document.getElementById('exitBtn');
const messageContainer = document.getElementById('messageContainer');



const showButton = document.getElementById('togglePassword');
showButton.addEventListener('click', togglePassword);

function togglePassword() {
    const password = document.getElementById("password");
    if (password.type == "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
}







loginBtn.addEventListener('click', validateLogin);

async function validateLogin(event) {
    event.preventDefault();

    let enteredUsername = document.getElementById('username').value;
    let enteredPassword = document.getElementById('password').value;

    let postBody = {
        username: enteredUsername,
        password: enteredPassword
    }
    
    try {
        let response = await fetch("http://localhost:5257/api/Users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postBody)
        });

        let result = await response.json();

        if (result != null) {
            let user = result;

            sessionStorage.setItem("username", user.username);
            sessionStorage.setItem("displayName", user.displayName);
            sessionStorage.setItem("userID", user.id);
            sessionStorage.setItem("fontSize",user.fontSize);

            window.location.href = "mainMenu.html";
        }
        else {
            let message = '<p>Invalid login details.';
            let header = 'INVALID';
            document.getElementById('messageContent').innerHTML = message;
            const headerElement = document.getElementById('messageHeader');
            document.getElementById('messageHeader').textContent = header;
            messageContainer.style.display = 'flex';

        }
    } catch (error) {
        console.error("Error occurred while checking database for the entered login details", error);
        let message = '<p>An error has occurred while checking the login details you have entered.';
        let header = 'ERROR';
        document.getElementById('messageContent').innerHTML = message;
        document.getElementById('messageHeader').textContent = header;
        messageContainer.style.display = 'flex';
    }
}





const closeBtn = document.querySelector('.closeBtn');
closeBtn.addEventListener('click', function () {
    messageContainer.style.display = 'none';
});



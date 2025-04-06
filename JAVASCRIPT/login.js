//LEAD DEVELOPER - FINTAN 






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

    let loginQuery = `SELECT userID, username, displayName, fontSize FROM tblUser WHERE BINARY username ='${enteredUsername}' AND BINARY userPassword ='${enteredPassword}'`;
    dbConfig.set("query", loginQuery);
    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        if (result.success && result.data.length > 0) {
            let user = result.data[0];

            sessionStorage.setItem("username", user.username);
            sessionStorage.setItem("displayName", user.displayName);
            sessionStorage.setItem("userID", user.userID);
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



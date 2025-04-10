// Lead Developer - Matthew Connolly

const showButton = document.getElementById('togglePassword');
showButton.addEventListener('click', togglePassword);
let errorMessage = '<ul>';

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
// main logic triggered when you press register button
document.getElementById("registerBtn").addEventListener("click", async function (event) {

   event.preventDefault();
   errorMessage = "<ul>";


// get form values
   let username = document.getElementById("username").value;
   let displayName = document.getElementById('displayName').value;
   let password = document.getElementById("password").value;
   let confirmPassword = document.getElementById("confirmPassword").value;


// run all validations
   let validUsername = await validateUsername(username);
   let validDisplayName = validateDisplayName(displayName);
   let validPassword = validatePassword(password);
   let validConfirmPassword = validateConfirmPassword(password, confirmPassword);


   if (validUsername && validDisplayName && validPassword && validConfirmPassword) {
      password = await hashPassword(password); // hash password before stored
      console.log("All validations passed. Submitting form...")

      // SQL to insert new user
      let insertQuery = `INSERT INTO tblUser (username, userPassword, displayName) 
                        VALUES ('${username}', '${password}','${displayName}');`;
      dbConfig.set('query', insertQuery);
      try {
         let insertResponse = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
         });

         let insertResult = await insertResponse.json();

         if (insertResult.success) {

            let selectQuery = "SELECT userID FROM tblUser ORDER BY userID DESC LIMIT 1;";
            dbConfig.set('query', selectQuery);
            try {
               let selectResponse = await fetch(dbConnectorUrl, {
                  method: "POST",
                  body: dbConfig
               });

               let selectResult = await selectResponse.json();

               if(selectResult.success) {

                  sessionStorage.setItem("username", username);
                  sessionStorage.setItem("displayName", displayName);
                  sessionStorage.setItem("userID", selectResult.data[0].userID);
                  sessionStorage.setItem("fontSize", "16");

                  window.location.replace("mainMenu.html");
               }
               else {
                  // error handling when registering new user
                  errorMessage = '<p>Error registering user</p>';
                  document.getElementById('messageContent').innerHTML = errorMessage;
                  const headerElement = document.getElementById('messageHeader');
                  headerElement.textContent = "ERROR";

                  messageContainer.style.display = 'flex';
               }
            }
            catch (error) {
               console.log("Error retrieving UserID")
            }
         } else {
            errorMessage = '<p>Error registering user</p>';
            document.getElementById('messageContent').innerHTML = errorMessage;
            const headerElement = document.getElementById('messageHeader');
            headerElement.textContent = "ERROR";

            messageContainer.style.display = 'flex';
         }

      } catch (error) {
         errorMessage = '<p>Error registering user</p>';
         document.getElementById('messageContent').innerHTML = errorMessage;
         const headerElement = document.getElementById('messageHeader');
         headerElement.textContent = "ERROR";

         messageContainer.style.display = 'flex';
      }
   }
   else {
      // show errors to user in pop up
      errorMessage += '</ul>';
      document.getElementById('messageContent').innerHTML = errorMessage;
      const headerElement = document.getElementById('messageHeader');
      headerElement.textContent = "INVALID";

      messageContainer.style.display = 'flex';
   }
});




async function validateUsername(enteredUsername) {
   let usernameRegex = /^[a-zA-Z0-9]{5,20}$/;
   if (usernameRegex.test(enteredUsername) == false) {
      errorMessage += `<li>Username must be between 5 and 20 characters long and can only contain letters, numbers.</li>`;
      return false;
   }

   let selectQuery = `SELECT username FROM tblUser WHERE BINARY username = '${enteredUsername}'`;
   dbConfig.set('query', selectQuery);

   try {
      let checkResponse = await fetch(dbConnectorUrl, {
         method: "POST",
         body: dbConfig
      });


      let checkResult = await checkResponse.json();
      //username already exists in the database
      if (checkResult.success && checkResult.data.length > 0) {
         errorMessage += `<li>Username already exists.</li>`;
         return false;
      }

      // Username is valid and doesn't exist
      return true;

   } catch (error) {
      console.error("Error checking for existing accounts:", error);
      errorMessage = '<p></p>';
      document.getElementById('messageContent').innerHTML = errorMessage;
      const headerElement = document.getElementById('messageHeader');
      headerElement.textContent = "ERROR";

      messageContainer.style.display = 'flex';

      return false;
   }
}

// VALIDATION FUNCTIONS


// Validate username with regex and check uniqueness in database
function validateDisplayName(enteredDisplayName) {


   let displayNameRegex = /^[a-zA-Z-\s]{1,15}$/;
   if (!enteredDisplayName) {
      errorMessage +=`<li>Display name cannot be blank.</li>`;

      return false;
   }
   return true;
}

function validatePassword(enteredPassword) {
   let passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
   
   if (!enteredPassword) {
      errorMessage += `<li>Password cannot be empty.</li>`;
      return false;
   }
   if (enteredPassword.length < 8 || enteredPassword.length > 20) {
      errorMessage += `<li>Password must be between 8 and 20 characters long.</li>`;
      return false;
   }
   if (!/[A-Z]/.test(enteredPassword)) {
      errorMessage += `<li>Password must contain at least one uppercase letter.</li>`;
      return false;
   }
   if (!/[0-9]/.test(enteredPassword)) {
      errorMessage += `<li>Password must contain at least one number.</li>`;
      return false;
   }
   if (!/[!@#$%^&*]/.test(enteredPassword)) {
      errorMessage += `<li>Password must contain at least one special character (!@#$%^&*).</li>`;
      return false;
   }

   return true;
}

function validateConfirmPassword(enteredPassword, enteredConfirmPassword) {
   if (enteredPassword !== enteredConfirmPassword) {
      errorMessage += `<li>Passwords are not matching.</li>`
      return false;

   }
   return true;
}


function displayMessage() {
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





}

const closeBtn = document.querySelector('.closeBtn');
closeBtn.addEventListener('click', function () {
   messageContainer.style.display = 'none';
});



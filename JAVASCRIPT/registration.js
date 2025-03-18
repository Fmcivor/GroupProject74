
const dbConnectorUrl = "https://mconnolly58.webhosting1.eeecs.qub.ac.uk/dbConnector.php";

let dbConfig = new URLSearchParams({
   hostname: 'localhost',
   username: 'mconnolly58',
   password: 'hRGhvYnr5D28J4kj',
   database: 'CSC1034_CW_74',
});
const keyID = 1;

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

document.getElementById("registerBtn").addEventListener("click", async function (event) {

   event.preventDefault();

   let username = document.getElementById("username").value;
   let displayName = document.getElementById('displayName').value;
   let password = document.getElementById("password").value;
   let confirmPassword = document.getElementById("confirmPassword").value;

   let validUsername = await validateUsername(username);
   let validDisplayName = validateDisplayName(displayName);
   let validPassword = validatePassword(password);
   let validConfirmPassword = validateConfirmPassword(password, confirmPassword);
});




async function validateUsername(enteredUsername) {
   let usernameRegex = /^[a-zA-Z0-9.]{5,20}$/;
   if (usernameRegex.test(enteredUsername) == false) {
      return false;
   }

   let selectQuery = `SELECT username FROM tblUsers WHERE username = '${enteredUsername}'`;
   dbConfig.set('query', selectQuery);

   try {
      let checkResponse = await fetch(dbConnectorUrl, {
         method: "POST",
         body: dbConfig
      });


      let checkResult = await checkResponse.json();
      //username already exists in the database
      if (checkResult.success && checkResult.data.length > 0) {
         document.getElementById("registerMessage").textContent =
            "Username already exists.";
         return false;
      }

      // Username is valid and doesn't exist
      document.getElementById("registerMessage").textContent = "Username is valid";
      return true;

   } catch (error) {
      console.error("Error checking for existing accounts:", error);
      document.getElementById("registerMessage").textContent =
         "Error checking username availability. Please try again.";
      return false;
   }
}





function validateDisplayName(enteredDisplayName) {
   let displayNameRegex = /^[a-zA-Z-]{1,15}$/;
   if (displayNameRegex.test(enteredDisplayName) == false) {
      return false;
   }
   return true;
}

function validatePassword(enteredPassword) {
   let passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
   if (passwordRegex.test(enteredPassword) == false) {
      return false;
   }
   return true;
}

function validateConfirmPassword(enteredPassword, enteredConfirmPassword) {
   if (enteredPassword !== enteredConfirmPassword) {
      return false;

   }
   return true;
}

if (validUsername && validDisplayName && validPassword && validConfirmPassword) {
   console.log("All validations passed. Submitting form...")
   let insertQuery = `INSERT INTO tblUser (username, pw)
VALUES ('${username}', '${password}')`;
   dbConfig.set('query', insertQuery);
   try {
      let insertResponse = await fetch(dbConnectorUrl, {
         method: "POST",
         body: dbConfig
      });
      let insertResult = await insertResponse.json();
      if (insertResult.success) {
         document.getElementById("registerMessage").textContent = "Registration successful!";
         document.getElementById("registerForm").reset();
      } else {
         document.getElementById("registerMessage").textContent = "Error registering user.";
      }
   } catch (error) {
      console.error("Error registering user:", error);
   }
}
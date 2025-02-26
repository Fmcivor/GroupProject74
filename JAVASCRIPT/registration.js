const showButton = document.getElementById('togglePassword');
showButton.addEventListener('click',togglePassword);

function togglePassword() {
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");
    if(password.type == "password") {
     password.type = "text";
     confirmPassword.type ="text";
    } else 
    {
     password.type = "password";
     confirmPassword.type = "password";
    }
 }
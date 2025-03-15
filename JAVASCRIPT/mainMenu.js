/*
const confirmNo = document.getElementById("confirmNo");
const signOutConfirm = document.getElementById("signOutConfirm");
const btnSignOut = document.getElementById("btnSignOut");

confirmNo.addEventListener("click",function(){
    signOutConfirm.style.visibility = "hidden";
});

btnSignOut.addEventListener("click", function(){
    signOutConfirm.style.visibility = "visible";
});
*/

document.addEventListener("DOMContentLoaded", function () {
    const btnSignOut = document.getElementById("btnSignOut");
    const signOutConfirm = document.getElementById("signOutConfirm");
    const cancelSignOut = document.getElementById("confirmNo"); // Fix variable reference

    if (btnSignOut && signOutConfirm && cancelSignOut) {
        btnSignOut.addEventListener("click", function () {
            signOutConfirm.style.display = "flex"; // Show the confirmation (not block)
        });

        cancelSignOut.addEventListener("click", function () {
            signOutConfirm.style.display = "none"; // Hide when cancel is clicked
        });
    } else {
        console.error("One or more elements are missing in the DOM.");
    }
});




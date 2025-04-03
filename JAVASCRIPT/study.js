

const studyDefault = {
    "ID": 1,
    "room": "Study",
    "description": `You enter the Study. Rows of books line a grand bookshelf, a time-worn repository of knowledge.
                     A polished oak desk sits in the center, a relic of a different era. An old computer rests 
                    silently atop it, and a picture frame sits on the windowsill.`,
    "ImageHREF": "Images/study.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Turn on Computer",
            "response": turnOnComputer
        },
        {
            "id": 1,
            "Text": "Inspect the picture frame",
            "response": checkPictureFrame
        },
        {
            "id": 2,
            "Text": "Search Drawers",
            "response": searchDrawers
        },
        {
            "id": 3,
            "Text": "Exit Study",
            "response": leaveStudy
        }
    ]
}

document.addEventListener('DOMContentLoaded', async function () {

    let states = [];

    states.push(studyDefault,computerLoginScreen);
  
    let currentStateID = Number(sessionStorage.getItem('currentState'));
    states.forEach(state => {
        if (state.ID == currentStateID) {
            currentState = state;
            return;
        }
    });
    
    updateState();
})

function leaveStudy(){
    goToNextRoom('downStairsHall.html',4);
}

function checkPictureFrame(){
    let button = document.getElementById(responseId);
    button.style.color = 'rgb(153, 153, 153)';
    button.querySelector('i').style.color = 'rgb(153, 153, 153)';
    addClue(computerClueID);

    setResponse("You lift the frame and wipe away a thin layer of dust. The image is of a small spaniel sitting proudly. Below, an inscription reads: 'My dear Luna - 2008.' A pet's name and a year... Could this be useful somwhere?");
}

function searchDrawers(){
    let button = document.getElementById(responseId);
    button.style.color = 'rgb(153, 153, 153)';
    button.querySelector('i').style.color = 'rgb(153, 153, 153)';
    setResponse("The top drawer is locked. Maybe I could get in somehow...");
}



function turnOnComputer(){
    let button = document.getElementById(responseId);
    button.style.color = 'rgb(153, 153, 153)';
    button.querySelector('i').style.color = 'rgb(153, 153, 153)';
    electricityOn = true;
    if(electricityOn){
        currentState = computerLoginScreen;
        updateState();
        setResponse("The computer boots to a login screen. What could the password be?");
    }
    else{
        setResponse("Nothing happens. I must turn on the power somehow...");
    }
}

const computerLoginScreen = {
    "ID": 2,
    "room": "Study",
    "description": `You enter the Study. Rows of books line a grand bookshelf, a time-worn repository of knowledge.
                     A polished oak desk sits in the center, a relic of a different era. An old computer rests 
                    silently atop it, and a picture frame sits on the windowsill.`,
    "ImageHREF": "Images/computerLogin.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Attempt Password",
            "response": tryPassword
        },
        {
            "id": 1,
            "Text": "Turn off computer",
            "response": goToStudy
        },
    ]
}

function goToStudy(){
    currentState = studyDefault;
    updateState();
}

function tryPassword() {
    openModal();
}

btnenterPassword.addEventListener('click', checkPassword);

function checkPassword() {
    let input = document.getElementById("passwordInput").value;
    let correctPassword = "Luna2008";
    closeModal();

    if (input === correctPassword) {
        setResponse("The computer unlocks. Files and folders fill the screen, waiting to be explored.");
    } else {
        setResponse("Incorrect Password");
    }
}


function openModal() {
    document.getElementById("signOutModal").style.display = "flex";
    document.getElementById("passwordInput").value = "";
}

function closeModal() {
    document.getElementById("signOutModal").style.display = "none";
}

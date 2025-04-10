//Dylan's code

const studyDefault = {
    "ID": 1,
    "room": "Study",
    //Text displayed when the user enters the study
    "description": `You enter the Study. Rows of books line a grand bookshelf, a time-worn repository of knowledge.
                     A polished oak desk sits in the center, a relic of a different era. An old computer rests 
                    silently atop it, and a picture frame sits on the windowsill.`,
    "ImageHREF": "Images/study.jpg",
    //All options for the user to interact with
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

    states.push(studyDefault,computerLoginScreen,computerUnlocked);
  
    let currentStateID = Number(sessionStorage.getItem('currentState'));
    currentState = states.find(state => state.ID == currentStateID) || studyDefault;
    
    updateState();
})
//When user clicks to leave the study, they are taken to the downStairsHall
function leaveStudy(){
    goToNextRoom('downStairsHall.html',4);
}

async function checkPictureFrame(){
    //This function is called when the user clicks on the picture frame in the study
    let button = document.getElementById(responseId);
    button.style.color = 'rgb(153, 153, 153)';
    button.querySelector('i').style.color = 'rgb(153, 153, 153)';
    //Checks if the clue is already in the clueList, if not, it adds it to the list
    if(!clueList.some(clue => clue.clueID == computerClueID)){
        await addClue(computerClueID);
    }
    setResponse("You lift the frame and wipe away a thin layer of dust. The image is of a small spaniel sitting proudly. Below, an inscription reads: 'My dear Luna - 2008.' A pet's name and a year... Could this be useful somwhere?");
}

function searchDrawers(){
    //This function is called when the user clicks on the drawers in the study
    let button = document.getElementById(responseId);
    button.style.color = 'rgb(153, 153, 153)';
    button.querySelector('i').style.color = 'rgb(153, 153, 153)';
    if(!clueList.some(clue => clue.clueID == drawerClueID)){
        //Checks if the clue is already in the clueList, if not, it adds it to the list
        setResponse("The top drawer is locked. Maybe I could get in somehow...");
    }
    else{
        setResponse("The drawer is empty.");
    }    
}



function turnOnComputer(){
    //This function is called when the user clicks on the computer in the study
    let button = document.getElementById(responseId);
    button.style.color = 'rgb(153, 153, 153)';
    button.querySelector('i').style.color = 'rgb(153, 153, 153)';
    electricityOn = true;
    if(electricityOn){
        //Checks if the electricity is on, if so, it turns on the computer
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
    //Text displayed when the user turns on the computer
    "description": `You enter the Study. Rows of books line a grand bookshelf, a time-worn repository of knowledge.
                     A polished oak desk sits in the center, a relic of a different era. An old computer rests 
                    silently atop it, and a picture frame sits on the windowsill.`,
    "ImageHREF": "Images/computerLogin.jpg",
    //All options for the user to interact with
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

const computerUnlocked = {
    "ID": 3,
    "room": "Study",
    //Text displayed when the user logs onto the computer
    "description": `The computer unlocks. An email is displayed, dated 9th february 2006. The message reads: Charles,
    It’s been too long. I hate how we left things, and I’d rather remember the years of friendship than the mistakes.
    Let’s meet for a drink — no tension, just a proper conversation.
    — Jonathan `,
    "ImageHREF": "Images/computerLogin.jpg",
    //Option for the user to interact with
    "interactions": [
        {
            "id": 0,
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
    //Opens the modal for the user to enter the password
    openModal();
}

btnenterPassword.addEventListener('click', checkPassword);

async function checkPassword() {
    //This function is called when the user clicks on the enter button in the modal
    //It checks if the password is correct and if so, it unlocks the computer
    let input = document.getElementById("passwordInput").value;
    let correctPassword = "Luna2008";
    closeModal();

    if (input === correctPassword) {
        sessionStorage.setItem('currentState', 3);
        currentState = computerUnlocked;
        updateState();
        if(!clueList.some(clue => clue.clueID == emailClueID)){
            await addClue(emailClueID);
        }
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

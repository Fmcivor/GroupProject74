//DEVELOPER: CALLUM

//VARIABLES
let murderWeaponFound = (sessionStorage.getItem("murderWeaponFound") === 'true');
let victorClueFound = (sessionStorage.getItem("victorGuiltyClue") === 'true');
let jonathanAlibiFound = (sessionStorage.getItem("jonathanInnocentClue") === 'true');
let margaretAlibiFound = (sessionStorage.getItem("margaretInnocentClue") === 'true');
let suspectAccused = sessionStorage.getItem("suspectAccused");

//CONSTANTS
const subHeader = document.getElementById("subHeading");

const murderWeaponHeader = document.getElementById("murderWeaponHeader");
const murderWeaponSymbol = document.getElementById("murderWeaponSymbol");
const murderWeaponText = document.getElementById("murderWeaponText");

const motiveHeader = document.getElementById("motiveHeader");
const motiveSymbol = document.getElementById("motiveSymbol");
const motiveText = document.getElementById("motiveText");

const jonathanAlibiHeader = document.getElementById("jonathansAlibiHeader");
const jonathanAlibiSymbol = document.getElementById("jonathansAlibiSymbol");
const jonathanAlibiText = document.getElementById("jonathansAlibiText");

const margaretAlibiHeader = document.getElementById("margaretsAlibiHeader");
const margaretAlibiSymbol = document.getElementById("margaretsAlibiSymbol");
const margaretAlibiText = document.getElementById("margaretsAlibiText");


window.addEventListener('DOMContentLoaded', function() {

    if(suspectAccused != 'victor'){
        subHeader.innerHTML = "You accused the wrong suspect";

        //Check if weapon found
        if(murderWeaponFound) {
            markAsFound(murderWeaponSymbol);

            if(suspectAccused == 'margaret'){

                murderWeaponText.textContent = `You found the murder weapon (the bloody knife in the safe), 
                                            but none of the DNA on it matched Margaret's`;
            }
            else if(suspectAccused == 'jonathan'){
                murderWeaponText.textContent = `You found the murder weapon (the bloody knife in the safe), 
                                            but none of the DNA on it matched Jonathan's`;
            }
        }
        else {
            markAsNotFound(murderWeaponHeader, murderWeaponSymbol);
            murderWeaponText.textContent = `You didn't manage to find the murder weapon, 
                                            and so you lacked enough evidence to convict anybody`;
        }

        //Check if motive found
        if(victorClueFound) {
            markAsFound(motiveSymbol);
            motiveText.textContent = `You found the killer's motive, but were unable to deduce the killer's true identity from it`;
        }
        else {
            markAsNotFound(motiveHeader, motiveSymbol);
            motiveText.textContent = `You were unable to find the the true killer's motive behind the attack`;
        }
        
        //Check if margarets alibi found
        if(suspectAccused == 'margaret') {
            if(margaretAlibiFound) {
                markAsFound(margaretAlibiSymbol);
                margaretAlibiText.textContent = `You found margaret's alibi, but still ended up mistakenly accusing her`;
            }
            else {
                markAsNotFound(margaretAlibiHeader, margaretAlibiSymbol);
                margaretAlibiText.textContent = `You were unable to find Margaret's alibi during the investigation
                                                and so falsely accused her`;
            }
        }
        else {
            if(margaretAlibiFound) {
                markAsFound(margaretAlibiSymbol);
                margaretAlibiText.textContent = `You managed to find Margaret's alibi whilst investigating the house`;
            }
            else {
                margaretAlibiHeader.innerHTML = `\u2002??????'s Alibi:`;
                margaretAlibiHeader.insertAdjacentElement('afterbegin', margaretAlibiSymbol);
                markAsNotFound(margaretAlibiHeader, margaretAlibiSymbol);
                margaretAlibiText.textContent = `You were unable to find the alibi of this suspect during your investigation of the house`;
            }
        }

        //Check if Jonathans alibi found
        if(suspectAccused == 'jonathan') {
            if(jonathanAlibiFound) {
                markAsFound(jonathanAlibiSymbol);
                jonathanAlibiText.textContent = `You found Jonathan's's alibi, but still ended up mistakenly accusing him`;
            }
            else {
                markAsNotFound(jonathanAlibiHeader, jonathanAlibiSymbol);
                jonathanAlibiText.textContent = `You were unable to find Jonathan's alibi during the investigation
                                                and so falsely accused him`;
            }
        }
        else {
            if(jonathanAlibiFound) {
                markAsFound(jonathanAlibiSymbol);
                jonathanAlibiText.textContent = `You managed to find Jonathan's alibi whilst investigating the house`;
            }
            else {
                jonathanAlibiHeader.innerHTML = `\u2002??????'s Alibi:`;
                jonathanAlibiHeader.insertAdjacentElement('afterbegin', jonathanAlibiSymbol);
                markAsNotFound(jonathanAlibiHeader, jonathanAlibiSymbol);
                jonathanAlibiText.textContent = `You were unable to find the alibi of this suspect during your investigation of the house`;
            }
        }

        
    }
    else {
        subHeader.innerHTML = "You lacked sufficient evidence to convict";

        //Check if weapon found
        if(murderWeaponFound) {
            markAsFound(murderWeaponSymbol);
            murderWeaponText.textContent = `You found the bloody knife in the safe, it had Victor's DNA on it helping your case against him`;
        }
        else {
            markAsNotFound(murderWeaponHeader, murderWeaponSymbol);
            murderWeaponText.textContent = `You didn't manage to find the murder weapon, 
                                            and so you lacked enough evidence to convict anybody`;
        }

        //Check if motive found
        if(victorClueFound) {
            markAsFound(motiveSymbol);
            motiveText.textContent = `You found Victor's motive for the murder, strengthening your case against him`;
        }
        else {
            markAsNotFound(motiveHeader, motiveSymbol);
            motiveText.textContent = `You were unable to uncover a motive of why Victor would kill Charles, 
                                        leaving you unable to convince the jury that he was the culprit`;
        }

        //Check if margarets alibi found
        if(margaretAlibiFound){
            markAsFound(margaretAlibiSymbol);
            margaretAlibiText.textContent =`You found Margaret's alibi helping you narrow down the suspect list`
        }
        else {
            markAsNotFound(margaretAlibiHeader, margaretAlibiSymbol);
            margaretAlibiText.textContent = `You didn't manage to find an alibi for Margaret, 
                                            leaving you unable to convince the jury beyond a shadow of a doubt that Victor was guilty and not Margaret`
        }

        //Check if jonathans alibi found
        if(jonathanAlibiFound){
            markAsFound(jonathanAlibiSymbol);
            jonathanAlibiText.textContent =`You found Jonathan's alibi helping you narrow down the suspect list`
        }
        else {
            markAsNotFound(jonathanAlibiHeader, jonathanAlibiSymbol);
            jonathanAlibiText.textContent = `You didn't manage to find an alibi for Jonathan, 
                                            leaving you unable to convince the jury beyond a shadow of a doubt that Victor was guilty and not Jonathan`
        }
    }
});

function markAsFound(symbol) {
    symbol.classList.add('fa-square-check');
}

function markAsNotFound(header, symbol) {
    header.style.color = "rgb(179, 17, 17)";
    symbol.classList.add('fa-square-xmark');
}

document.getElementById('backToMenuBtn').addEventListener('click',function(){
    window.location.replace("mainMenu.html");
});
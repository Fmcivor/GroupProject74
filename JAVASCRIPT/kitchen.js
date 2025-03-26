document.addEventListener('DOMContentLoaded', async function () {

    let states = [];

    states.push(kitchenDefault);
  
    // let currentStateID = Number(sessionStorage.getItem('currentState'));
    // states.forEach(state => {
    //     if (state.ID == currentStateID) {
    //         currentState = state;
    //         return;
    //     }
    // });
    currentState = kitchenDefault;
    updateState();
})



const kitchenDefault = {
    "ID": 1,
    "room": "Kitchen",
    "description": `${displayName}, you stand infront of a large house with a locked door infront of you and a path leading to your left`,
    "ImageHREF": "Images/outsideHouse.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Check under the mat",
            "response": checkUnderMat
        },
        {
            "id": 1,
            "Text": "Follow the path to your left",
            "response": goToSideOfHouse
        },
        {
            "id": 2,
            "Text": "Enter house",
            "response": "You can't enter the house with the door being locked"
        }
    ]
}
# Queries to db

1.  INSERT INTO tblUserAchievements (achievementID, userID)

2.  `SELECT name, description FROM tblAchievement
    WHERE  achievementID = ${achievementID};`;

3. `SELECT * FROM tblClue WHERE clueID = ${clueID}`;

4. `INSERT INTO tblGameNotebook (gameID,clueID) VALUES(${gameID},${clueToAdd.clueID})`;

5.  let query = `SELECT * FROM tblItem WHERE itemID = '${itemID}'`;

6. let saveItemQuery = `INSERT INTO tblGameInventory (GameID,itemID)
                                VALUES(${sessionStorage.getItem("gameID")},${itemID})`;

7. SELECT * FROM tblItem WHERE itemID = '${itemID}'`;

8. `UPDATE tblGameSave SET
                        electricityOn = ${electricityOn},
                        frontDoorUnlocked = ${frontDoorUnlocked},
                        currentRoom = '${currentRoom}',


                        currentState = ${currentStateID},
                        lightingOn = ${lightingOn},
                        noGeneratorRepairAttempts = ${noGeneratorRepairAttempts},
                        timesOnSofa = ${timesOnSofa}


                        WHERE gameID = ${gameID}`;


9. `UPDATE tblUser SET fontSize = ${fontSlider.value},easyReadOn = ${easyReadOn}`;

10. `UPDATE tblGameSave SET timesOnSofa = '${timesOnSofa}' WHERE gameID = '${gameID}';`;

11. `SELECT timesOnSofa FROM tblGameSave WHERE gameID = '${gameID}';`;


10.  `SELECT userID, username, displayName, fontSize FROM tblUser WHERE BINARY username ='${enteredUsername}' AND BINARY userPassword ='${enteredPassword}'


12. SELECT COUNT(*) as activeGames FROM tblGameSave WHERE userID =${userID} AND complete = 0

13. INSERT INTO tblGameSave(userID,currentRoom,currentState) VALUES(${userID},"outsideHouse.html",1)`;

14. `SELECT * FROM tblGameSave WHERE userID =${userID} ORDER BY startDate DESC LIMIT 1`;

15. SELECT achievementID FROM tblUserAchievements WHERE userID = ${userID}`;

16. UPDATE tblUser SET displayName ='${enteredDisplayName}' WHERE userID =${userID}`; 

17. `UPDATE tblUser SET displayName ='${enteredDisplayName}', userPassword = '${enteredPassword}' WHERE userID =${userID}`;

18. `UPDATE tblUser SET fontSize = ${fontSlider.value},easyReadOn = ${easyReadOn}`;

19. SELECT username FROM tblUser WHERE BINARY username = '${enteredUsername}'`;

20. INSERT INTO tblUser (username, userPassword, displayName,iconHREF)
   VALUES ('${username}', '${password}','${displayName}','placeholder')`;

21. `DELETE FROM tblGameSave WHERE gameID = ${gameID}`;

22. UPDATE tblGameSave SET lastPlayedDate = CURRENT_TIMESTAMP WHERE gameID =${gameID}`;

23. SELECT tblItem.itemID, tblItem.itemName, tblItem.itemHREF 
            FROM tblGameInventory JOIN tblItem on tblGameInventory.itemID = tblItem.itemID 
            WHERE tblGameInventory.gameID = ${gameID}`;

24. `SELECT tblClue.clueID, tblClue.clueText FROM tblGameNotebook 
            JOIN tblClue on tblGameNotebook.clueID = tblClue.clueID 
            WHERE tblGameNotebook.gameID = ${gameID}`;

25. SELECT * FROM tblGameSave WHERE gameID = ${gameID}`;

26. `SELECT * FROM tblGameSave WHERE userID = ${userID} ORDER BY lastPlayedDate DESC LIMIT 3`;








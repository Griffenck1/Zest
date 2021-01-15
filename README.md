# CSCI 3308 113-4 Covidiots: Zest

Our application is a web app to help people with meal planning. The user will be able to login to the application, or register as a new member, and have all of their own information and recipes saved. Once in the application, they will be able to add their own personal information into the profile page and start to customize their own information. From there, the user will be able to add their own recipes to their account. After they add the recipes, they will be able to go to their weekly calendar page and add these to breakfast, lunch, and dinner. Once the recipes are added and the week is planned, this will then create a shopping list with correct quantities for the user to take and go shopping with. 

As of right now the functionality for the login, calender, and shopping list pages is all working and testable.

# To run a live demo on local host follow the below steps:

These steps have been tested using Mac OSX and Ubuntu, it should work with all versions of Linux. This project was not designed to work on Windows.

Make sure you have postgresql installed

1. change into the Project directory
2. run $./build in bash
3. answer all the prompts
4. change into the server directory
5. run $node server.js
6. go to http://localhost:8082/ in your favorite browser
7. hit command or control c (depending on os) to stop the server
8. feel free to run ./build again to update anything as it accounts for updating things
   as well as creating them the first time.
9. Login using the credentials Username: Griffenck1 and Password: BigOof#22 to try the demo with a pre loaded profile (best for testing functionality)

If this isn't working here are a few common reasons:
1. You entered the database username (which is usually postgres) wrong,
   to fix this you can simply run ./build again and enter it correctly this time.

# cs13-main

This is a carparking app designed for the company Leidos. The purpose of the app is
to fix the carparking issue within the company, where some employees can't
get carpark spaces. Within the company, employees are in groups of 5 and each group has a space,
with each user having the space on a specific day.

The app assigns a user a space for 10 weeks, users can share their spaces within the group (i.e. if someone has a space for
Tuesday but aren't in on Tuesday, they can free their space to the rest of the group). 
Another feature of the app was to allow a marketspace of carpark spaces, so if nobody in the group wants
the space it's open to everyone else to take.

Another feature of this app is the ability to report illegal parking if someone is in your space,
by scanning a qr code.

The react native framework was used to develop the app, with Google Firebase database used
for storing the data.

------------------------------------------------------------------

Running/Testing the app:
1. Clone project from git
2. Asssuming Node 10 LTS or greater is installed on your computer, you should download expo client using:
   npm install -g expo-cli
3. Run npm install
4. Run expo start (or npm start)
5. Connect android phone to computer via usb cable (or have android emulator running)
6. Press "Run on Android device/emulator" on Expo developer tools (or press 'a' on command line)
7. Create an account and log in
8. To be assigned spaces, need to create a txt file in the format: Name,Email,Password,CarReg,groupID,phoneNumber. Put this on your android device with a recognizable name
   The groupID should be a space, i.e. if your groupID is 510, you are assigned space 510.
   If you are testing on a phone, then you need to download the txt file onto your phone.
   Click on 'Admin', then 'Populate User Database', then 'Select file'. 
   Select the txt file, then press 'Run Population Script'. Wait until you are redirected to admin.
   This adds the user to the database.
   If you then log in as this user, you can see all the spaces.

-------------------------------------------------------------------

Implemented features:
- User can log in to account
- User stays logged in after initial login
- User is assigned carpark spaces for the next 10 weeks
- User can free up space to their group
- User can free up space to the market
- User can book a space that has either been freed up by their group, or is in the market
- User can change profile data such as username, password, car reg etc
- User can view a map of the carpark
- Admin can run a population script to populate the database. 
- User can report illegal parking by scanning a qr code that will give the email address and phone number of the illegal parker

Known Bugs:
- User information isn't loading on profile page
- Push notifications are not working
- Table of users spaces doesn't update when you book a space. Need to close app and open it again to see space you just booked

-------------------------------------------------------------------

How to use the Application
- Login or Sign up 
- To browse for available parking spaces within your group, select 'Group Spaces'. This contains a list of spaces available in your group
- To browse for available parking spaces, select "Search for space". This contains a list of the spaces available publicly
- To book a space, press and hold the row that the space is located in, and tap Book Space. 
- To free a space on the homepage, press and hold the space then select which category you would like to free it to; public or group
- To see a map of the carpark, select "View Carpark"
- If you would like to change any details in your profile, for example Name, Email or Phone number please select the circular profile icon in the top left
- If at any point you would like to navigate home, please press the Leidos icon
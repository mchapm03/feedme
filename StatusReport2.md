Status Report #2
================

Progress This Week
------------------
We began the web server, which is associated with http://feedme-comp20.herokuapp.com. 
We have also added a MongoDB lab instance.
The server will at least have the functionality to "POST" and "GET" both restaurants and foods from their respective collections.
We have begun these functions in server.js.

We have updated the homepage to populate the main image and description based on the XMLHttpRequest response data. The response data will be an array of foods, each with a name, price, the absolute url of a photo of the food, tags (like savory or vegan), the restaurant's name, the restaurant's latitude and longitude, the restaurant's phone number and the restaurant's grubhub page. 
The javascript has also been written so that the user can see different photos by clicking on the respective right or left arrows (assuming there is more than one photo in the response).
The filter on the homepage has been updated to send a get request with filter options if a user fills out the filter form.

The addfoods page has been updated to send a "POST" request to the server with the food properties. The food image will be automatically hosted by parse, and the absolute url will be sent with the request.

The login page has been updated to handle restaurants logging in using google authentication. 

Killer logo!!

Challenges and Issues
---------------------
Using outside API's simplifies complex problems (like user authentication), but also takes time to learn and implement. This is showing up in our implementation of letting restaurants sign in with google.

A main challenge is finding time that all gorup members can meet. Synchronizing 5 schedules is difficult. 

Goals for the Next Week
-----------------------
1. Getting the web server working, including successfully being able to send the proper get and post requests.
2. Finish all homepage funcitonality.
3. Code the register restaurant page, and update to integrate google user authentication. Learn how this authentication works, and how restaurants can be identified (ie when they submit a food how we encode the restuarant, also integrate all pages to know if the user is a "logged in" restaurant).
4. Populate the mongo database with some example photos!


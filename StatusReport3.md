Status Report #3
================

Progress this Week
------------------
We have implemented our filtering of foods by taste / location based on user input.
We also established a restaurant query to gather remaining necessary info about a food item. 

The register restaurants POST request is now working. 

We have built our application on github gh-pages and heroku so that we can start accessing the production version.

The login page has been updated to (better) handle restaurants logging in using google authentication. We have also been working to understand this API and use it to know if a current user is logged in, and if so, what their information is.

We have updated the addfoods process so that each tag gets added to the food document. Some client side validation was 
added so that users fill out each required form field.

We have updated styling.


Challenges and Issues
---------------------
Using outside API's simplifies complex problems (like user authentication), but also takes time to learn and implement. This is showing up in our implementation of letting restaurants sign in with google.

We are having issues getting restaurant information to associate with food items based off of the fact that they are logged in (Google API issue)

A main challenge is finding time that all gorup members can meet. Synchronizing 5 schedules is difficult. 

Goals for the Next Week
-----------------------
1. Login users successfully!
2. Direct users to correct site view (logged in or not)
3. Populate database for presentation
4. Allow users to modify/remove foods
5. Handle special cases/ validate (and encode) user input as much as possible.

#Comments by Ming
* "We also established a restaurant query to gather remaining necessary info about a food item. " --that's huge
* I wouldn't spend too much time with authentication and authorization.  Perhaps fake a user for demo.

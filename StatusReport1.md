Status Report #1
================

Progress This Week
------------------
We have completed the HTML files for the following pages:
* index.html
* addfood.html
* edit_foods.html
* login.html
* logged_in.html

We began the registration page (register.html). We set up the Google Maps API on the page to use in two ways:
1. To geocode the addresses registering restaurants provide
2. To show the restaurants the position of the address they provide on a map, in order to reduce the likelihood restaurants that provide an incorrect address will notice before completing their registration.

Challenges and Issues
---------------------
We are still working on developing the best way for users to order the food. One solution is to send the users to Grubhub.com, but we have not been able to send the user to the exact food, or prepopulate the Grubhub order form, so this solution is inconvinient for the client. At the same time, actually handling the order ourselves leaves the ordering vulnerable to hackers and other security issues.

Goals for the Next Week
-----------------------
1. Finishing the HTML of the restaurant registration page.
2. Setting up a MongoDB database to hold the restaurant, login info, and food records
3. Setting up the JavaScript interface that communicates with MongoDB
    -POST restaurant info
    -POST food info (add functionality to update it as well)
    -GET food when not filtered/when filter options set
4. Determine algorithm to decide which food to display "next"
5. Work on styling, including making a killer logo!

#Comments by Ming
* Warning: Grubhub is a piece of work to work with.  Don't aim for perfection

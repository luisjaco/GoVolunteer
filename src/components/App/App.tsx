import React from 'react';

export default function App() {
  // this will hold all of the other components of the app for now

  /*
    Right here is a general overview of all the pages we will be making and whos doing what

    Nicole
    | Homepage (will show title and show signIn, signUpUser, and signUpOrganization buttons.)
    | - SignIn (take in all users & organizations)
    | - SignUpUser (username, firstname, lastname, password, email, etc.)
    | - SignUpOrganization (username, orgname, password, email, url, etc.)

    Matt
    | HomeFeed (display what evens are posted)
    | - EventCard (basic info for the event)
    | - EventInfo (in-depth info page for the event, rsvp button)

    Daniella
    | ViewAccount (show current rsvps, username, pfp, etc.)
    | - EditAccount (change username, pfp, password, name, etc.)

    ^v honestly these two can be pretty similar with slight changes.

    Emily
    | ViewOrganization (organization info, current posts)
    | - EditOrganization (change username, pfp, password, etc)
    
    Logan
    | - EventInfoOrganization (EventInfo but for orgs, will show whos rsvp and an edit button)
    | - EditEvent (edit location, pictures, names, etc.)
    | - CreateEvent

    Luis 
    | NavBar
    ** Look into backend

  */
};
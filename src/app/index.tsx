import { Link } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function WelcomeScreen(){

    return (
        <View>
            <Text>
                This would be our home screen. Basically where the user will sign in and stuff, then
                we add the tabs to the stack (as the top screen). Or maybe transfer the route (Luis)
                will figure that stuff out.
            </Text>
            <Text>
                Expo router has these things called stacks and tabs. They're exactly what they sound
                like and pretty simple to use. Stacks are screens that go on top of each other, and
                tabs are tabs which can be accessed on one tab bar.
            </Text>
            <Text>
                You'll see that in this file there are a bunch of folders like (this), these are
                called grouping folders, and what they do is make it so we can easily organize
                without changing the actually path of the file. So if I were to reference 
                secondPostScreen, (which to us in the code editor has the path 
                '@/src/app/(tabs)/(post)/secondPostScreen'), it will just look like 
                '/secondPostScreen'. We also still have regular folders as well.
            </Text>
            <Text>
                All folders/groups with screens should have a '_layout.tsx' and 'index.tsx' file, 
                which is a file that defines the layout of adjacent screens in the folder and the 
                starting screen, respectively.
            </Text>
            <Text>
                Linking between screens and stuff is pretty easy, you can see examples all 
                throughout the code. As well on how to alter the layout files, everywhere. Ask Luis
                about anything you might not understand.
            </Text>
            <Text>
                Look at the comments in this screens file to see the roles and screens we decided.
            </Text>
            <Link href='/(tabs)/(home)' push asChild>
                <Button>
                    Move to main tabs!
                </Button>
            </Link>
        </View>
    )
}

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
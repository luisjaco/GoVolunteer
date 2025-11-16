Right here is a general overview of all the pages we will be making and whos doing what

    Nicole
    | Homepage (will show title and show signIn, signUpUser, and signUpOrganization buttons.)
    | - SignIn (take in all users & organizations)
    | - SignUpUser (username, firstname, lastname, password, email, etc.)
    | - SignUpOrganization (username, orgname, password, email, url, etc.)

    Matt
    | HomeFeed (display what events are posted)
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

  =-=-=-=-=

  1.What does "npx expo start" do?
    a. First it looks for app.json
       Then it looks for package.json
       Then it looks for an App entry file such as "app.index.tsx" or "app.js"
    b. Starts a server using Metro Bundler (watches files and sends app updates)
    c. Bundles JavaScript into a format an iphone or android understands
    d. Reads the bundled code and displays the app user interface

  2.How does Expo decide which screen to show using Expo Router?
    a. Expo Router looks for the folder "app/"
    b. Expo Router looks for a file named "app/index.tsx"
      index.tsx = the home page and automatically loads
    
    -How does Expo decide the routes or page loading/navigation?
    a. It uses "file-based routing"
    b. Whatever is inside of /app becomes the screens or pages
      Ex: app/index.tsx = "/" or the main screen
      Ex: app/about.tsx = "/about" or the about screen
    c. Expo Router MUST HAVE "app/layout.tsx"
      -the "layout.tsx" file tells Expo to WRAP all pages
      -layout.tsx = a file that controls all pages inside the FOLDER it is in (the boss)
      -layout.tsx defines things like footers, navgiations bars, tabs, headers, animations, themes, authentication, wrappers, and Stacks
    d. To use Expo Router, we follow this format:
      -import { Link } from "expo-router";
      -link = built in navigation component from Expo Router
      -link helps you use href="" just like in typical HTML to route to pages

  3. How to setup Expo Router

  a. install the dependencies in the project folder:
  "npx expo install expo-router react-native-screens react-native-safe-area-context"

  b. go to "package.json" and update the value for "main"
  "main": "expo-router/entry"

  c. go to "app.json" and add a linking "scheme"
  "scheme": "name-of-your-app"

  d. Create the required folder "/app"
    -all the screens and pages, including index must be inside "/app"

  e. Add the layout file to "/app"
    -> "app/layout.tsx"

  f. Go to the layout file and add this:
    import { Stack } from "expo-router"; 
   
    export default function Layout() {
  return <Stack />;
}

  -this code tells all pages to use a "Stack navigator"

  g. Create the homepage
  "app/index.tsx"

  h. Navigate using the link package from Expo-router
  
  Ex: To go from index to the about page
  <Link href="/about">The About Page</Link>

  i. Run the project
  "npx expo start"

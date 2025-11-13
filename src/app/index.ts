import { registerRootComponent } from 'expo';

// We import the top-level component App here and use it as our root, where everything inside of 
// App's return statement will be rendered

// change this to App instead of OriginalApp if you want to test
import App from '../components/TestApp/App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);


// basically Expo Go is a framework of React Native
// and React Native is a framework of React
// and React is a library of javascript
// so essentially... we're cooked.

// reminder: to run, use "npx expo start"
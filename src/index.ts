import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);


// basically Expo Go is a framework of React Native
// and React Native is a framework of React
// and React is a library of javascript
// so essentially... we're cooked.
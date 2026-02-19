/**
 * PriceX Mobile App - Entry Point
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { gestureHandlerRootView } from 'react-native-gesture-handler';

AppRegistry.registerComponent(appName, () => App);

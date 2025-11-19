// This will contain constants we might reuse in the future
import {StyleSheet} from 'react-native';
import { PRIMARY_COLOR, SECONDARY_COLOR } from './colors';

// CSS stuff to alter the page.
export const styles = StyleSheet.create({
  container: {
    flex: 1, // fill available space
  },

  content: {
    flex: 1,
    alignItems: 'center',     // center children horizontally within this view
    justifyContent: 'center', // center children vertically within this view
    gap: 12,                  // adds uniform spacing between child elements
    padding: 24,
  },
  
  center: {textAlign: 'center'}, // centers the text within the text box
  // style choices for the fab
  fab: {
    position: 'absolute',
    right: 16,  // 16px from the right
    bottom: 24, // 24 px from the bottom
  },

  links: {
    marginTop: 10,
    borderBottomWidth: 2,
  },

  // HOME FEED PAGE STYLES
  eventCardText: {
    fontSize: 14
  },

});

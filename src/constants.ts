// This will contain constants we might reuse in the future

// StyleSheet.create collects static styles for performance and clarity
// container/content/center/fab are named style groups we can reuse on Views/Text/etc.
// StyleSheet helps us define styles similar to CSS but for JS objects
import {StyleSheet} from 'react-native';

// CSS stuff to alter the page.
const styles = StyleSheet.create({
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
});

export default styles;
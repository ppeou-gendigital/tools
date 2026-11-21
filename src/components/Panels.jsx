import { Box } from '@mantine/core'

// Horizontal strip of panels. The browser handles both axes natively: the page
// scrolls vertically and this element scrolls sideways, so trackpad swipes,
// shift+wheel, and the scrollbar all behave the way they do anywhere else.
export function Panels({ children }) {
  return (
    <Box
      className="panels"
      tabIndex={0}
      role="group"
      aria-label="Workspace panels"
    >
      {children}
    </Box>
  )
}

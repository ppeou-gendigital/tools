import { createTheme } from '@mantine/core'

// Dense tool theme: small type, tight radii, orange accent.
export const theme = createTheme({
  primaryColor: 'orange',
  defaultRadius: 'md',
  cursorType: 'pointer',
  fontSizes: {
    xs: '11px',
    sm: '12px',
    md: '13px',
    lg: '15px',
    xl: '17px',
  },
  components: {
    Badge: { defaultProps: { size: 'xs', radius: 'sm' } },
    ActionIcon: { defaultProps: { size: 'sm', variant: 'subtle' } },
    Tooltip: { defaultProps: { openDelay: 300, withArrow: true } },
    TextInput: { defaultProps: { size: 'xs' } },
    Switch: { defaultProps: { size: 'xs' } },
  },
})

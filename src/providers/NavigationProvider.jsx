import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

const NavigationContext = createContext(null)

const ROUTES = ['home', 'profile', 'deck-test', 'aem-jump']
const DEFAULT_ROUTE = 'home'

export function NavigationProvider({ children, initial = DEFAULT_ROUTE }) {
  const [route, setRoute] = useState(
    ROUTES.includes(initial) ? initial : DEFAULT_ROUTE,
  )

  const navigate = useCallback((next) => {
    if (ROUTES.includes(next)) setRoute(next)
  }, [])

  const value = useMemo(
    () => ({
      route,
      navigate,
      goHome: () => navigate('home'),
      goProfile: () => navigate('profile'),
      goDeckTest: () => navigate('deck-test'),
      goAemJump: () => navigate('aem-jump'),
    }),
    [route, navigate],
  )

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const ctx = useContext(NavigationContext)
  if (!ctx) {
    throw new Error('useNavigation must be used inside <NavigationProvider>')
  }
  return ctx
}

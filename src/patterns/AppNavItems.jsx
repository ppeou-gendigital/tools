import {
  Calendar,
  CalendarDays,
  FileStack,
  HeartPulse,
  House,
  Pill,
  Stethoscope,
  Users,
} from 'lucide-react'
import { AppNavItems as ToolsAppNavItems } from '@tools/behavioral'
import { useNavigation } from '@/providers/NavigationProvider'

/** FAB menu “app toolbar” destinations. */
export const APP_NAV = [
  { id: 'home', label: 'Home', icon: House, go: 'goHome' },
  { id: 'visits', label: 'Visits', icon: CalendarDays, go: 'goVisits' },
  { id: 'appointments', label: 'Appointments', icon: Calendar, go: 'goAppointments' },
  { id: 'doctors', label: 'Doctors', icon: Stethoscope, go: 'goDoctors' },
  { id: 'medications', label: 'Medications', icon: Pill, go: 'goMedications' },
  { id: 'readings', label: 'Readings', icon: HeartPulse, go: 'goReadings' },
  { id: 'files', label: 'Files', icon: FileStack, go: 'goFiles' },
  { id: 'family', label: 'Family', icon: Users, go: 'goFamily' },
]

export function AppNavItems({ onClose }) {
  const nav = useNavigation()
  const items = APP_NAV.map(({ id, label, icon, go }) => ({
    id,
    label,
    icon,
    onClick: nav[go],
  }))
  return <ToolsAppNavItems items={items} onClose={onClose} />
}

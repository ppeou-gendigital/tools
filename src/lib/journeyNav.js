import {
  CircleDollarSign,
  ListChecks,
  ListMusic,
  MapPin,
  Paperclip,
  Settings,
  Users,
} from 'lucide-react'

/**
 * Full journey destination list for the header Grip (`PageShortcuts`).
 * `PageShortcuts` filters out the current page by `id`.
 */
export function journeyAllShortcuts(journeyId, go) {
  return [
    {
      id: 'members',
      label: 'Travelers',
      icon: Users,
      pick: () => () => go.goMembers(journeyId),
    },
    {
      id: 'spending',
      label: 'Spending',
      icon: CircleDollarSign,
      pick: () => () => go.goSpending(journeyId),
    },
    {
      id: 'playlist',
      label: 'Playlist',
      icon: ListMusic,
      pick: () => () => go.goPlaylist(journeyId),
    },
    {
      id: 'todos',
      label: 'To-dos',
      icon: ListChecks,
      pick: () => () => go.goTodos(journeyId),
    },
    {
      id: 'map',
      label: 'Map',
      icon: MapPin,
      pick: () => () => go.goMap(journeyId),
    },
    {
      id: 'attachments',
      label: 'Attachments',
      icon: Paperclip,
      pick: () => () => go.goAttachments(journeyId),
    },
    {
      id: 'journey-settings',
      label: 'Settings',
      icon: Settings,
      pick: () => () => go.goJourneySettings(journeyId),
    },
  ]
}

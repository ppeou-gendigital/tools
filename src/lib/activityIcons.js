/**
 * Resolve Lucide icons declared on activity / preset JSON (`"icon": "PlaneTakeoff"`).
 * Explicit imports keep the bundle to the catalog set only.
 */

import {
  BedDouble,
  CalendarClock,
  Camera,
  Car,
  CarTaxiFront,
  Circle,
  Flag,
  Fuel,
  HardHat,
  Landmark,
  ListChecks,
  MapPinned,
  PartyPopper,
  PlaneTakeoff,
  Receipt,
  Route,
  Ship,
  Smile,
  Stethoscope,
  StickyNote,
  TramFront,
  Trophy,
  Utensils,
  UtensilsCrossed,
  Wallet,
  Wrench,
} from 'lucide-react'
import { getActivity } from '@/lib/catalog'

const BY_NAME = {
  BedDouble,
  CalendarClock,
  Camera,
  Car,
  CarTaxiFront,
  Circle,
  Flag,
  Fuel,
  HardHat,
  Landmark,
  ListChecks,
  MapPinned,
  PartyPopper,
  PlaneTakeoff,
  Receipt,
  Route,
  Ship,
  Smile,
  Stethoscope,
  StickyNote,
  TramFront,
  Trophy,
  Utensils,
  UtensilsCrossed,
  Wallet,
  Wrench,
}

/** Lucide component for a catalog icon name, or Circle if unknown. */
export function iconByName(name) {
  return BY_NAME[name] || Circle
}

/** Lucide component for an activity id. */
export function activityIcon(activityId) {
  const activity = getActivity(activityId)
  return iconByName(activity?.icon)
}

import type { Metadata } from "next"
import SettingsClientPage from "./SettingsClientPage"

export const metadata: Metadata = {
  title: "System Settings | Admin Panel",
  description: "Manage global system settings for the Farm Marketplace application",
}

export default function SettingsPage() {
  return <SettingsClientPage />
}

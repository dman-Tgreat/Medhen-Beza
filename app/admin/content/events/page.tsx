import { getAdminEvents } from "@/lib/queries/admin";
import { EventsAdminClient } from "@/components/admin/content/EventsAdminClient";

export default async function EventsAdminPage() {
  const events = await getAdminEvents();

  return <EventsAdminClient initialEvents={events} />;
}

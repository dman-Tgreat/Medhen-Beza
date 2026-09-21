"use client";

import { useEffect, useState } from "react";
import { Check, Mail, Archive } from "lucide-react";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { RoleGuard } from "@/components/admin/role-guard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getContactMessagesAction, updateContactMessageStatusAction, type AdminContactMessage } from "@/lib/actions/messages";

type MessageStatus = AdminContactMessage["status"];

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [viewingMessage, setViewingMessage] = useState<AdminContactMessage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = async () => {
    const result = await getContactMessagesAction();
    if (result.error) setError(result.error);
    else setMessages(result.data || []);
  };

  useEffect(() => { void loadMessages(); }, []);

  const updateStatus = async (id: string, status: MessageStatus) => {
    const result = await updateContactMessageStatusAction(id, status);
    if (result.error) setError(result.error);
    else {
      setMessages((current) => current.map((message) => message.id === id ? { ...message, status } : message));
      setViewingMessage((current) => current?.id === id ? { ...current, status } : current);
    }
  };

  const handleOpen = async (message: AdminContactMessage) => {
    setViewingMessage(message);
    if (message.status === "UNREAD") await updateStatus(message.id, "READ");
  };

  const columns: ColumnDef<AdminContactMessage>[] = [
    {
      key: "name",
      header: "Sender",
      sortable: true,
      render: (item) => <div className="flex items-center gap-2.5"><div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${item.status === "UNREAD" ? "bg-emergency-light text-emergency border-emergency/20" : "bg-background text-text-muted border-border"}`}><Mail className="h-4 w-4" /></div><div><div className={item.status === "UNREAD" ? "font-bold text-text" : "font-semibold text-text"}>{item.name}</div><div className="text-[11px] text-text-muted">{item.email}</div></div></div>,
    },
    { key: "subject", header: "Subject / Inquiry", render: (item) => <div className="max-w-md"><div className="truncate text-xs font-medium text-text">{item.subject}</div><div className="truncate text-[11px] text-text-muted">{item.message}</div></div> },
    { key: "date", header: "Received", sortable: true, render: (item) => <span className="text-xs text-text-muted">{formatDate(item.date)}</span> },
    { key: "status", header: "Status", sortable: true, render: (item) => <span className={`inline-flex rounded-pill border px-2 py-0.5 text-xs ${item.status === "UNREAD" ? "border-emergency/20 bg-emergency-light font-bold text-emergency-dark" : item.status === "REPLIED" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-border bg-background text-text-muted"}`}>{item.status === "REPLIED" ? "HANDLED" : item.status}</span> },
  ];

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "CONTENT_STAFF"]}>
      <div className="space-y-6">
        {error && <div className="rounded-lg border border-emergency/30 bg-emergency-light p-3 text-sm text-emergency">{error}</div>}
        <DataTable title="Patient Contact Form Messages" description="Live inquiries submitted through the public contact form." data={messages} columns={columns} searchPlaceholder="Search sender, subject, email, or message..." onView={handleOpen} onDelete={(item) => void updateStatus(item.id, "ARCHIVED")} />

        <Dialog open={!!viewingMessage} onOpenChange={(open) => { if (!open) setViewingMessage(null); }}>
          <DialogContent className="max-w-lg bg-surface p-6">
            {viewingMessage && <>
              <DialogHeader><DialogTitle className="text-base font-bold text-text">{viewingMessage.subject}</DialogTitle><DialogDescription className="text-xs text-text-muted">From {viewingMessage.name} • {formatDate(viewingMessage.date)}</DialogDescription></DialogHeader>
              <div className="my-3 space-y-4 text-xs"><div className="grid grid-cols-1 gap-2 rounded-md border border-border bg-background p-3 sm:grid-cols-2"><div><span className="block text-[11px] text-text-light">Email</span><a href={`mailto:${viewingMessage.email}`} className="font-semibold text-primary">{viewingMessage.email}</a></div><div><span className="block text-[11px] text-text-light">Phone</span><span className="font-semibold text-text">{viewingMessage.phone}</span></div></div><div><label className="font-semibold text-text">Message</label><p className="mt-1 whitespace-pre-wrap rounded-md border border-border bg-background p-3 leading-relaxed text-text">{viewingMessage.message}</p></div></div>
              <DialogFooter className="gap-2"><Button variant="ghost" size="sm" onClick={() => setViewingMessage(null)}>Close</Button>{viewingMessage.status !== "REPLIED" && viewingMessage.status !== "ARCHIVED" && <Button variant="outline" size="sm" onClick={() => void updateStatus(viewingMessage.id, "REPLIED")}><Check className="mr-1 h-3.5 w-3.5" />Mark Handled</Button>}{viewingMessage.status !== "ARCHIVED" && <Button variant="outline" size="sm" className="text-emergency" onClick={() => void updateStatus(viewingMessage.id, "ARCHIVED")}><Archive className="mr-1 h-3.5 w-3.5" />Archive</Button>}</DialogFooter>
            </>}
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  );
}

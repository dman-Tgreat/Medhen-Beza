"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { RoleGuard } from "@/components/admin/role-guard";
import { Mail, Phone, Calendar, Check, CornerDownLeft, Eye, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface MessageRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";
}

const INITIAL_MESSAGES: MessageRecord[] = [
  {
    id: "msg-1",
    name: "Almaz Kebede",
    email: "almaz.k@example.com",
    phone: "+251 911 234567",
    subject: "Inquiry about pediatric cardiologist clinic schedule",
    message: "Good morning, I would like to know which days Dr. Meron Haile is available for outpatient pediatric consultations and whether prior echocardiogram reports should be brought along.",
    date: "Today, 08:30 AM",
    status: "UNREAD",
  },
  {
    id: "msg-2",
    name: "Tewodros Assefa",
    email: "tewodros.a@example.com",
    phone: "+251 922 345678",
    subject: "Insurance Coverage for Laparoscopic Gallbladder Surgery",
    message: "Does Medhen Beza Hospital have direct billing agreements with United Insurance or MedNet for elective laparoscopic surgery?",
    date: "Yesterday, 04:15 PM",
    status: "UNREAD",
  },
  {
    id: "msg-3",
    name: "Bethelhem Yilma",
    email: "bethelhem.y@example.com",
    phone: "+251 933 456789",
    subject: "Maternity Ward Delivery Packages & Private Room Reservation",
    message: "Kindly provide details on normal vs cesarean delivery packages and how early we should reserve a private room.",
    date: "Sep 09, 2026",
    status: "READ",
  },
  {
    id: "msg-4",
    name: "Dr. Kifle Tadesse",
    email: "kifle.t@example.com",
    phone: "+251 944 567890",
    subject: "Physician Referral: Complex Spine Case",
    message: "Referring a 45-year-old male patient with lumbar disc herniation for evaluation by your neurosurgery team.",
    date: "Sep 08, 2026",
    status: "REPLIED",
  },
];

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<MessageRecord[]>(INITIAL_MESSAGES);
  const [viewingMessage, setViewingMessage] = useState<MessageRecord | null>(null);
  const [replyText, setReplyText] = useState("");

  const columns: ColumnDef<MessageRecord>[] = [
    {
      key: "name",
      header: "Patient / Sender",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg border shrink-0 ${
            item.status === "UNREAD"
              ? "bg-emergency-light text-emergency border-emergency/20"
              : "bg-background text-text-muted border-border"
          }`}>
            <Mail className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className={`text-text ${item.status === "UNREAD" ? "font-bold" : "font-semibold"}`}>
              {item.name}
            </span>
            <span className="text-[11px] text-text-muted">{item.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Subject / Inquiry",
      render: (item) => (
        <div className="flex flex-col max-w-xs sm:max-w-md">
          <span className={`text-xs truncate ${item.status === "UNREAD" ? "font-semibold text-text" : "text-text"}`}>
            {item.subject}
          </span>
          <span className="text-[11px] text-text-muted truncate">{item.message}</span>
        </div>
      ),
    },
    {
      key: "date",
      header: "Received",
      sortable: true,
      render: (item) => <span className="text-xs text-text-muted font-mono">{item.date}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (item) => {
        const badgeClasses = {
          UNREAD: "bg-emergency-light text-emergency-dark border-emergency/20 font-bold",
          READ: "bg-slate-100 text-slate-700 border-slate-200",
          REPLIED: "bg-emerald-50 text-emerald-800 border-emerald-200 font-medium",
          ARCHIVED: "bg-slate-50 text-slate-500 border-slate-200",
        }[item.status];

        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-pill text-xs border ${badgeClasses}`}>
            {item.status}
          </span>
        );
      },
    },
  ];

  const handleOpenMessage = (msg: MessageRecord) => {
    setViewingMessage(msg);
    if (msg.status === "UNREAD") {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: "READ" } : m))
      );
    }
  };

  const handleSendReply = () => {
    if (!viewingMessage) return;
    alert(`Reply sent to ${viewingMessage.email}!`);
    setMessages((prev) =>
      prev.map((m) => (m.id === viewingMessage.id ? { ...m, status: "REPLIED" } : m))
    );
    setViewingMessage(null);
    setReplyText("");
  };

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "CONTENT_STAFF"]}>
      <div className="space-y-6">
        <DataTable
          title="Patient Contact Form Messages"
          description="Inbound patient consultations, general inquiries, and specialist clinic questions submitted via public site."
          data={messages}
          columns={columns}
          searchPlaceholder="Search messages by sender name, subject, email..."
          onView={handleOpenMessage}
          onDelete={(item) => {
            if (confirm(`Delete message from ${item.name}?`)) {
              setMessages((prev) => prev.filter((m) => m.id !== item.id));
            }
          }}
        />

        {/* View & Reply Dialog */}
        {viewingMessage && (
          <Dialog open={!!viewingMessage} onOpenChange={() => setViewingMessage(null)}>
            <DialogContent className="max-w-lg bg-surface p-6">
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-text">
                  {viewingMessage.subject}
                </DialogTitle>
                <DialogDescription className="text-xs text-text-muted">
                  From {viewingMessage.name} • {viewingMessage.date}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-3 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-background rounded-md border border-border">
                  <div>
                    <span className="text-text-light block text-[11px]">Email Address</span>
                    <span className="font-semibold text-text">{viewingMessage.email}</span>
                  </div>
                  <div>
                    <span className="text-text-light block text-[11px]">Phone Number</span>
                    <span className="font-semibold text-text font-mono">{viewingMessage.phone}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-text">Patient Message:</label>
                  <p className="bg-background p-3 rounded-md border border-border text-text leading-relaxed">
                    {viewingMessage.message}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="font-semibold text-text">Draft Hospital Reply:</label>
                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type official hospital response..."
                    className="w-full rounded-md border border-border bg-background p-2.5 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setViewingMessage(null)} className="text-xs">
                  Close
                </Button>
                <Button variant="primary" size="sm" onClick={handleSendReply} className="text-xs shadow-cta">
                  <CornerDownLeft className="h-3.5 w-3.5 mr-1.5" />
                  Send Email Reply
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </RoleGuard>
  );
}

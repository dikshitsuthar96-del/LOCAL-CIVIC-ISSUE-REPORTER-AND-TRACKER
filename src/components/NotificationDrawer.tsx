import React from 'react';
import { X, Bell, CheckCheck, Clock, ArrowRight, MessageSquare, AlertCircle } from 'lucide-react';
import { NotificationItem, Complaint } from '../types.js';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  complaints,
  onSelectComplaint,
  onMarkRead,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notif: NotificationItem) => {
    onMarkRead(notif.id);
    const target = complaints.find((c) => c.id === notif.complaintId);
    if (target) {
      onSelectComplaint(target);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-neutral-200">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-neutral-700" />
            <h3 className="font-bold text-sm text-neutral-900">Citizen Alerts</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
              <p>No notifications yet.</p>
              <p className="text-[11px] text-neutral-400 mt-1">
                You'll receive plain-language updates here whenever Nagrik Sandesh detects a status change.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs space-y-1.5 ${
                  n.read
                    ? 'bg-white border-neutral-200 hover:border-neutral-300'
                    : 'bg-indigo-50/50 border-indigo-200 hover:border-indigo-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                    {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0" />}
                    <span>{n.title}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 flex-shrink-0 font-mono">
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-neutral-700 leading-relaxed">{n.message}</p>

                {n.photoUrl && (
                  <div className="mt-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center space-x-3">
                    <img
                      src={n.photoUrl}
                      alt="Proof of Work"
                      referrerPolicy="no-referrer"
                      className="w-16 h-12 object-cover rounded-md border border-emerald-300 shadow-xs shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
                        <span>📸 Verified Proof of Work Picture</span>
                      </span>
                      <p className="text-[11px] text-emerald-950 font-medium truncate">
                        Government repair photo attached
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-1 flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="font-mono text-neutral-500 font-semibold">{n.complaintId}</span>
                  <span className="text-indigo-600 font-medium flex items-center space-x-0.5">
                    <span>View ticket</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-200 bg-slate-50 text-[11px] text-neutral-500 text-center">
          Generated automatically by Nagrik Sandesh (Status &amp; Notification Agent)
        </div>
      </div>
    </div>
  );
};

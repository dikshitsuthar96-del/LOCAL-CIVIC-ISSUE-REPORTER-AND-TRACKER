import React from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Hourglass,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface GovMonitoringDashboardMetricsProps {
  counts: {
    inProgress: number;
    pending: number;
    overdueEscalated: number;
    resolved: number;
  };
  activeTab: string;
  onSelectTab: (tab: any) => void;
}

export const GovMonitoringDashboardMetrics: React.FC<GovMonitoringDashboardMetricsProps> = ({
  counts,
  activeTab,
  onSelectTab,
}) => {
  const cards = [
    {
      id: 'in_progress',
      title: 'In Progress',
      count: counts.inProgress,
      subtitle: 'Actively handled by department crews',
      icon: Clock,
      color: 'border-orange-500 text-orange-600 bg-orange-50/60',
      badgeBg: 'bg-orange-600 text-white',
      accentColor: '#ea580c',
    },
    {
      id: 'check_status', // clicking opens status check / pending
      title: 'Pending',
      count: counts.pending,
      subtitle: 'Intake, verification & awaiting dispatch',
      icon: Hourglass,
      color: 'border-blue-500 text-blue-600 bg-blue-50/60',
      badgeBg: 'bg-blue-600 text-white',
      accentColor: '#0284c7',
    },
    {
      id: 'escalate_if_late',
      title: 'Overdue / Escalated',
      count: counts.overdueEscalated,
      subtitle: 'Exceeded SLA deadline or escalated',
      icon: AlertTriangle,
      color: 'border-red-600 text-red-600 bg-red-50/70',
      badgeBg: 'bg-red-600 text-white animate-pulse',
      accentColor: '#dc2626',
    },
    {
      id: 'resolved',
      title: 'Resolved',
      count: counts.resolved,
      subtitle: 'Addressed with proof of work photo',
      icon: CheckCircle2,
      color: 'border-emerald-500 text-emerald-600 bg-emerald-50/60',
      badgeBg: 'bg-emerald-700 text-white',
      accentColor: '#059669',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeTab === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onSelectTab(card.id)}
            className={`p-4 rounded-md border-2 transition-all cursor-pointer shadow-2xs relative overflow-hidden ${
              isActive
                ? `${card.color} ring-2 ring-offset-1 ring-slate-400`
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  {card.title}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                  {card.count}
                </div>
              </div>
              <div
                className={`w-9 h-9 rounded-sm flex items-center justify-center shrink-0 ${
                  isActive ? card.badgeBg : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <p className="text-[11px] text-slate-600 mt-2 line-clamp-1 font-medium">
              {card.subtitle}
            </p>

            <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
              <span className="font-semibold">Click to filter queue</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

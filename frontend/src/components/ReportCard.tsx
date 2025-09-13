'use client';

import React from 'react';
import Image from 'next/image';
import { CivicReport } from '@/app/auth/dashboard/citizen/civic-report/page';
import { LuThumbsUp, LuThumbsDown } from 'react-icons/lu';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface ReportCardProps {
  report: CivicReport;
  handleVote: (reportId: string, type: 'support' | 'oppose') => Promise<void>;
  votingStates: Record<string, boolean>;
  onWithdraw?: (reportId: string) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
  report,
  handleVote,
  votingStates,
  onWithdraw,
}) => {
  const isVotingDisabled =
    report.hasVoted || votingStates[report.id] || !report.canVote;

  const getStatusColor = (status: CivicReport['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'escalated':
        return 'bg-red-500';
      case 'resolved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: CivicReport['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'escalated':
        return 'Escalated';
      case 'resolved':
        return 'Resolved';
      default:
        return 'Unknown';
    }
  };

  const statusColor = getStatusColor(report.status);
  const statusText = getStatusText(report.status);
  const timeAgo = formatDistanceToNow(parseISO(report.createdAt), { addSuffix: true });

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-700">
      {report.imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={report.imageUrl}
            alt={report.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl"
          />
        </div>
      )}
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-white leading-tight">
            {report.title}
          </h3>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${statusColor}`}>
            {statusText}
          </span>
        </div>
        <p className="text-gray-400 text-sm">{report.description}</p>
        <div className="flex justify-between items-center text-gray-500 text-xs font-mono">
          {report.createdBy && (
            <span className="text-gray-400 text-xs font-semibold">
              by {report.createdBy.name}
            </span>
          )}
          <span>{timeAgo}</span>
        </div>
        <div className="flex items-center space-x-4 text-sm font-semibold">
          <span className="flex items-center text-green-400">
            <LuThumbsUp className="mr-1" /> {report.supportCount} Supports
          </span>
          <span className="flex items-center text-red-400">
            <LuThumbsDown className="mr-1" /> {report.oppositionCount} Oppositions
          </span>
        </div>
        
        {report.isOwnReport ? (
          <div className="text-center py-2 bg-gray-800 rounded">
            <p className="text-gray-600 italic text-sm">📝 This is your report</p>
          </div>
        ) : report.hasVoted ? (
          <div className="text-center py-2 bg-gray-800 rounded">
            <p className="text-gray-600 italic text-sm">
              ✅ You {report.userVote === 'support' ? 'supported' : 'opposed'} this report
            </p>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => handleVote(report.id, 'support')}
              disabled={isVotingDisabled}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
            >
              👍 Support
            </button>
            <button
              onClick={() => handleVote(report.id, 'oppose')}
              disabled={isVotingDisabled}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
            >
              👎 Oppose
            </button>
          </div>
        )}
        
        {onWithdraw && (
          <button
            onClick={() => onWithdraw(report.id)}
            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold transition-colors"
          >
            Withdraw Report
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportCard;

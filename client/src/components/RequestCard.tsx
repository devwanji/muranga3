import React from 'react';
import { ServiceRequest } from '../types';
import { getStatusColor } from '../lib/utils';
import { formatDateTime } from '../lib/utils';

interface RequestCardProps {
  request: ServiceRequest;
  onRespond: (id: number) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onRespond }) => {
  // Get the appropriate status color
  const statusClass = getStatusColor(request.status);
  
  // Determine the circle color based on status
  const getCircleColor = () => {
    switch (request.status) {
      case 'new':
        return 'bg-alert';
      case 'seen':
        return 'bg-warning';
      case 'responded':
        return 'bg-success';
      default:
        return 'bg-neutral';
    }
  };
  
  // Format the date for display
  const formattedDate = formatDateTime(request.createdAt);
  
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-3 text-sm font-medium">
        <div className="flex items-center">
          <span className={`inline-block w-2 h-2 rounded-full ${getCircleColor()} mr-2`}></span>
          {request.title}
        </div>
      </td>
      <td className="px-4 py-3 text-sm">{request.phone}</td>
      <td className="px-4 py-3 text-sm text-neutral">{formattedDate}</td>
      <td className="px-4 py-3 text-sm">
        <span className={`inline-block ${statusClass} rounded-full px-2 py-1 text-xs font-semibold capitalize`}>
          {request.status}
        </span>
      </td>
      <td className="px-4 py-3 text-sm">
        {request.status !== 'responded' ? (
          <button 
            onClick={() => onRespond(request.id)}
            className="text-primary hover:text-primary-dark font-medium"
          >
            Respond
          </button>
        ) : (
          <button className="text-neutral hover:text-secondary font-medium">View</button>
        )}
      </td>
    </tr>
  );
};

export default RequestCard;

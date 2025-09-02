import { useGetAdminLogsQuery } from '../../services/api';
import Card from '../../components/ui/Card';

const AdminLogs = () => {
  const { data: logs = [], isLoading, error } = useGetAdminLogsQuery();

  // Movement type mapping
  const getMovementTypeText = (type) => {
    const typeMapping = {
      1: 'Stock In',
      2: 'Stock Out', 
      3: 'Adjustment',
      4: 'Sale',
      5: 'Return',
      6: 'Damage'
    };
    return typeMapping[type] || 'Unknown';
  };

  const getMovementTypeColor = (type) => {
    const colorMapping = {
      1: 'text-green-600 bg-green-100', // Stock In
      2: 'text-red-600 bg-red-100',     // Stock Out
      3: 'text-blue-600 bg-blue-100',   // Adjustment
      4: 'text-purple-600 bg-purple-100', // Sale
      5: 'text-yellow-600 bg-yellow-100', // Return
      6: 'text-red-600 bg-red-100'      // Damage
    };
    return colorMapping[type] || 'text-gray-600 bg-gray-100';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading logs: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">All Inventory Logs</h1>
        <div className="text-sm text-gray-500">
          Total Logs: {logs.length}
        </div>
      </div>

      <Card>
        {logs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No inventory movements recorded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{log.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMovementTypeColor(log.type)}`}>
                        {getMovementTypeText(log.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={log.change > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        {log.change > 0 ? '+' : ''}{log.change}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.previousQuantity} → {log.newQuantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {log.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {log.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminLogs;

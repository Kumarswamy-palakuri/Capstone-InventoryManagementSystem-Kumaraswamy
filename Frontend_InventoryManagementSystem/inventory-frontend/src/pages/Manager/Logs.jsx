import { useGetManagerLogsQuery, useExportLogsCsvMutation, useExportInventoryCsvMutation } from '../../services/api';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

const Logs = () => {
  const { data: logs = [], isLoading } = useGetManagerLogsQuery();
  const [exportLogs] = useExportLogsCsvMutation();
  const [exportInventory] = useExportInventoryCsvMutation();

  const handleExportLogs = async () => {
    try {
      const blob = await exportLogs().unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Logs exported successfully');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const handleExportInventory = async () => {
    try {
      const blob = await exportInventory().unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Inventory exported successfully');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const getMovementTypeColor = (type) => {
    const colors = {
      'StockIn': 'text-green-600 bg-green-100',
      'StockOut': 'text-red-600 bg-red-100',
      'Adjustment': 'text-blue-600 bg-blue-100',
      'Sale': 'text-purple-600 bg-purple-100',
      'Return': 'text-yellow-600 bg-yellow-100',
      'Damage': 'text-red-600 bg-red-100',
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Logs</h1>
        <div className="space-x-3">
          <Button variant="secondary" onClick={handleExportInventory}>
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            Export Inventory
          </Button>
          <Button onClick={handleExportLogs}>
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            Export Logs
          </Button>
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
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMovementTypeColor(log.type)}`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={log.change > 0 ? 'text-green-600' : 'text-red-600'}>
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
                      {new Date(log.timestamp).toLocaleDateString()}
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

export default Logs;

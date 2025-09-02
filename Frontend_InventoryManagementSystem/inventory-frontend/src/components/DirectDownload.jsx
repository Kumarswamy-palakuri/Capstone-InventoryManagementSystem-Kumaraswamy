import React from 'react';
import toast from 'react-hot-toast';

const DirectDownload = () => {
  
  const downloadFile = async (url, filename) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get filename from Content-Disposition header or use default
      const disposition = response.headers.get('Content-Disposition');
      let downloadFilename = filename;
      
      if (disposition && disposition.includes('attachment')) {
        const regex = /filename[^;=\n]*=([^\n]*)/;
        const matches = regex.exec(disposition);
        if (matches && matches[1]) {
          downloadFilename = matches[1].replace(/['"]/g, '');
        }
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);
      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed: ' + error.message);
    }
  };

  const handleDownloadLogs = () => {
    downloadFile('https://localhost:7273/api/Manager/reports/logs.csv', 'logs_export.csv');
  };

  const handleDownloadInventory = () => {
    downloadFile('https://localhost:7273/api/Manager/reports/inventory.csv', 'inventory_export.csv');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Quick Export</h3>
      <div className="flex space-x-4">
        <button
          onClick={handleDownloadLogs}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          📥 Download Logs CSV
        </button>
        
        <button
          onClick={handleDownloadInventory}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          📦 Download Inventory CSV
        </button>
      </div>
    </div>
  );
};

export default DirectDownload;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [roleUpdatingUserId, setRoleUpdatingUserId] = useState(null);
  
  // Enhanced state for search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('active');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://localhost:7273/api/Admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to load users');
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Enhanced delete function with better UX
  const handleDelete = async (userId) => {
    const user = users.find(u => u.id === userId);
    const username = user ? `${user.firstName} ${user.lastName}` : 'this user';
    
    if (!window.confirm(`Are you sure you want to delete ${username}? This action cannot be undone.`)) return;
    
    setDeleteLoading(userId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://localhost:7273/api/Admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        
        // ✅ This immediately removes the user from the UI
        setUsers(users.filter(user => user.id !== userId));
        
        if (result.type === 'soft_delete') {
          toast.success('User deactivated successfully (had related data)');
        } else {
          toast.success('User deleted successfully');
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error('Failed to delete user');
    } finally {
      setDeleteLoading(null);
    }
  };

  // ✅ Enhanced role change with better error handling
  const handleRoleChange = async (userId, newRole) => {
    setRoleUpdatingUserId(userId);
    try {
      const token = localStorage.getItem('token');
      const roleMapping = { 'Staff': 1, 'Manager': 2, 'Admin': 3 };
      const roleValue = roleMapping[newRole];

      const response = await fetch(`https://localhost:7273/api/Admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: roleValue })
      });

      if (response.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: roleValue } : u));
        toast.success(`User role updated to ${newRole} successfully!`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update role');
      }
    } catch (error) {
      console.error('Role update error:', error);
      toast.error('Failed to update role');
    } finally {
      setRoleUpdatingUserId(null);
    }
  };

  // Helper functions
  const getRoleString = (role) => {
    const roleMap = { 1: 'Staff', 2: 'Manager', 3: 'Admin' };
    return typeof role === 'number' ? roleMap[role] : role;
  };

  const getStatusColor = (status) => {
    const statusMap = {
      0: 'bg-yellow-100 text-yellow-800',
      1: 'bg-green-100 text-green-800',
      2: 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-green-100 text-green-800';
  };

  const getStatusString = (status) => {
    const statusMap = { 0: 'Pending', 1: 'Active', 2: 'Inactive' };
    return typeof status === 'number' ? statusMap[status] : 'Active';
  };

  const getRoleBadgeColor = (role) => {
    const roleString = getRoleString(role);
    switch (roleString) {
      case 'Admin': return 'bg-red-500 text-white';
      case 'Manager': return 'bg-blue-500 text-white';
      case 'Staff': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // ✅ Enhanced filtering logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.email} ${user.username || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || getRoleString(user.role) === roleFilter;
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && (user.status === 1 || user.status === null)) ||
      (statusFilter === 'inactive' && user.status !== 1 && user.status !== null);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header with Statistics */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">User Management</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
            <span>Total: <span className="font-medium text-gray-900">{users.length}</span></span>
            <span>Filtered: <span className="font-medium text-gray-900">{filteredUsers.length}</span></span>
            <span>Active: <span className="font-medium text-green-600">
              {users.filter(u => u.status === 1 || u.status === null).length}
            </span></span>
          </div>
        </div>
        <Link
          to="/admin/users/create"
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base w-full sm:w-auto transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New User
        </Link>
      </div>

      {/* Search and Filter Section */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="Staff">Staff</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </Card>

      {/* Users List */}
  {filteredUsers.length === 0 ? (
  <Card>
    <div className="text-center py-8 sm:py-12">
      <UserGroupIcon className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
      {users.length === 0 ? (
        <>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-4 px-4">Get started by adding your first user to the system.</p>
          <Link
            to="/admin/users/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add First User
          </Link>
        </>
      ) : (
        <>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No users match your filters</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-4 px-4">Try adjusting your search criteria or clearing the filters.</p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm sm:text-base"
          >
            Clear All Filters
          </button>
        </>
      )}
    </div>
  </Card>
) : (
  <div className="space-y-2 sm:space-y-3">
    {filteredUsers.map((user) => (
     
      <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
        {/* {console.log(user)} */}
        <div className="p-3 sm:p-4 lg:px-6 lg:py-4">
          
          {/* Mobile Layout - Completely Stacked */}
          <div className="block sm:hidden">
            {/* User Info Section */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                  {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col space-y-1">
                  <h3 className="text-base font-semibold text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {getRoleString(user.role)}
                    </span>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                      {getStatusString(user.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mb-3 pl-15">
              <p className="text-sm text-gray-500 truncate">
                {user.username ? `@${user.username}` : ''}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {user.email}
              </p>
            </div>

            {/* Role Change Buttons - Mobile Full Width */}
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-700 mb-2">Change Role:</p>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={getRoleString(user.role) === 'Staff' ? 'primary' : 'secondary'}
                  onClick={() => handleRoleChange(user.id, 'Staff')}
                  disabled={getRoleString(user.role) === 'Staff' || roleUpdatingUserId === user.id}
                  className="flex-1 py-2 text-xs font-medium"
                >
                  {roleUpdatingUserId === user.id ? '...' : 'Staff'}
                </Button>
                <Button
                  size="sm"
                  variant={getRoleString(user.role) === 'Manager' ? 'primary' : 'secondary'}
                  onClick={() => handleRoleChange(user.id, 'Manager')}
                  disabled={getRoleString(user.role) === 'Manager' || roleUpdatingUserId === user.id}
                  className="flex-1 py-2 text-xs font-medium"
                >
                  {roleUpdatingUserId === user.id ? '...' : 'Manager'}
                </Button>
                <Button
                  size="sm"
                  variant={getRoleString(user.role) === 'Admin' ? 'primary' : 'secondary'}
                  onClick={() => handleRoleChange(user.id, 'Admin')}
                  disabled={getRoleString(user.role) === 'Admin' || roleUpdatingUserId === user.id}
                  className="flex-1 py-2 text-xs font-medium"
                >
                  {roleUpdatingUserId === user.id ? '...' : 'Admin'}
                </Button>
              </div>
            </div>

            {/* Actions - Mobile */}
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Link
                to={`/admin/users/edit/${user.id}`}
                className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit
              </Link>
              <button
                onClick={() => handleDelete(user.id)}
                disabled={deleteLoading === user.id}
                className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-md disabled:opacity-50 transition-colors"
              >
                {deleteLoading === user.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                    Delete
                  </>
                ) : (
                  <>
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tablet Layout - Medium screens */}
          <div className="hidden sm:block lg:hidden">
            <div className="flex flex-col space-y-3">
              {/* Top Row - User Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                      {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </h3>
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {getRoleString(user.role)}
                      </span>
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                        {getStatusString(user.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5 truncate max-w-sm">
                      {user.username ? `@${user.username} • ` : ''}{user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Row - Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant={getRoleString(user.role) === 'Staff' ? 'primary' : 'secondary'}
                    onClick={() => handleRoleChange(user.id, 'Staff')}
                    disabled={getRoleString(user.role) === 'Staff' || roleUpdatingUserId === user.id}
                    className="px-2 py-1.5 text-xs font-medium min-w-[50px]"
                  >
                    {roleUpdatingUserId === user.id ? '...' : 'Staff'}
                  </Button>
                  <Button
                    size="sm"
                    variant={getRoleString(user.role) === 'Manager' ? 'primary' : 'secondary'}
                    onClick={() => handleRoleChange(user.id, 'Manager')}
                    disabled={getRoleString(user.role) === 'Manager' || roleUpdatingUserId === user.id}
                    className="px-2 py-1.5 text-xs font-medium min-w-[60px]"
                  >
                    {roleUpdatingUserId === user.id ? '...' : 'Manager'}
                  </Button>
                  <Button
                    size="sm"
                    variant={getRoleString(user.role) === 'Admin' ? 'primary' : 'secondary'}
                    onClick={() => handleRoleChange(user.id, 'Admin')}
                    disabled={getRoleString(user.role) === 'Admin' || roleUpdatingUserId === user.id}
                    className="px-2 py-1.5 text-xs font-medium min-w-[50px]"
                  >
                    {roleUpdatingUserId === user.id ? '...' : 'Admin'}
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    to={`/admin/users/edit/${user.id}`}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(user.id)}
                    disabled={deleteLoading === user.id}
                    className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-50 transition-colors rounded-md hover:bg-red-50"
                  >
                    {deleteLoading === user.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    ) : (
                      <TrashIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Large screens */}
          <div className="hidden lg:flex lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                  {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  <span className={`inline-flex px-3 py-0.5 text-sm font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                    {getRoleString(user.role)}
                  </span>
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                    {getStatusString(user.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  {user.username ? `@${user.username} • ` : ''}{user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant={getRoleString(user.role) === 'Staff' ? 'primary' : 'secondary'}
                  onClick={() => handleRoleChange(user.id, 'Staff')}
                  disabled={getRoleString(user.role) === 'Staff' || roleUpdatingUserId === user.id}
                  className="px-3 py-1.5 text-xs font-medium min-w-[60px]"
                >
                  {roleUpdatingUserId === user.id ? '...' : 'Staff'}
                </Button>
                <Button
                  size="sm"
                  variant={getRoleString(user.role) === 'Manager' ? 'primary' : 'secondary'}
                  onClick={() => handleRoleChange(user.id, 'Manager')}
                  disabled={getRoleString(user.role) === 'Manager' || roleUpdatingUserId === user.id}
                  className="px-3 py-1.5 text-xs font-medium min-w-[70px]"
                >
                  {roleUpdatingUserId === user.id ? '...' : 'Manager'}
                </Button>
                <Button
                  size="sm"
                  variant={getRoleString(user.role) === 'Admin' ? 'primary' : 'secondary'}
                  onClick={() => handleRoleChange(user.id, 'Admin')}
                  disabled={getRoleString(user.role) === 'Admin' || roleUpdatingUserId === user.id}
                  className="px-3 py-1.5 text-xs font-medium min-w-[60px]"
                >
                  {roleUpdatingUserId === user.id ? '...' : 'Admin'}
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Link
                  to={`/admin/users/edit/${user.id}`}
                  className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50"
                >
                  <PencilIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => handleDelete(user.id)}
                  disabled={deleteLoading === user.id}
                  className="p-1.5 text-gray-400 hover:text-red-600 disabled:opacity-50 transition-colors rounded-md hover:bg-red-50"
                >
                  {deleteLoading === user.id ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                  ) : (
                    <TrashIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
)}

    </div>
  );
};

export default UserManagement;

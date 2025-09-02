// import { useGetPendingApprovalsQuery, useApproveUserMutation, useRejectUserMutation } from '../../services/api';
// import toast from 'react-hot-toast';
// import Button from '../../components/ui/Button';
// import Card from '../../components/ui/Card';

// const Approvals = () => {
//   const { data: pendingUsers = [], isLoading, refetch } = useGetPendingApprovalsQuery();
//   const [approveUser] = useApproveUserMutation();
//   const [rejectUser] = useRejectUserMutation();

//   const handleApprove = async (id, role) => {
//     try {
//       console.log('Approving user:', { id, role }); // Debug log
      
//       // Send the role as a number (1 = Staff, 2 = Manager, 3 = Admin)
//       const roleValue = role === 'Staff' ? 1 : role === 'Manager' ? 2 : 3;
//       await approveUser({ id, role:roleValue }).unwrap();
//       toast.success('User approved successfully');
//       refetch();
//     } catch (err) {
//       toast.error(err.data?.message || 'Approval failed');
//     }
//   };

//   const handleReject = async (id) => {
//     if (window.confirm('Are you sure you want to reject this user?')) {
//       try {
//         await rejectUser(id).unwrap();
//         toast.success('User rejected');
//         refetch();
//       } catch (err) {
//         toast.error(err.data?.message || 'Rejection failed');
//       }
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }
// return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold text-gray-900">Pending User Approvals</h1>

//       {pendingUsers.length === 0 ? (
//         <Card>
//           <div className="text-center py-12">
//             <p className="text-gray-500">No pending approvals</p>
//           </div>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {pendingUsers.map((user) => (
//             <Card key={user.id}>
//               <div className="space-y-4">
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">
//                     {user.firstName} {user.lastName}
//                   </h3>
//                   <p className="text-sm text-gray-500">@{user.username}</p>
//                   <p className="text-sm text-gray-500">{user.email}</p>
//                 </div>
                
//                 <div className="text-xs text-gray-400">
//                   Registered: {new Date(user.createdAt).toLocaleDateString()}
//                 </div>

//                 <div className="space-y-2">
//                   <Button 
//                     size="sm" 
//                     onClick={() => handleApprove(user.id, 'Staff')}
//                     className="w-full"
//                   >
//                     Approve as Staff
//                   </Button>
//                   <Button 
//                     size="sm" 
//                     variant="secondary"
//                     onClick={() => handleApprove(user.id, 'Manager')}
//                     className="w-full"
//                   >
//                     Approve as Manager
//                   </Button>
//                   <Button 
//                     size="sm" 
//                     variant="danger" 
//                     onClick={() => handleReject(user.id)}
//                     className="w-full"
//                   >
//                     Reject
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
//   // return (
//   //   <div className="space-y-6">
//   //     <h1 className="text-2xl font-bold text-gray-900">Pending User Approvals</h1>

//   //     {pendingUsers.length === 0 ? (
//   //       <Card>
//   //         <div className="text-center py-12">
//   //           <p className="text-gray-500">No pending approvals</p>
//   //         </div>
//   //       </Card>
//   //     ) : (
//   //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//   //         {pendingUsers.map((user) => (
//   //           <Card key={user.id}>
//   //             <div className="space-y-4">
//   //               <div>
//   //                 <h3 className="text-lg font-medium text-gray-900">
//   //                   {user.firstName} {user.lastName}
//   //                 </h3>
//   //                 <p className="text-sm text-gray-500">@{user.username}</p>
//   //                 <p className="text-sm text-gray-500">{user.email}</p>
//   //               </div>
                
//   //               <div className="text-xs text-gray-400">
//   //                 Registered: {new Date(user.createdAt).toLocaleDateString()}
//   //               </div>

//   //               <div className="space-y-2">
//   //                 <div className="flex space-x-2">
//   //                   <Button 
//   //                     size="sm" 
//   //                     onClick={() => handleApprove(user.id, 'Staff')}
//   //                     className="flex-1"
//   //                   >
//   //                     Approve as Staff
//   //                   </Button>
//   //                 </div>
//   //                 <div className="flex space-x-2">
//   //                   <Button 
//   //                     size="sm" 
//   //                     variant="secondary"
//   //                     onClick={() => handleApprove(user.id, 'Manager')}
//   //                     className="flex-1"
//   //                   >
//   //                     Approve as Manager
//   //                   </Button>
//   //                 </div>
//   //                 <Button 
//   //                   size="sm" 
//   //                   variant="danger" 
//   //                   onClick={() => handleReject(user.id)}
//   //                   className="w-full"
//   //                 >
//   //                   Reject
//   //                 </Button>
//   //               </div>
//   //             </div>
//   //           </Card>
//   //         ))}
//   //       </div>
//   //     )}
//   //   </div>
//   // );
// };

// export default Approvals;
import { useGetPendingApprovalsQuery, useApproveUserMutation, useRejectUserMutation } from '../../services/api';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { UserIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const Approvals = () => {
  const { data: pendingUsers = [], isLoading, refetch } = useGetPendingApprovalsQuery();
  const [approveUser] = useApproveUserMutation();
  const [rejectUser] = useRejectUserMutation();

  const handleApprove = async (id, role) => {
    try {
      console.log('Approving user:', { id, role }); // Debug log
      
      // Send the role as a number (1 = Staff, 2 = Manager, 3 = Admin)
      const roleValue = role === 'Staff' ? 1 : role === 'Manager' ? 2 : 3;
      await approveUser({ id, role: roleValue }).unwrap();
      toast.success('User approved successfully');
      refetch();
    } catch (err) {
      toast.error(err.data?.message || 'Approval failed');
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this user?')) {
      try {
        await rejectUser(id).unwrap();
        toast.success('User rejected');
        refetch();
      } catch (err) {
        toast.error(err.data?.message || 'Rejection failed');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
            <UserIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pending User Approvals</h1>
            <p className="mt-1 text-sm text-gray-500">
              {pendingUsers.length} user{pendingUsers.length !== 1 ? 's' : ''} awaiting approval
            </p>
          </div>
        </div>
      </div>

      {pendingUsers.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <div className="py-16 text-center">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">All caught up!</h3>
            <p className="mt-2 text-gray-500">No pending user approvals at this time.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pendingUsers.map((user) => (
            <Card key={user.id} className="overflow-hidden transition-all hover:shadow-lg">
              <div className="p-2">
                {/* User Avatar & Info */}
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <span className="text-xl font-bold">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                  <p className="mt-1 text-sm text-gray-600">{user.email}</p>
                </div>

                {/* Registration Date */}
                <div className="mb-4 flex items-center justify-center space-x-2 rounded-lg bg-gray-50 py-2 px-3">
                  <ClockIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-700">
                    Registered {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 flex flex-col justify-center">
                  <div className="flex space-x-3">
                  <Button
                    onClick={() => handleApprove(user.id, 'Staff')}
                    className=" bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
                  >
                    {/* <CheckCircleIcon className="mr-2 h-4 w-4" /> */}
                    Approve as Staff
                  </Button>
                  
                  <Button
                    onClick={() => handleApprove(user.id, 'Manager')}
                    className=" bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                  >
                    {/* <CheckCircleIcon className="mr-2 h-4 w-4" /> */}
                    Approve as Manager
                  </Button>
                  </div>
                  <Button
                    onClick={() => handleReject(user.id)}
                    className=" bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                  >
                    <XCircleIcon className="mr-2 h-4 w-4" />
                    Reject User
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Approvals;

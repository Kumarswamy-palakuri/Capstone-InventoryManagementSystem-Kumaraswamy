import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:7273/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('content-type', 'application/json');
    return headers;
  },
});
const baseQueryWithRetry = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  
  if (result.error) {
    console.error('API Error:', result.error);
  }
  
  return result;
};
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Product', 'User', 'Movement', 'Approval'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
        transformResponse: (response) => {
    // Make sure the response structure matches what your backend returns
    return response;
  },
    }),
    register: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/register',
        method: 'POST',
        body: userInfo,
      }),
    }),
    getAllUsers: builder.query({
  query: () => '/admin/users',
  providesTags: ['User'],
}),
    // Product endpoints
    getProducts: builder.query({
      query: () => '/products',
      providesTags: ['Product'],
    }),
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, 'Product'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    getLowStockProducts: builder.query({
      query: () => '/products/low-stock',
      providesTags: ['Product'],
    }),

    // Admin endpoints
    getPendingApprovals: builder.query({
      query: () => '/admin/approvals',
      providesTags: ['Approval'],
    }),
    approveUser: builder.mutation({
      query: ({ id, role }) => ({
        url: `/admin/approvals/${id}/approve`,
        method: 'POST',
        body: { role },
      }),
      invalidatesTags: ['Approval', 'User'],
    }),
    rejectUser: builder.mutation({
      query: (id) => ({
        url: `/admin/approvals/${id}/reject`,
        method: 'POST',
      }),
      invalidatesTags: ['Approval'],
    }),
    getAllUsers: builder.query({
      query: () => '/admin/users',
      providesTags: ['User'],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['User'],
    }),
    getAdminLogs: builder.query({
      query: () => '/admin/logs',
      providesTags: ['Movement'],
    }),

    // Staff endpoints
    createMovement: builder.mutation({
      query: (movement) => ({
        url: '/staff/movements',
        method: 'POST',
        body: movement,
      }),
      invalidatesTags: ['Movement', 'Product'],
    }),
    getUserMovements: builder.query({
      query: () => '/staff/movements',
      providesTags: ['Movement'],
    }),

    // Manager endpoints
      getAdminLogs: builder.query({
      query: () => '/manager/logs',
      providesTags: ['Movement'],
    }),
    getManagerLogs: builder.query({
      query: () => '/manager/logs',
      providesTags: ['Movement'],
    }),
    exportLogsCsv: builder.mutation({
      query: () => ({
        url: '/manager/reports/logs.csv',
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
    exportInventoryCsv: builder.mutation({
      query: () => ({
        url: '/manager/reports/inventory.csv',
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetLowStockProductsQuery,
  useGetPendingApprovalsQuery,
  useApproveUserMutation,
  useRejectUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useGetAdminLogsQuery,
  useCreateMovementMutation,
  useGetUserMovementsQuery,
  useGetManagerLogsQuery,
  useExportLogsCsvMutation,
  useExportInventoryCsvMutation,
} = apiSlice;


import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useGetProductsQuery, useCreateMovementMutation } from '../../services/api';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const NewMovement = () => {
  const { data: products = [], isLoading: productsLoading } = useGetProductsQuery();
  const [createMovement, { isLoading }] = useCreateMovementMutation();
  
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  
  const selectedProductId = watch('productId');
  const selectedProduct = products.find(p => p.id === parseInt(selectedProductId));

  const onSubmit = async (data) => {
    try {
      await createMovement({
        ...data,
        productId: parseInt(data.productId),
        change: parseInt(data.change),
        type: parseInt(data.type)
      }).unwrap();
      toast.success('Movement recorded successfully');
      reset();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to record movement');
    }
  };

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Record Inventory Movement</h1>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product</label>
            <select
              {...register('productId', { required: 'Product is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (Current: {product.quantity})
                </option>
              ))}
            </select>
            {errors.productId && <p className="text-red-600 text-sm">{errors.productId.message}</p>}
          </div>

          {selectedProduct && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-blue-900">Selected Product Info</h4>
              <div className="mt-2 text-sm text-blue-700">
                <p><strong>Name:</strong> {selectedProduct.name}</p>
                <p><strong>Current Quantity:</strong> {selectedProduct.quantity}</p>
                <p><strong>Price:</strong> ${selectedProduct.price}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Movement Type</label>
            <select
              {...register('type', { required: 'Movement type is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select movement type</option>
              <option value="1">Stock In</option>
              <option value="2">Stock Out</option>
              <option value="3">Adjustment</option>
              <option value="4">Sale</option>
              <option value="5">Return</option>
              <option value="6">Damage</option>
            </select>
            {errors.type && <p className="text-red-600 text-sm">{errors.type.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity Change
              <span className="text-xs text-gray-500 ml-2">(positive for stock in, negative for stock out)</span>
            </label>
            <input
              {...register('change', { 
                required: 'Quantity change is required',
                valueAsNumber: true,
                validate: value => value !== 0 || 'Change cannot be zero'
              })}
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 10 for stock in, -5 for stock out"
            />
            {errors.change && <p className="text-red-600 text-sm">{errors.change.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <input
              {...register('reason', { required: 'Reason is required' })}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., New stock arrival, Customer purchase, etc."
            />
            {errors.reason && <p className="text-red-600 text-sm">{errors.reason.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
            <textarea
              {...register('notes')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="Additional notes about this movement..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => reset()}>
              Reset
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Recording...' : 'Record Movement'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NewMovement;

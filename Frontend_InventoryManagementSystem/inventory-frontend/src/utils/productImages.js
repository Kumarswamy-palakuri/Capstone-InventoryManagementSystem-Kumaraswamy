// Product-specific image mappings
export const productImageMap = {
  // You can add specific product images by ID or name
  'wireless-earphones': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop',
  'gaming-headset': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop',
  'bluetooth-speaker': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
};

// Category-based image mappings (primary system)
export const categoryImageMap = {
  'earphones': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop',
  'earphones-bluth': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop',
  'headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  'speakers': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
  'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
  'accessories': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
  'audio': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
};

// Smart image selection function
export const getProductImage = (product) => {
  const { id, name, category, sku } = product;
  
  // Priority 1: Specific product by name or SKU
  const productKey = name?.toLowerCase().replace(/\s+/g, '-') || sku?.toLowerCase();
  if (productKey && productImageMap[productKey]) {
    return productImageMap[productKey];
  }
  
  // Priority 2: Category-based image
  if (category && categoryImageMap[category.toLowerCase()]) {
    return categoryImageMap[category.toLowerCase()];
  }
  
  // Priority 3: Name-based category detection
  const nameKeywords = name?.toLowerCase() || '';
  for (const [categoryKey, imageUrl] of Object.entries(categoryImageMap)) {
    if (nameKeywords.includes(categoryKey) || nameKeywords.includes(categoryKey.replace('-', ' '))) {
      return imageUrl;
    }
  }
  
  // Priority 4: Default placeholder
  return 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop&overlay=text&text=Product&color=white&size=32';
};

// Get stock status color and text
export const getStockStatus = (product) => {
  const { quantity, lowStockThreshold = 10 } = product;
  
  if (quantity === 0) {
    return { status: 'out-of-stock', color: 'bg-red-500 text-white', text: 'Out of Stock' };
  } else if (quantity <= lowStockThreshold) {
    return { status: 'low-stock', color: 'bg-yellow-500 text-white', text: `${quantity} left` };
  } else {
    return { status: 'in-stock', color: 'bg-green-500 text-white', text: 'In Stock' };
  }
};

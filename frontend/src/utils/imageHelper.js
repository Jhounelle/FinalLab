/**
 * Helper function to get a proper URL for displaying images
 * This handles both backend-served images and local assets
 */
export function getImageUrl(image) {
  // Handle null/undefined images
  if (!image) {
    try {
      return require('@/assets/default-product.jpg');
    } catch (e) {
      return '';
    }
  }
  
  if (typeof image === 'string') {
    // If it's a complete URL, return it directly
    if (image.startsWith('http')) {
      return image;
    }
    
    // If it's a media URL starting with /media
    if (image.startsWith('/media/')) {
      return `http://localhost:8000${image}`;
    }
    
    // If it's a backend path with product_images
    if (image.includes('product_images/')) {
      return `http://localhost:8000/media/${image}`;
    }
    
    // For local assets, use require
    try {
      // Only try to require if it doesn't look like a URL
      if (!image.includes('/')) {
        return require(`@/assets/${image}`);
      } else {
        // If it has slashes but doesn't match known patterns, assume it's a backend URL
        return `http://localhost:8000/media/${image}`;
      }
    } catch (e) {
      console.error('Error loading image:', e);
      try {
        return require('@/assets/default-product.jpg');
      } catch (e) {
        return '';
      }
    }
  }
  
  // For any other cases, return the image as is
  return image;
} 
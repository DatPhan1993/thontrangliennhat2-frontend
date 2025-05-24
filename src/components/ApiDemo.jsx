import React, { useState, useEffect } from 'react';
import { getProducts } from '~/services/productService';
import { normalizeImageUrl } from '~/utils/imageUtils';

/**
 * 🔧 API Demo Component
 * Demonstrates how to use the API client and fix tools
 */
function ApiDemo() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Example: Fetch products using API client
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getProducts();
      setData(response);
      console.log('✅ Products loaded:', response?.length || 0);
    } catch (err) {
      setError(err.message);
      console.error('❌ API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Clear cache function
  const handleClearCache = async () => {
    try {
      // Clear sessionStorage cache
      sessionStorage.clear();
      alert('✅ Cache cleared successfully!');
      window.location.reload();
    } catch (err) {
      alert('❌ Failed to clear cache');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', margin: '20px', borderRadius: '8px' }}>
      <h3>🔧 API Demo & Fix Tools</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <button onClick={fetchProducts} disabled={loading}>
          {loading ? '🔄 Loading...' : '📦 Fetch Products'}
        </button>
        
        <button onClick={handleClearCache} style={{ marginLeft: '10px' }}>
          🧹 Clear Cache
        </button>
        
        <button 
          onClick={() => window.open('https://api.thontrangliennhat.com/fix-guide.html', '_blank')}
          style={{ marginLeft: '10px' }}
        >
          🛠️ Fix Guide
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          ❌ Error: {error}
        </div>
      )}

      {data && (
        <div>
          <p>✅ Successfully loaded {data.length} products</p>
          
          {data.slice(0, 3).map(product => (
            <div key={product.id} style={{ margin: '10px 0', padding: '10px', background: '#f5f5f5' }}>
              <h4>{product.name}</h4>
              {(product.image || product.images) && (
                <img 
                  src={normalizeImageUrl(
                    Array.isArray(product.images) && product.images.length > 0 
                      ? product.images[0] 
                      : product.image || product.images
                  )} 
                  alt={product.name}
                  style={{ maxWidth: '100px', height: 'auto' }}
                  onError={(e) => {
                    console.log('🔧 Image error for:', e.target.src);
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <p>{product.summary}</p>
            </div>
          ))}
        </div>
      )}
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>🌐 API Base: https://api.thontrangliennhat.com</p>
        <p>🔧 Image Utils: Using normalizeImageUrl</p>
        <p>📝 Cache: SessionStorage based</p>
      </div>
    </div>
  );
}

export default ApiDemo;

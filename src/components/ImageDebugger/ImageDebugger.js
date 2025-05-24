import React, { useState, useEffect } from 'react';
import { getProducts } from '~/services/productService';
import { normalizeImageUrl } from '~/utils/imageUtils';

const ImageDebugger = () => {
    const [products, setProducts] = useState([]);
    const [testResults, setTestResults] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show in development or when debugging
        const shouldShow = process.env.NODE_ENV === 'development' || 
                          window.location.search.includes('debug=true');
        setIsVisible(shouldShow);
        
        if (shouldShow) {
            loadTestData();
        }
    }, []);

    const loadTestData = async () => {
        try {
            const data = await getProducts();
            const testProducts = data?.slice(0, 3) || [];
            setProducts(testProducts);
            
            // Test each image
            const results = await Promise.all(
                testProducts.map(async (product) => {
                    const imageUrl = Array.isArray(product.images) && product.images.length > 0 
                        ? product.images[0] 
                        : product.images;
                    
                    const normalizedUrl = normalizeImageUrl(imageUrl);
                    
                    // Test if image loads
                    const canLoad = await testImageLoad(normalizedUrl);
                    
                    return {
                        id: product.id,
                        name: product.name,
                        originalImage: imageUrl,
                        normalizedUrl,
                        canLoad
                    };
                })
            );
            
            setTestResults(results);
        } catch (error) {
            console.error('ImageDebugger error:', error);
        }
    };

    const testImageLoad = (url) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
            
            // Timeout after 5 seconds
            setTimeout(() => resolve(false), 5000);
        });
    };

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            width: '300px',
            background: 'white',
            border: '2px solid #ff4444',
            borderRadius: '8px',
            padding: '15px',
            zIndex: 9999,
            fontSize: '12px',
            maxHeight: '400px',
            overflow: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: 0, color: '#ff4444' }}>🐛 Image Debug</h4>
                <button 
                    onClick={() => setIsVisible(false)}
                    style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}
                >
                    ✕
                </button>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
                <strong>Products tested: {testResults.length}</strong>
            </div>
            
            {testResults.map((result) => (
                <div key={result.id} style={{
                    padding: '8px',
                    margin: '5px 0',
                    background: result.canLoad ? '#e7f5e7' : '#ffe7e7',
                    borderRadius: '4px',
                    border: `1px solid ${result.canLoad ? '#4caf50' : '#f44336'}`
                }}>
                    <div style={{ fontWeight: 'bold' }}>
                        {result.canLoad ? '✅' : '❌'} {result.name}
                    </div>
                    <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                        <div>Original: {result.originalImage}</div>
                        <div>Normalized: {result.normalizedUrl}</div>
                    </div>
                    
                    {result.normalizedUrl && (
                        <img 
                            src={result.normalizedUrl}
                            alt={result.name}
                            style={{
                                width: '40px',
                                height: '30px',
                                objectFit: 'cover',
                                marginTop: '4px',
                                border: '1px solid #ddd'
                            }}
                            onError={(e) => {
                                e.target.style.background = '#ffcccc';
                                e.target.style.border = '1px solid red';
                            }}
                        />
                    )}
                </div>
            ))}
            
            <div style={{ marginTop: '10px', fontSize: '10px', color: '#888' }}>
                Add ?debug=true to URL to show this panel
            </div>
        </div>
    );
};

export default ImageDebugger; 
import React, { useState, useEffect } from 'react';
import { getProducts } from '~/services/productService';
import { normalizeImageUrl, DEFAULT_IMAGE } from '~/utils/imageUtils';

const ImageDebug = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageTests, setImageTests] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log('🔍 [ImageDebug] Fetching products...');
                const data = await getProducts();
                console.log('📦 [ImageDebug] Products received:', data?.length || 0);
                setProducts(data || []);
                
                // Test first few products
                if (data && data.length > 0) {
                    const testProducts = data.slice(0, 5);
                    const tests = testProducts.map(product => {
                        const imageUrl = Array.isArray(product.images) && product.images.length > 0 
                            ? product.images[0] 
                            : product.images;
                        
                        const normalizedUrl = normalizeImageUrl(imageUrl);
                        
                        return {
                            id: product.id,
                            name: product.name,
                            originalImage: imageUrl,
                            normalizedUrl: normalizedUrl,
                            status: 'testing'
                        };
                    });
                    setImageTests(tests);
                }
            } catch (err) {
                console.error('❌ [ImageDebug] Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleImageLoad = (index) => {
        console.log(`✅ [ImageDebug] Image ${index} loaded successfully`);
        setImageTests(prev => prev.map((test, i) => 
            i === index ? { ...test, status: 'success' } : test
        ));
    };

    const handleImageError = (index, url) => {
        console.error(`❌ [ImageDebug] Image ${index} failed to load:`, url);
        setImageTests(prev => prev.map((test, i) => 
            i === index ? { ...test, status: 'error' } : test
        ));
    };

    if (loading) return <div style={{ padding: '20px' }}>🔄 Loading debug data...</div>;
    if (error) return <div style={{ padding: '20px', color: 'red' }}>❌ Error: {error}</div>;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>🐛 Image Debug Page</h1>
            
            <div style={{ background: '#f5f5f5', padding: '15px', marginBottom: '20px', borderRadius: '8px' }}>
                <h2>📊 Summary</h2>
                <p>Total products: {products.length}</p>
                <p>Testing first 5 products</p>
                <p>API URL: https://api.thontrangliennhat.com</p>
            </div>

            <div style={{ background: '#fff', padding: '15px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h2>🧪 Direct Image Tests</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                    <div>
                        <h4>Test 1: Direct API Image</h4>
                        <img 
                            src="https://api.thontrangliennhat.com/images/uploads/1747304857516-52837735.jpg"
                            alt="Direct test 1"
                            style={{ width: '200px', height: '150px', objectFit: 'cover', border: '2px solid #ddd' }}
                            onLoad={() => console.log('✅ Direct test 1 loaded')}
                            onError={() => console.error('❌ Direct test 1 failed')}
                        />
                        <p style={{ fontSize: '12px', color: '#666' }}>
                            URL: https://api.thontrangliennhat.com/images/uploads/1747304857516-52837735.jpg
                        </p>
                    </div>
                    
                    <div>
                        <h4>Test 2: Placeholder</h4>
                        <img 
                            src={DEFAULT_IMAGE}
                            alt="Placeholder test"
                            style={{ width: '200px', height: '150px', objectFit: 'cover', border: '2px solid #ddd' }}
                            onLoad={() => console.log('✅ Placeholder loaded')}
                            onError={() => console.error('❌ Placeholder failed')}
                        />
                        <p style={{ fontSize: '12px', color: '#666' }}>
                            URL: {DEFAULT_IMAGE}
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h2>🍽️ Product Images Test</h2>
                {imageTests.length === 0 ? (
                    <p>No products to test</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                        {imageTests.map((test, index) => (
                            <div key={test.id} style={{ 
                                border: '1px solid #ddd', 
                                padding: '15px', 
                                borderRadius: '8px',
                                backgroundColor: test.status === 'success' ? '#f0fff0' : test.status === 'error' ? '#fff0f0' : '#f9f9f9'
                            }}>
                                <h4>{test.name} (ID: {test.id})</h4>
                                <div style={{ marginBottom: '10px' }}>
                                    <strong>Status:</strong> {test.status === 'success' ? '✅ Loaded' : test.status === 'error' ? '❌ Failed' : '🔄 Testing'}
                                </div>
                                <img 
                                    src={test.normalizedUrl}
                                    alt={test.name}
                                    style={{ 
                                        width: '200px', 
                                        height: '150px', 
                                        objectFit: 'cover', 
                                        border: `2px solid ${test.status === 'success' ? 'green' : test.status === 'error' ? 'red' : '#ddd'}`,
                                        borderRadius: '4px'
                                    }}
                                    onLoad={() => handleImageLoad(index)}
                                    onError={() => handleImageError(index, test.normalizedUrl)}
                                />
                                <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                                    <div><strong>Original:</strong> {test.originalImage}</div>
                                    <div><strong>Normalized:</strong> {test.normalizedUrl}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageDebug; 
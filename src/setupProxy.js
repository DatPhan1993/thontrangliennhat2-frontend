const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy tất cả các URL có chứa 'api'
  app.use('/api', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
  }));
  
  // Proxy request đến thontrangliennhat-api
  app.use('/thontrangliennhat-api', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
  }));
  
  // Proxy request đến images
  app.use('/images', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
  }));
  
  // Proxy uploads folder
  app.use('/uploads', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
  }));
}; 
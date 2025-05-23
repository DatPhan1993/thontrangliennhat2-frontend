#!/usr/bin/env node

/**
 * 🚀 Automatic Frontend Setup Script
 * ==================================
 * 
 * This script automatically configures your frontend project to use
 * the API client and fix tools for cache and localhost URL issues.
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Frontend Auto Setup...');

// Configuration
const CONFIG = {
  API_BASE: 'https://api.thontrangliennhat.com',
  FRONTEND_BASE: 'https://thontrangliennhat.com',
  LOCAL_API: 'http://localhost:3001'
};

// Helper function to read file safely
function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.warn(`⚠️  Could not read ${filePath}:`, error.message);
    return null;
  }
}

// Helper function to write file safely
function writeFileSafe(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to write ${filePath}:`, error.message);
    return false;
  }
}

// Function to fix localhost URLs in files
function fixLocalhostUrls(content, filePath) {
  if (!content) return content;
  
  let fixedContent = content;
  let changeCount = 0;
  
  // Fix common localhost patterns
  const replacements = [
    ['http://localhost:3001', CONFIG.API_BASE],
    ['http://localhost:3000', CONFIG.FRONTEND_BASE],
    ['"localhost:3001"', `"${CONFIG.API_BASE.replace('https://', '')}"`],
    ['"localhost:3000"', `"${CONFIG.FRONTEND_BASE.replace('https://', '')}"`],
  ];
  
  replacements.forEach(([old, newUrl]) => {
    const regex = new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = fixedContent.match(regex);
    if (matches) {
      changeCount += matches.length;
      fixedContent = fixedContent.replace(regex, newUrl);
    }
  });
  
  if (changeCount > 0) {
    console.log(`🔧 Fixed ${changeCount} localhost URLs in ${filePath}`);
  }
  
  return fixedContent;
}

// Function to add API import to JS/JSX files
function addApiImport(content, filePath) {
  if (!content) return content;
  
  // Check if API import already exists
  if (content.includes('from \'./utils/api\'') || content.includes('from "../utils/api"')) {
    return content;
  }
  
  // Check if file makes API calls
  const hasApiCalls = /fetch\(|axios\.|useEffect.*api/i.test(content);
  
  if (hasApiCalls && content.includes('import')) {
    // Find the last import statement
    const lines = content.split('\n');
    let lastImportIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        lastImportIndex = i;
      }
    }
    
    if (lastImportIndex >= 0) {
      lines.splice(lastImportIndex + 1, 0, "import api from '../utils/api';");
      console.log(`✅ Added API import to ${filePath}`);
      return lines.join('\n');
    }
  }
  
  return content;
}

// Function to scan and fix files in a directory
function scanAndFixDirectory(dirPath, extensions = ['.js', '.jsx', '.ts', '.tsx', '.json']) {
  if (!fs.existsSync(dirPath)) {
    console.warn(`⚠️  Directory not found: ${dirPath}`);
    return;
  }
  
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !['node_modules', '.git', 'build'].includes(file)) {
      // Recursively scan subdirectories
      scanAndFixDirectory(filePath, extensions);
    } else if (stat.isFile()) {
      const ext = path.extname(file);
      
      if (extensions.includes(ext)) {
        const content = readFileSafe(filePath);
        if (content) {
          let fixedContent = fixLocalhostUrls(content, filePath);
          
          // Add API import for JS/JSX files
          if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
            fixedContent = addApiImport(fixedContent, filePath);
          }
          
          if (fixedContent !== content) {
            writeFileSafe(filePath, fixedContent);
          }
        }
      }
    }
  });
}

// Function to update package.json scripts
function updatePackageJson() {
  const packagePath = './package.json';
  const content = readFileSafe(packagePath);
  
  if (content) {
    try {
      const packageJson = JSON.parse(content);
      
      // Add fix script
      if (!packageJson.scripts) {
        packageJson.scripts = {};
      }
      
      packageJson.scripts['fix-cache'] = 'node setup-fix.js';
      packageJson.scripts['clear-cache'] = 'rm -rf node_modules/.cache && rm -rf build';
      
      // Update homepage if it's localhost
      if (packageJson.homepage && packageJson.homepage.includes('localhost')) {
        packageJson.homepage = CONFIG.FRONTEND_BASE;
        console.log('🔧 Updated homepage in package.json');
      }
      
      writeFileSafe(packagePath, JSON.stringify(packageJson, null, 2));
      
    } catch (error) {
      console.error('❌ Failed to update package.json:', error.message);
    }
  }
}

// Function to create a demo component showing how to use the API
function createApiDemoComponent() {
  const demoPath = './src/components/ApiDemo.jsx';
  
  if (fs.existsSync(demoPath)) {
    console.log('ℹ️  ApiDemo component already exists, skipping...');
    return;
  }
  
  const demoContent = `import React, { useState, useEffect } from 'react';
import api, { ImageUtils, CacheUtils } from '../utils/api';

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
      const response = await api.getProducts();
      setData(response.data);
      console.log('✅ Products loaded:', response.data?.length || 0);
    } catch (err) {
      setError(err.message);
      console.error('❌ API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Clear cache function
  const handleClearCache = async () => {
    const success = await CacheUtils.clearAllCache();
    if (success) {
      alert('✅ Cache cleared successfully!');
      window.location.reload();
    } else {
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
          onClick={() => window.open('${CONFIG.API_BASE}/fix-guide.html', '_blank')}
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
              {product.image && (
                <img 
                  src={ImageUtils.fixImageUrl(product.image)} 
                  alt={product.name}
                  style={{ maxWidth: '100px', height: 'auto' }}
                  onError={(e) => {
                    console.log('🔧 Image error fixed for:', e.target.src);
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
        <p>🌐 API Base: {api.baseURL}</p>
        <p>🔧 Fix Script: Loaded automatically</p>
        <p>📝 Guide: <a href="${CONFIG.API_BASE}/fix-guide.html" target="_blank">Open Fix Guide</a></p>
      </div>
    </div>
  );
}

export default ApiDemo;
`;

  // Create components directory if it doesn't exist
  const componentsDir = './src/components';
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }

  writeFileSafe(demoPath, demoContent);
}

// Function to update .env file
function updateEnvFile() {
  const envPath = './.env';
  const content = readFileSafe(envPath);
  
  if (content) {
    let updatedContent = content;
    
    // Add or update API configuration
    const envVars = {
      'REACT_APP_API_BASE_URL': CONFIG.API_BASE,
      'REACT_APP_BASE_URL': CONFIG.API_BASE,
      'REACT_APP_PUBLIC_URL': CONFIG.FRONTEND_BASE,
      'GENERATE_SOURCEMAP': 'false',
      'CI': 'false'
    };
    
    Object.entries(envVars).forEach(([key, value]) => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(updatedContent)) {
        updatedContent = updatedContent.replace(regex, `${key}=${value}`);
      } else {
        updatedContent += `\n${key}=${value}`;
      }
    });
    
    writeFileSafe(envPath, updatedContent.trim() + '\n');
  }
}

// Main execution
async function main() {
  console.log('🔍 Scanning frontend project...');
  
  // 1. Update .env file
  console.log('\n📝 Updating environment configuration...');
  updateEnvFile();
  
  // 2. Fix localhost URLs in source files
  console.log('\n🔧 Fixing localhost URLs in source files...');
  scanAndFixDirectory('./src');
  scanAndFixDirectory('./public');
  
  // 3. Update package.json
  console.log('\n📦 Updating package.json...');
  updatePackageJson();
  
  // 4. Create API demo component
  console.log('\n🧪 Creating API demo component...');
  createApiDemoComponent();
  
  // 5. Verify API client exists
  console.log('\n🔍 Checking API client...');
  const apiClientPath = './src/utils/api.js';
  if (fs.existsSync(apiClientPath)) {
    console.log('✅ API client found at src/utils/api.js');
  } else {
    console.log('⚠️  API client not found - should be at src/utils/api.js');
    console.log('   Run: cp ../thontrangliennhat2-api/frontend-config.js src/utils/api.js');
  }
  
  console.log('\n🎉 Frontend setup completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Test the API demo component: import ApiDemo from "./components/ApiDemo"');
  console.log('2. Use the API client: import api from "./utils/api"');
  console.log('3. Clear cache if needed: npm run clear-cache');
  console.log('4. Visit fix guide: ' + CONFIG.API_BASE + '/fix-guide.html');
  console.log('\n✨ All localhost URLs have been updated to production URLs!');
}

// Run the setup
main().catch(error => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
}); 
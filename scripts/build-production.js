#!/usr/bin/env node

/**
 * PRODUCTION BUILD SCRIPT
 * Optimized build process for AVION deployment
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const BUILD_START_TIME = Date.now();

console.log('🚀 Starting AVION Production Build...');
console.log('=' .repeat(50));

// Step 1: Environment validation
console.log('\n📋 Step 1: Validating Environment...');
validateEnvironment();

// Step 2: Clean previous build
console.log('\n🧹 Step 2: Cleaning Previous Build...');
cleanBuild();

// Step 3: Run production build
console.log('\n🔨 Step 3: Building Application...');
buildApplication();

// Step 4: Optimize build output
console.log('\n⚡ Step 4: Optimizing Build Output...');
optimizeBuild();

// Step 5: Generate build report
console.log('\n📊 Step 5: Generating Build Report...');
generateBuildReport();

// Step 6: Validate build
console.log('\n✅ Step 6: Validating Build...');
validateBuild();

console.log('\n🎉 Production Build Complete!');
console.log(`⏱️  Total Build Time: ${((Date.now() - BUILD_START_TIME) / 1000).toFixed(2)}s`);
console.log('=' .repeat(50));

/**
 * Validate environment and dependencies
 */
function validateEnvironment() {
  try {
    // Check Node.js version
    const nodeVersion = process.version;
    console.log(`   Node.js Version: ${nodeVersion}`);
    
    // Check if package.json exists
    if (!existsSync('package.json')) {
      throw new Error('package.json not found');
    }
    
    // Check if critical files exist
    const criticalFiles = [
      'src/App.jsx',
      'src/main.jsx',
      'index.html',
      'vite.config.js'
    ];
    
    criticalFiles.forEach(file => {
      if (!existsSync(file)) {
        throw new Error(`Critical file missing: ${file}`);
      }
    });
    
    // Check environment variables
    const requiredEnvVars = [
      'VITE_APP_NAME',
      'VITE_APP_VERSION'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    if (missingEnvVars.length > 0) {
      console.warn(`   ⚠️  Missing environment variables: ${missingEnvVars.join(', ')}`);
    }
    
    console.log('   ✅ Environment validation passed');
  } catch (error) {
    console.error(`   ❌ Environment validation failed: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Clean previous build artifacts
 */
function cleanBuild() {
  try {
    execSync('rm -rf dist', { stdio: 'inherit' });
    console.log('   ✅ Previous build cleaned');
  } catch (error) {
    console.log('   ℹ️  No previous build to clean');
  }
}

/**
 * Build the application
 */
function buildApplication() {
  try {
    const buildStartTime = Date.now();
    
    // Set production environment
    process.env.NODE_ENV = 'production';
    
    // Run Vite build
    execSync('npm run build', { stdio: 'inherit' });
    
    const buildTime = ((Date.now() - buildStartTime) / 1000).toFixed(2);
    console.log(`   ✅ Application built successfully in ${buildTime}s`);
  } catch (error) {
    console.error('   ❌ Build failed:', error.message);
    process.exit(1);
  }
}

/**
 * Optimize build output
 */
function optimizeBuild() {
  try {
    // Check if dist directory exists
    if (!existsSync('dist')) {
      throw new Error('Build output directory not found');
    }
    
    // Generate service worker if not exists
    if (!existsSync('dist/sw.js')) {
      console.log('   📝 Copying service worker...');
      execSync('cp public/sw.js dist/sw.js');
    }
    
    // Generate manifest.json if not exists
    if (!existsSync('dist/manifest.json')) {
      console.log('   📝 Generating manifest.json...');
      generateManifest();
    }
    
    // Optimize images (if imagemin is available)
    try {
      execSync('npx imagemin dist/**/*.{jpg,jpeg,png,gif,svg} --out-dir=dist', { stdio: 'pipe' });
      console.log('   🖼️  Images optimized');
    } catch (error) {
      console.log('   ℹ️  Image optimization skipped (imagemin not available)');
    }
    
    console.log('   ✅ Build optimization completed');
  } catch (error) {
    console.error(`   ❌ Build optimization failed: ${error.message}`);
  }
}

/**
 * Generate PWA manifest
 */
function generateManifest() {
  const manifest = {
    name: 'AVION - CUET Preparation Platform',
    short_name: 'AVION',
    description: 'Intelligent CUET preparation with mistake-based learning',
    start_url: '/',
    display: 'standalone',
    background_color: '#667eea',
    theme_color: '#667eea',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ],
    categories: ['education', 'productivity'],
    lang: 'en-US'
  };
  
  writeFileSync('dist/manifest.json', JSON.stringify(manifest, null, 2));
}

/**
 * Generate build report
 */
function generateBuildReport() {
  try {
    const buildReport = {
      timestamp: new Date().toISOString(),
      buildTime: Date.now() - BUILD_START_TIME,
      nodeVersion: process.version,
      environment: process.env.NODE_ENV,
      files: {}
    };
    
    // Get file sizes
    try {
      const distFiles = execSync('find dist -type f -name "*.js" -o -name "*.css" -o -name "*.html"', { encoding: 'utf8' })
        .trim()
        .split('\n')
        .filter(Boolean);
      
      distFiles.forEach(file => {
        try {
          const stats = execSync(`stat -f%z "${file}" 2>/dev/null || stat -c%s "${file}"`, { encoding: 'utf8' });
          const size = parseInt(stats.trim());
          buildReport.files[file] = {
            size,
            sizeFormatted: formatBytes(size)
          };
        } catch (error) {
          // Skip files that can't be stat'd
        }
      });
    } catch (error) {
      console.log('   ℹ️  Could not analyze file sizes');
    }
    
    // Calculate total size
    const totalSize = Object.values(buildReport.files).reduce((sum, file) => sum + file.size, 0);
    buildReport.totalSize = totalSize;
    buildReport.totalSizeFormatted = formatBytes(totalSize);
    
    // Write build report
    writeFileSync('dist/build-report.json', JSON.stringify(buildReport, null, 2));
    
    console.log(`   📊 Build Report Generated`);
    console.log(`   📦 Total Build Size: ${buildReport.totalSizeFormatted}`);
    console.log(`   📁 Files: ${Object.keys(buildReport.files).length}`);
    
  } catch (error) {
    console.error(`   ❌ Build report generation failed: ${error.message}`);
  }
}

/**
 * Validate build output
 */
function validateBuild() {
  try {
    // Check if critical files exist
    const criticalFiles = [
      'dist/index.html',
      'dist/manifest.json'
    ];
    
    criticalFiles.forEach(file => {
      if (!existsSync(file)) {
        throw new Error(`Critical build file missing: ${file}`);
      }
    });
    
    // Check if index.html contains the app div
    const indexHtml = readFileSync('dist/index.html', 'utf8');
    if (!indexHtml.includes('<div id="root">')) {
      throw new Error('index.html missing root div');
    }
    
    // Check if JavaScript files exist
    const jsFiles = execSync('find dist -name "*.js" | head -1', { encoding: 'utf8' }).trim();
    if (!jsFiles) {
      throw new Error('No JavaScript files found in build');
    }
    
    console.log('   ✅ Build validation passed');
    console.log('   🚀 Ready for deployment!');
    
  } catch (error) {
    console.error(`   ❌ Build validation failed: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
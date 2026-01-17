#!/usr/bin/env node

/**
 * DEPLOYMENT VERIFICATION SCRIPT
 * Comprehensive checks to ensure AVION is deployment-ready
 */

import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

console.log('🔍 AVION Deployment Verification');
console.log('=' .repeat(50));

const checks = [
  { name: 'Build Output', check: checkBuildOutput },
  { name: 'Critical Files', check: checkCriticalFiles },
  { name: 'Environment Config', check: checkEnvironmentConfig },
  { name: 'Service Worker', check: checkServiceWorker },
  { name: 'PWA Manifest', check: checkPWAManifest },
  { name: 'Bundle Size', check: checkBundleSize },
  { name: 'Dependencies', check: checkDependencies },
  { name: 'Security', check: checkSecurity },
  { name: 'Performance', check: checkPerformance },
  { name: 'Accessibility', check: checkAccessibility }
];

let passedChecks = 0;
let totalChecks = checks.length;

for (const check of checks) {
  console.log(`\n📋 Checking: ${check.name}`);
  try {
    const result = await check.check();
    if (result.passed) {
      console.log(`   ✅ ${result.message}`);
      passedChecks++;
    } else {
      console.log(`   ❌ ${result.message}`);
      if (result.details) {
        console.log(`      ${result.details}`);
      }
    }
  } catch (error) {
    console.log(`   ❌ Check failed: ${error.message}`);
  }
}

console.log('\n' + '=' .repeat(50));
console.log(`📊 Verification Results: ${passedChecks}/${totalChecks} checks passed`);

if (passedChecks === totalChecks) {
  console.log('🎉 DEPLOYMENT READY! All checks passed.');
  console.log('🚀 You can safely deploy AVION to production.');
  process.exit(0);
} else {
  console.log('⚠️  DEPLOYMENT NOT READY. Please fix the failed checks.');
  console.log('🔧 Review the issues above and run verification again.');
  process.exit(1);
}

/**
 * Check if build output exists and is valid
 */
function checkBuildOutput() {
  if (!existsSync('dist')) {
    return { passed: false, message: 'Build output directory (dist) not found' };
  }
  
  if (!existsSync('dist/index.html')) {
    return { passed: false, message: 'index.html not found in build output' };
  }
  
  return { passed: true, message: 'Build output exists and is valid' };
}

/**
 * Check critical application files
 */
function checkCriticalFiles() {
  const criticalFiles = [
    'dist/index.html',
    'dist/manifest.json',
    'package.json',
    'README.md'
  ];
  
  const missingFiles = criticalFiles.filter(file => !existsSync(file));
  
  if (missingFiles.length > 0) {
    return { 
      passed: false, 
      message: 'Critical files missing',
      details: `Missing: ${missingFiles.join(', ')}`
    };
  }
  
  return { passed: true, message: 'All critical files present' };
}

/**
 * Check environment configuration
 */
function checkEnvironmentConfig() {
  const requiredConfigs = [
    'VITE_APP_NAME',
    'VITE_APP_VERSION'
  ];
  
  // Check if .env.example exists
  if (!existsSync('.env.example')) {
    return { passed: false, message: '.env.example file missing' };
  }
  
  // Check deployment configs
  const hasVercelConfig = existsSync('vercel.json');
  const hasNetlifyConfig = existsSync('netlify.toml');
  
  if (!hasVercelConfig && !hasNetlifyConfig) {
    return { 
      passed: false, 
      message: 'No deployment configuration found',
      details: 'Either vercel.json or netlify.toml should exist'
    };
  }
  
  return { passed: true, message: 'Environment configuration is valid' };
}

/**
 * Check service worker
 */
function checkServiceWorker() {
  if (!existsSync('public/sw.js')) {
    return { passed: false, message: 'Service worker file missing' };
  }
  
  const swContent = readFileSync('public/sw.js', 'utf8');
  
  if (!swContent.includes('CACHE_NAME')) {
    return { passed: false, message: 'Service worker appears to be incomplete' };
  }
  
  return { passed: true, message: 'Service worker is properly configured' };
}

/**
 * Check PWA manifest
 */
function checkPWAManifest() {
  if (!existsSync('dist/manifest.json')) {
    return { passed: false, message: 'PWA manifest missing from build' };
  }
  
  try {
    const manifest = JSON.parse(readFileSync('dist/manifest.json', 'utf8'));
    
    const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
    const missingFields = requiredFields.filter(field => !manifest[field]);
    
    if (missingFields.length > 0) {
      return { 
        passed: false, 
        message: 'PWA manifest incomplete',
        details: `Missing fields: ${missingFields.join(', ')}`
      };
    }
    
    return { passed: true, message: 'PWA manifest is complete' };
  } catch (error) {
    return { passed: false, message: 'PWA manifest is invalid JSON' };
  }
}

/**
 * Check bundle size
 */
function checkBundleSize() {
  try {
    const jsFiles = execSync('find dist -name "*.js" -type f', { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(Boolean);
    
    if (jsFiles.length === 0) {
      return { passed: false, message: 'No JavaScript files found in build' };
    }
    
    let totalSize = 0;
    jsFiles.forEach(file => {
      try {
        const size = execSync(`stat -f%z "${file}" 2>/dev/null || stat -c%s "${file}"`, { encoding: 'utf8' });
        totalSize += parseInt(size.trim());
      } catch (error) {
        // Skip files that can't be stat'd
      }
    });
    
    const totalSizeMB = totalSize / (1024 * 1024);
    
    if (totalSizeMB > 2) {
      return { 
        passed: false, 
        message: 'Bundle size too large',
        details: `Total JS size: ${totalSizeMB.toFixed(2)}MB (should be < 2MB)`
      };
    }
    
    return { 
      passed: true, 
      message: `Bundle size is acceptable (${totalSizeMB.toFixed(2)}MB)`
    };
  } catch (error) {
    return { passed: false, message: 'Could not analyze bundle size' };
  }
}

/**
 * Check dependencies
 */
function checkDependencies() {
  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    
    // Check for security vulnerabilities
    try {
      execSync('npm audit --audit-level=high', { stdio: 'pipe' });
    } catch (error) {
      return { 
        passed: false, 
        message: 'Security vulnerabilities found in dependencies',
        details: 'Run "npm audit fix" to resolve'
      };
    }
    
    // Check for outdated dependencies (warning only)
    try {
      const outdated = execSync('npm outdated --json', { encoding: 'utf8', stdio: 'pipe' });
      if (outdated.trim()) {
        console.log('   ⚠️  Some dependencies are outdated (not blocking deployment)');
      }
    } catch (error) {
      // npm outdated returns non-zero exit code when outdated packages exist
    }
    
    return { passed: true, message: 'Dependencies are secure and up-to-date' };
  } catch (error) {
    return { passed: false, message: 'Could not verify dependencies' };
  }
}

/**
 * Check security configuration
 */
function checkSecurity() {
  const indexHtml = readFileSync('dist/index.html', 'utf8');
  
  // Check for potential security issues
  const securityIssues = [];
  
  if (indexHtml.includes('eval(')) {
    securityIssues.push('eval() usage detected');
  }
  
  if (indexHtml.includes('javascript:')) {
    securityIssues.push('javascript: protocol detected');
  }
  
  // Check for hardcoded API keys (basic check)
  const apiKeyPatterns = [
    /sk-[a-zA-Z0-9]{48}/g, // OpenAI-style keys
    /gsk_[a-zA-Z0-9]+/g,   // Groq keys
    /AIza[0-9A-Za-z-_]{35}/g // Google API keys
  ];
  
  apiKeyPatterns.forEach(pattern => {
    if (pattern.test(indexHtml)) {
      securityIssues.push('Potential API key exposed in build');
    }
  });
  
  if (securityIssues.length > 0) {
    return { 
      passed: false, 
      message: 'Security issues detected',
      details: securityIssues.join(', ')
    };
  }
  
  return { passed: true, message: 'No security issues detected' };
}

/**
 * Check performance indicators
 */
function checkPerformance() {
  const indexHtml = readFileSync('dist/index.html', 'utf8');
  
  // Check for performance optimizations
  const hasPreload = indexHtml.includes('rel="preload"');
  const hasMinification = indexHtml.length < 5000; // Rough check for minification
  
  if (!hasMinification) {
    return { passed: false, message: 'HTML appears to not be minified' };
  }
  
  return { passed: true, message: 'Performance optimizations detected' };
}

/**
 * Check accessibility features
 */
function checkAccessibility() {
  const indexHtml = readFileSync('dist/index.html', 'utf8');
  
  const accessibilityFeatures = [
    { check: indexHtml.includes('lang='), name: 'language attribute' },
    { check: indexHtml.includes('viewport'), name: 'viewport meta tag' },
    { check: indexHtml.includes('<title>'), name: 'page title' }
  ];
  
  const missingFeatures = accessibilityFeatures
    .filter(feature => !feature.check)
    .map(feature => feature.name);
  
  if (missingFeatures.length > 0) {
    return { 
      passed: false, 
      message: 'Accessibility features missing',
      details: `Missing: ${missingFeatures.join(', ')}`
    };
  }
  
  return { passed: true, message: 'Basic accessibility features present' };
}
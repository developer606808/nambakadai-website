const fs = require('fs');
const path = require('path');

/**
 * Script to check all API routes for Next.js 15 compatibility issues
 * Specifically looks for routes that need async params
 */

function scanDirectory(dirPath, results = []) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules and .next directories
      if (item !== 'node_modules' && item !== '.next' && item !== '.git') {
        scanDirectory(fullPath, results);
      }
    } else if (item === 'route.ts' || item === 'route.js') {
      results.push(fullPath);
    }
  }

  return results;
}

function checkRouteFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];

    // Check for export async function patterns that might need async params
    const exportFunctionRegex = /export async function (GET|POST|PUT|DELETE|PATCH)\s*\(/g;
    let match;

    while ((match = exportFunctionRegex.exec(content)) !== null) {
      const functionName = match[1];
      const functionStart = match.index;

      // Look for the function signature and params
      const functionEnd = content.indexOf('{', functionStart);
      if (functionEnd !== -1) {
        const functionSignature = content.substring(functionStart, functionEnd);

        // Check if it has params but not Promise<>
        if (functionSignature.includes('params:') && !functionSignature.includes('Promise<')) {
          issues.push({
            type: 'async_params',
            function: functionName,
            line: content.substring(0, functionStart).split('\n').length,
            message: `${functionName} function needs async params: params should be Promise<{...}>`
          });
        }
      }
    }

    // Check for invalid exports (functions that shouldn't be exported)
    const invalidExportRegex = /export (?:async )?function [a-zA-Z_$][a-zA-Z0-9_$]*\s*\(/g;
    while ((match = invalidExportRegex.exec(content)) !== null) {
      const functionName = match[0].match(/function ([a-zA-Z_$][a-zA-Z0-9_$]*)/)?.[1];
      if (functionName && !['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(functionName)) {
        issues.push({
          type: 'invalid_export',
          function: functionName,
          line: content.substring(0, match.index).split('\n').length,
          message: `Invalid export: ${functionName} should not be exported from API route`
        });
      }
    }

    return issues;
  } catch (error) {
    return [{
      type: 'error',
      message: `Error reading file: ${error.message}`
    }];
  }
}

function main() {
  const apiDir = path.join(process.cwd(), 'app', 'api');

  if (!fs.existsSync(apiDir)) {
    console.error('❌ API directory not found:', apiDir);
    process.exit(1);
  }

  console.log('🔍 Scanning API routes for Next.js 15 compatibility issues...\n');

  const routeFiles = scanDirectory(apiDir);
  let totalIssues = 0;
  const filesWithIssues = [];

  for (const filePath of routeFiles) {
    const issues = checkRouteFile(filePath);
    if (issues.length > 0) {
      const relativePath = path.relative(process.cwd(), filePath);
      console.log(`📁 ${relativePath}:`);
      filesWithIssues.push(relativePath);

      for (const issue of issues) {
        if (issue.type === 'error') {
          console.log(`  ❌ ${issue.message}`);
        } else {
          console.log(`  ⚠️  Line ${issue.line}: ${issue.message}`);
        }
        totalIssues++;
      }
      console.log('');
    }
  }

  console.log('📊 Summary:');
  console.log(`   Total route files scanned: ${routeFiles.length}`);
  console.log(`   Files with issues: ${filesWithIssues.length}`);
  console.log(`   Total issues found: ${totalIssues}`);

  if (totalIssues === 0) {
    console.log('\n✅ All API routes are compatible with Next.js 15!');
  } else {
    console.log('\n⚠️  Issues found that need to be fixed for Next.js 15 compatibility.');
    console.log('\n🔧 Common fixes:');
    console.log('   1. Change params type from { params: {...} } to { params: Promise<{...}> }');
    console.log('   2. Add await when destructuring params: const { param } = await params;');
    console.log('   3. Remove invalid function exports from API routes');
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkRouteFile, scanDirectory };
const fs = require('fs');
const path = require('path');

const images = [
    'logo.webp',
    'imagen-inicio.webp',
    'pets-ingresando.webp',
    'mascotas-cerca.webp',
    'mascotas-reportadas1.webp'
];

const srcDir = path.join(__dirname, '..', 'fe-src', 'assets', 'images');
const destDir = path.join(__dirname, '..', 'public');

// Ensure public directory exists
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

images.forEach(img => {
    // Handle different naming conventions (underscore vs hyphen)
    const srcName = img.replace(/-/g, '_');
    const srcPath = fs.existsSync(path.join(srcDir, srcName)) 
        ? path.join(srcDir, srcName) 
        : path.join(srcDir, img);
    
    const destPath = path.join(destDir, img);
    
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`✓ Copied ${img}`);
    } else {
        console.log(`✗ Not found: ${srcName} or ${img}`);
    }
});

console.log('Images copy completed!');

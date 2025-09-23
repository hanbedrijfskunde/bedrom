# Deployment Guide - De Strategische Arena

## Prerequisites

- Web server with HTTPS support (for Service Worker)
- Modern browser support (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Node.js 16+ (for development only, not required for deployment)

## Production Deployment

### 1. Pre-deployment Checklist

- [ ] All 17 development tasks completed
- [ ] All tests passing (run `test-runner.html`)
- [ ] Lighthouse score >90 for all metrics
- [ ] WCAG 2.1 AA compliance verified
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness verified
- [ ] Offline functionality tested
- [ ] Security review completed

### 2. Build Optimization

```bash
# No build process required - static files only
# Ensure all files are minified for production:

# CSS files are already optimized
# JavaScript modules are already ES6+
# Images should be optimized
```

### 3. Server Configuration

#### Apache (.htaccess)
```apache
# Enable HTTPS redirect
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json
</IfModule>

# Set caching headers
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
</IfModule>

# Security headers
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "SAMEORIGIN"
Header set X-XSS-Protection "1; mode=block"
Header set Referrer-Policy "strict-origin-when-cross-origin"
Header set Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:;"
```

#### Nginx
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /var/www/strategische-arena;
    index toetsing.html;

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy strict-origin-when-cross-origin;
    add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:;";

    # Compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/javascript application/json;

    # Caching
    location ~* \.(css|js|png|jpg|jpeg|gif|webp|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Service Worker
    location /sw.js {
        add_header Cache-Control "no-cache";
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### 4. File Structure

```
/
├── toetsing.html (main entry point)
├── index.html (course landing page)
├── manifest.json
├── sw.js (Service Worker)
├── test-runner.html
├── test-pdf.html
├── css/
│   ├── design-system.css
│   ├── components.css
│   ├── mobile.css
│   └── accessibility.css
├── js/
│   ├── core/
│   │   ├── app.js
│   │   ├── state-manager.js
│   │   └── router.js
│   ├── components/
│   │   ├── role-selection.js
│   │   ├── timer.js
│   │   ├── progress-tracker.js
│   │   ├── preparation-materials.js
│   │   ├── qa-simulator.js
│   │   ├── team-coordination.js
│   │   └── mobile-navigation.js
│   └── services/
│       ├── offline-manager.js
│       ├── pdf-generator.js
│       ├── accessibility.js
│       └── performance-optimizer.js
├── data/
│   └── questions.json
├── images/
│   └── (icon files for PWA)
├── tests/
│   └── test-suite.js
└── issues/
    ├── bug-multiple-role-selection-modals.md
    └── feature-reset-memory-button.md
```

### 5. Environment Variables

No environment variables required - all configuration is client-side.

### 6. Deployment Steps

1. **Clone repository**
   ```bash
   git clone https://github.com/your-org/strategische-arena.git
   cd strategische-arena
   ```

2. **Verify file integrity**
   ```bash
   # Check all required files exist
   ls -la toetsing.html manifest.json sw.js
   ls -la js/core/ js/components/ js/services/
   ls -la css/ data/
   ```

3. **Upload to server**
   ```bash
   # Using rsync
   rsync -avz --exclude='.git' --exclude='node_modules' \
         ./ user@server:/var/www/strategische-arena/

   # Or using FTP/SFTP
   # Upload all files maintaining directory structure
   ```

4. **Set correct permissions**
   ```bash
   # On the server
   chmod -R 755 /var/www/strategische-arena
   chmod 644 /var/www/strategische-arena/**/*.{html,css,js,json}
   ```

5. **Verify deployment**
   - [ ] Navigate to https://your-domain.com/toetsing.html
   - [ ] Check Service Worker registration in DevTools
   - [ ] Test offline functionality
   - [ ] Verify all features work
   - [ ] Run Lighthouse audit

### 7. Post-deployment

1. **Monitor performance**
   - Use browser DevTools Performance tab
   - Check Core Web Vitals
   - Monitor error logs

2. **Analytics setup** (optional)
   ```javascript
   // Add to app.js if needed
   if (window.location.hostname !== 'localhost') {
       // Add analytics code here
   }
   ```

3. **Error tracking** (optional)
   - Consider adding Sentry or similar
   - Log errors to server

### 8. Rollback Procedure

If issues occur after deployment:

1. **Quick rollback**
   ```bash
   # Keep previous version backup
   mv /var/www/strategische-arena /var/www/strategische-arena-new
   mv /var/www/strategische-arena-backup /var/www/strategische-arena
   ```

2. **Clear Service Worker cache**
   - Update sw.js version number
   - Force cache refresh

### 9. Security Considerations

- [ ] HTTPS enabled
- [ ] CSP headers configured
- [ ] No sensitive data in client-side code
- [ ] Input validation on all forms
- [ ] XSS protection enabled
- [ ] Regular security audits

### 10. Maintenance

**Regular tasks:**
- Weekly: Check error logs
- Monthly: Review analytics
- Quarterly: Security audit
- Yearly: Dependency updates (CDN versions)

**Update procedure:**
1. Test changes locally
2. Deploy to staging environment
3. Run full test suite
4. Deploy to production during low-traffic hours
5. Monitor for issues

### 11. Troubleshooting

**Service Worker not updating:**
```javascript
// Force update by changing version in sw.js
const CACHE_NAME = 'strategische-arena-v2'; // Increment version
```

**LocalStorage issues:**
```javascript
// Clear LocalStorage if needed
localStorage.clear();
location.reload();
```

**Performance issues:**
- Check network tab for slow resources
- Review Performance tab in DevTools
- Ensure CDN resources are loading
- Check for console errors

### 12. Contact & Support

- Technical issues: [create issue on GitHub]
- Security concerns: security@your-domain.com
- General support: support@your-domain.com

---

## Production URLs

- Production: https://your-domain.com/toetsing.html
- Staging: https://staging.your-domain.com/toetsing.html
- Test runner: https://your-domain.com/test-runner.html

## License

MIT License - See LICENSE file for details

---

*Last updated: 2025-01-23*
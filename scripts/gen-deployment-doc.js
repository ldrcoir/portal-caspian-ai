// Generate Persian Word document: VPS Deployment Tutorial
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak, ShadingType, BorderStyle } = require("docx");
const fs = require("fs");

const C = { primary: "0B1121", accent: "38BDF8", emerald: "34D399", red: "EF4444", gray: "64748B", white: "FFFFFF", black: "000000", codeBg: "1A2744" };

function h(text, level) { return new Paragraph({ heading: level || HeadingLevel.HEADING_1, spacing: { before: 300, after: 150 }, children: [new TextRun({ text: text, bold: true, color: C.primary, font: "Tahoma", size: level === HeadingLevel.HEADING_1 ? 32 : 28 })] }); }
function p(text) { return new Paragraph({ spacing: { line: 360, before: 100, after: 100 }, alignment: AlignmentType.JUSTIFIED, indent: { firstLine: 420 }, children: [new TextRun({ text: text, font: "Tahoma", size: 24, color: C.black })] }); }
function code(text) { return new Paragraph({ spacing: { line: 280, before: 100, after: 100 }, shading: { type: ShadingType.CLEAR, fill: C.codeBg, color: "auto" }, children: [new TextRun({ text: text, font: "Consolas", size: 18, color: C.white })] }); }
function bullet(text) { return new Paragraph({ spacing: { line: 340, before: 50, after: 50 }, bullet: { level: 0 }, children: [new TextRun({ text: text, font: "Tahoma", size: 24, color: C.black })] }); }
function infoBox(text, color) { color = color || C.accent; return new Paragraph({ spacing: { line: 340, before: 150, after: 150 }, shading: { type: ShadingType.CLEAR, fill: "E0F2FE", color: "auto" }, border: { left: { style: BorderStyle.SINGLE, size: 24, color: color } }, children: [new TextRun({ text: text, font: "Tahoma", size: 22, color: C.primary, bold: true })] }); }
function step(num, title) { return new Paragraph({ spacing: { before: 300, after: 100 }, children: [new TextRun({ text: "مرحله " + num + ": " + title, font: "Tahoma", size: 28, bold: true, color: C.accent })] }); }

const envContent = [
  "cat > .env << ENDOFFILE",
  "# Database",
  "DATABASE_URL=postgresql://user:pass@localhost:5432/caspian",
  "# JWT Secret (min 32 chars)",
  "JWT_SECRET=your-jwt-secret-here",
  "# NextPay",
  "NEXTPAY_API_KEY=your-nextpay-key",
  "# OpenRouter",
  "OPENROUTER_API_KEY=your-openrouter-key",
  "# Site URL",
  "NEXTAUTH_URL=https://your-domain.com",
  "NEXTAUTH_SECRET=your-nextauth-secret",
  "ENDOFFILE",
].join("\n");

const nginxContent = [
  "server {",
  "    listen 80;",
  "    server_name your-domain.com;",
  "",
  "    location / {",
  "        proxy_pass http://localhost:3000;",
  "        proxy_http_version 1.1;",
  "        proxy_set_header Upgrade $http_upgrade;",
  '        proxy_set_header Connection "upgrade";',
  "        proxy_set_header Host $host;",
  "        proxy_set_header X-Real-IP $remote_addr;",
  "    }",
  "",
  "    # Security headers",
  '    add_header X-Frame-Options "SAMEORIGIN";',
  '    add_header X-Content-Type-Options "nosniff";',
  "",
  "    # Rate limiting",
  "    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;",
  "    location /api/ {",
  "        limit_req zone=api burst=20 nodelay;",
  "        proxy_pass http://localhost:3000;",
  "    }",
  "",
  "    client_max_body_size 15M;",
  "}",
].join("\n");

const doc = new Document({
  creator: "Caspian AI",
  title: "Caspian AI - VPS Deployment",
  styles: { default: { document: { run: { font: "Tahoma", size: 24 } } } },
  sections: [
    // Cover
    { properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1417, right: 1417 } } },
      children: [
        new Paragraph({ spacing: { before: 4000 }, children: [] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [new TextRun({ text: "Caspian AI", font: "Tahoma", size: 72, bold: true, color: C.primary })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [new TextRun({ text: "VPS Deployment Guide", font: "Tahoma", size: 40, color: C.accent })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Complete setup from zero - No Docker", font: "Tahoma", size: 24, color: C.gray })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 2000 }, children: [new TextRun({ text: "Version 1.0.0 - 2026", font: "Tahoma", size: 22, color: C.gray })] }),
        new Paragraph({ children: [new PageBreak()] }),
      ] },
    // Content
    { properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1417, right: 1417 } } },
      children: [
        h("Introduction"),
        p("This document provides complete setup instructions for Caspian AI platform on VPS. No Docker required - just Node.js and Nginx."),
        infoBox("Prerequisite: Ubuntu 22.04+ VPS with root access.", C.emerald),

        h("Part 1: Server Preparation"),
        step(1, "Connect to Server"),
        code("ssh root@YOUR_SERVER_IP"),

        step(2, "Update System"),
        code("apt update && apt upgrade -y"),

        step(3, "Install Node.js 20"),
        code("curl -fsSL https://deb.nodesource.com/setup_20.x | bash -\napt install -y nodejs\nnode --version"),

        step(4, "Install Bun"),
        code("curl -fsSL https://bun.sh/install | bash\nsource ~/.bashrc\nbun --version"),

        step(5, "Install Nginx"),
        code("apt install -y nginx\nsystemctl enable nginx\nsystemctl start nginx"),

        step(6, "Install PM2"),
        code("npm install -g pm2"),

        h("Part 2: Upload Project"),
        step(7, "Upload ZIP File"),
        code("scp caspian-ai.zip root@YOUR_SERVER_IP:/opt/"),

        step(8, "Extract Files"),
        code("cd /opt\nunzip caspian-ai.zip -d caspian-ai\ncd caspian-ai"),

        step(9, "Install Dependencies"),
        code("bun install"),

        step(10, "Create .env File"),
        code(envContent),
        infoBox("Important: JWT_SECRET must be at least 32 random characters. Generate with: openssl rand -base64 32", C.red),

        h("Part 3: Build and Run"),
        step(11, "Build Project"),
        code("bun run build"),

        step(12, "Run with PM2"),
        code('pm2 start "bun run start" --name caspian-ai\npm2 save\npm2 startup'),

        step(13, "Check Status"),
        code("pm2 status\npm2 logs caspian-ai"),

        h("Part 4: Configure Nginx"),
        step(14, "Create Nginx Config"),
        code("nano /etc/nginx/sites-available/caspian-ai"),
        p("Paste this configuration:"),
        code(nginxContent),

        step(15, "Enable Site"),
        code("ln -s /etc/nginx/sites-available/caspian-ai /etc/nginx/sites-enabled/\nnginx -t\nsystemctl restart nginx"),

        h("Part 5: SSL with Certbot"),
        step(16, "Install Certbot"),
        code("apt install -y certbot python3-certbot-nginx"),

        step(17, "Get SSL Certificate"),
        code("certbot --nginx -d your-domain.com"),

        step(18, "Check Auto-Renewal"),
        code("certbot renew --dry-run"),

        h("Part 6: Firewall Setup"),
        step(19, "Enable UFW"),
        code('ufw allow OpenSSH\nufw allow "Nginx Full"\nufw --force enable\nufw status'),

        h("Part 7: Auto Installer"),
        step(20, "Access Install Page"),
        code("https://your-domain.com/install"),
        p("Follow the installation wizard:"),
        bullet("Step 1: Check prerequisites (automatic)"),
        bullet("Step 2: Enter database info"),
        bullet("Step 3: Create admin account"),
        bullet("Step 4: Enter NextPay API key"),
        bullet("Step 5: Enter OpenRouter API key"),
        bullet("Step 6: Click Start Install"),
        p("After installation, installed.lock file is created and install page is no longer accessible."),

        h("Part 8: Server Management"),
        h("8.1. PM2 Commands"),
        code("pm2 status\npm2 logs caspian-ai\npm2 restart caspian-ai\npm2 stop caspian-ai"),

        h("8.2. Update Project"),
        code("cd /opt/caspian-ai\nbun install\nbun run build\npm2 restart caspian-ai"),

        h("8.3. Backup"),
        code("pg_dump caspian > /backup/caspian-$(date +%Y%m%d).sql\ntar -czf /backup/uploads-$(date +%Y%m%d).tar.gz /opt/caspian-ai/public/uploads"),

        h("8.4. Auto Backup (Cron)"),
        code("# crontab -e\n0 2 * * * pg_dump caspian > /backup/caspian-$(date +%Y%m%d).sql"),

        h("Part 9: Troubleshooting"),
        h("9.1. App Not Running"),
        code("pm2 logs caspian-ai --lines 50\nlsof -i :3000"),

        h("9.2. Nginx Errors"),
        code("nginx -t\nsystemctl status nginx\ncat /var/log/nginx/error.log"),

        h("9.3. SSL Issues"),
        code("certbot certificates\ncertbot renew --force-renewal"),

        h("9.4. Port 3000 Busy"),
        code("lsof -i :3000\nkill -9 PID\npm2 restart caspian-ai"),

        h("Part 10: Security"),
        h("10.1. Change SSH Port"),
        code("# /etc/ssh/sshd_config\nPort 2222\nsystemctl restart sshd"),

        h("10.2. Disable Root Login"),
        code("# /etc/ssh/sshd_config\nPermitRootLogin no\nsystemctl restart sshd"),
        infoBox("Before doing this, make sure you have a sudo user!", C.red),

        h("10.3. Install Fail2Ban"),
        code("apt install -y fail2ban\nsystemctl enable fail2ban\nsystemctl start fail2ban"),

        h("Part 11: Monitoring"),
        h("11.1. Install htop"),
        code("apt install -y htop\nhtop"),

        h("11.2. Check Nginx Logs"),
        code("tail -f /var/log/nginx/access.log\ntail -f /var/log/nginx/error.log"),

        h("Summary"),
        p("Congratulations! Caspian AI platform is now running on your VPS with HTTPS, valid SSL, active firewall, and PM2 monitoring."),
        p("Access admin panel at https://your-domain.com with the admin account you created during installation."),
        infoBox("Support: If you encounter issues, check the Support page - AI will try to help first.", C.emerald),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/home/z/my-project/download/caspian-vps-deployment-guide.docx", buffer);
  console.log("Deployment guide generated successfully");
});

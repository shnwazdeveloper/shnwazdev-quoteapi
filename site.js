const fs = require('fs')
const path = require('path')

const brandImage = fs.readFileSync(path.join(__dirname, 'assets', 'Quotly.png'))

function baseUrl (ctx) {
  return process.env.QUOTE_API_URI_HTML || ctx.origin
}

function shell ({ title, description, active, body, base }) {
  const nav = [
    { href: '/', label: 'Home', key: 'home' },
    { href: '/docs', label: 'Docs', key: 'docs' }
  ]

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="icon" type="image/png" href="/brand.png">
  <style>
    :root {
      color-scheme: light;
      --ink: #151515;
      --muted: #5f6268;
      --paper: #f7f3ec;
      --panel: #ffffff;
      --line: #ded8ce;
      --accent: #155d63;
      --accent-strong: #0e464b;
      --accent-soft: #d9f0ef;
      --mark: #f0b84f;
      --code: #202124;
      --code-paper: #f4efe6;
    }

    * {
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      margin: 0;
      min-height: 100vh;
      background: var(--paper);
      color: var(--ink);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.6;
      letter-spacing: 0;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .site-header {
      position: sticky;
      top: 0;
      z-index: 20;
      border-bottom: 1px solid var(--line);
      background: rgba(247, 243, 236, 0.94);
      backdrop-filter: blur(14px);
    }

    .nav {
      width: min(1120px, calc(100% - 32px));
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 72px;
      gap: 20px;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      font-weight: 800;
      letter-spacing: 0;
    }

    .brand img {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      object-fit: cover;
      border: 1px solid var(--line);
    }

    .brand span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .nav-links {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 5px;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: var(--panel);
    }

    .nav-links a {
      padding: 8px 14px;
      border-radius: 999px;
      color: var(--muted);
      font-size: 14px;
      font-weight: 700;
      transition: color 180ms ease, background-color 180ms ease, transform 180ms ease;
    }

    .nav-links a:hover,
    .nav-links a[aria-current="page"] {
      color: var(--ink);
      background: var(--accent-soft);
      transform: translateY(-1px);
    }

    main {
      overflow: hidden;
    }

    .section {
      width: min(1120px, calc(100% - 32px));
      margin: 0 auto;
      padding: 76px 0;
    }

    .hero {
      min-height: calc(100svh - 72px);
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(280px, 440px);
      align-items: center;
      gap: 56px;
      padding: 54px 0 42px;
    }

    .eyebrow {
      margin: 0 0 16px;
      color: var(--accent-strong);
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h1,
    h2,
    h3,
    p {
      margin-top: 0;
    }

    h1 {
      margin-bottom: 20px;
      max-width: 760px;
      font-size: clamp(42px, 8vw, 84px);
      line-height: 0.94;
      letter-spacing: 0;
    }

    h2 {
      margin-bottom: 14px;
      font-size: clamp(30px, 5vw, 52px);
      line-height: 1.04;
      letter-spacing: 0;
    }

    h3 {
      margin-bottom: 10px;
      font-size: 18px;
      line-height: 1.25;
      letter-spacing: 0;
    }

    .lead {
      max-width: 680px;
      color: var(--muted);
      font-size: clamp(18px, 2.5vw, 22px);
      line-height: 1.55;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 28px;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 46px;
      padding: 0 18px;
      border: 1px solid var(--accent-strong);
      border-radius: 8px;
      background: var(--accent-strong);
      color: #ffffff;
      font-weight: 800;
      transition: transform 180ms ease, background-color 180ms ease, color 180ms ease;
    }

    .button:hover {
      transform: translateY(-2px);
      background: var(--accent);
    }

    .button.secondary {
      background: transparent;
      color: var(--accent-strong);
    }

    .button.secondary:hover {
      background: var(--accent-soft);
      color: var(--ink);
    }

    .quote-preview {
      position: relative;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--panel);
      overflow: hidden;
      animation: floatCard 6200ms ease-in-out infinite;
    }

    .preview-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 14px 16px;
      border-bottom: 1px solid var(--line);
      background: #fbfaf7;
    }

    .window-dots {
      display: inline-flex;
      gap: 6px;
      flex: 0 0 auto;
    }

    .window-dots span {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: var(--line);
    }

    .preview-top code {
      overflow: hidden;
      color: var(--muted);
      font-size: 12px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .quote-card {
      margin: 26px;
      padding: 24px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background:
        linear-gradient(135deg, rgba(21, 93, 99, 0.08), transparent 42%),
        #fffdf9;
      transform-origin: center;
      animation: settleIn 720ms ease both;
    }

    .profile {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .avatar {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: var(--accent-soft);
      color: var(--accent-strong);
      font-weight: 900;
      border: 1px solid var(--line);
    }

    .name {
      margin: 0;
      font-weight: 900;
      line-height: 1.2;
    }

    .handle {
      margin: 2px 0 0;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.2;
    }

    .quote-line {
      margin: 0;
      color: #2b2b2b;
      font-size: 24px;
      font-weight: 800;
      line-height: 1.24;
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-top: 22px;
    }

    .metric,
    .feature,
    .doc-panel,
    .endpoint {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--panel);
    }

    .metric {
      padding: 14px;
    }

    .metric strong {
      display: block;
      font-size: 24px;
      line-height: 1;
    }

    .metric span {
      color: var(--muted);
      font-size: 13px;
      font-weight: 700;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      margin-top: 26px;
    }

    .feature {
      padding: 22px;
      transform: translateY(0);
      transition: transform 200ms ease, border-color 200ms ease;
    }

    .feature:hover {
      transform: translateY(-4px);
      border-color: var(--accent);
    }

    .feature p,
    .endpoint p,
    .doc-panel p {
      color: var(--muted);
    }

    .strip {
      border-block: 1px solid var(--line);
      background: #fffaf1;
    }

    .steps {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      margin-top: 28px;
      counter-reset: step;
    }

    .step {
      counter-increment: step;
      padding: 20px;
      border-left: 4px solid var(--mark);
      background: rgba(255, 255, 255, 0.64);
    }

    .step::before {
      content: counter(step, decimal-leading-zero);
      display: block;
      margin-bottom: 12px;
      color: var(--accent-strong);
      font-weight: 900;
    }

    .doc-hero {
      padding: 64px 0 36px;
    }

    .docs-layout {
      display: grid;
      grid-template-columns: 250px minmax(0, 1fr);
      gap: 28px;
      align-items: start;
    }

    .doc-nav {
      position: sticky;
      top: 96px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--panel);
      padding: 10px;
    }

    .doc-nav a {
      display: block;
      padding: 10px 12px;
      border-radius: 6px;
      color: var(--muted);
      font-size: 14px;
      font-weight: 800;
      transition: background-color 180ms ease, color 180ms ease, transform 180ms ease;
    }

    .doc-nav a:hover {
      color: var(--ink);
      background: var(--accent-soft);
      transform: translateX(2px);
    }

    .doc-panel {
      padding: 24px;
      margin-bottom: 18px;
    }

    .endpoint {
      margin-top: 14px;
      overflow: hidden;
    }

    .endpoint-header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      border-bottom: 1px solid var(--line);
      background: #fbfaf7;
    }

    .method {
      display: inline-flex;
      align-items: center;
      height: 28px;
      padding: 0 10px;
      border-radius: 6px;
      background: var(--accent-soft);
      color: var(--accent-strong);
      font-size: 12px;
      font-weight: 900;
    }

    .endpoint code,
    .inline-code {
      color: var(--code);
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
    }

    .endpoint-body {
      padding: 16px;
    }

    pre {
      margin: 0;
      overflow: auto;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--code-paper);
      color: var(--code);
      padding: 16px;
      font-size: 13px;
      line-height: 1.55;
    }

    .code-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin: 18px 0 8px;
    }

    .copy {
      border: 1px solid var(--line);
      border-radius: 7px;
      background: var(--panel);
      color: var(--accent-strong);
      cursor: pointer;
      font: inherit;
      font-size: 12px;
      font-weight: 900;
      padding: 6px 10px;
      transition: transform 180ms ease, background-color 180ms ease;
    }

    .copy:hover {
      background: var(--accent-soft);
      transform: translateY(-1px);
    }

    .footer {
      border-top: 1px solid var(--line);
      padding: 26px 0;
      color: var(--muted);
      font-size: 14px;
    }

    .footer-inner {
      width: min(1120px, calc(100% - 32px));
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    [data-motion] {
      animation: riseIn 650ms ease both;
    }

    [data-delay="1"] {
      animation-delay: 90ms;
    }

    [data-delay="2"] {
      animation-delay: 180ms;
    }

    [data-delay="3"] {
      animation-delay: 270ms;
    }

    @keyframes riseIn {
      from {
        transform: translateY(18px);
      }
      to {
        transform: translateY(0);
      }
    }

    @keyframes settleIn {
      from {
        transform: rotate(-1deg) translateY(12px);
      }
      to {
        transform: rotate(-1deg) translateY(0);
      }
    }

    @keyframes floatCard {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-8px);
      }
    }

    @media (max-width: 820px) {
      .nav {
        min-height: 66px;
      }

      .brand span {
        max-width: 170px;
      }

      .hero,
      .docs-layout {
        grid-template-columns: 1fr;
      }

      .hero {
        min-height: auto;
        gap: 32px;
        padding-top: 42px;
      }

      .section {
        padding: 54px 0;
      }

      .feature-grid,
      .steps,
      .metrics {
        grid-template-columns: 1fr;
      }

      .doc-nav {
        position: static;
      }
    }

    @media (max-width: 520px) {
      .nav {
        width: min(100% - 20px, 1120px);
        gap: 10px;
      }

      .brand img {
        width: 28px;
        height: 28px;
      }

      .brand span {
        max-width: 132px;
        font-size: 14px;
      }

      .nav-links a {
        padding: 7px 10px;
        font-size: 13px;
      }

      .section {
        width: min(100% - 24px, 1120px);
      }

      .actions {
        display: grid;
      }

      .button {
        width: 100%;
      }

      .quote-card {
        margin: 16px;
        padding: 18px;
      }

      .quote-line {
        font-size: 20px;
      }

      .doc-panel {
        padding: 18px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 1ms !important;
        scroll-behavior: auto !important;
        transition-duration: 1ms !important;
      }
    }
  </style>
</head>
<body>
  <header class="site-header">
    <nav class="nav" aria-label="Primary">
      <a class="brand" href="/">
        <img src="/brand.png" alt="" width="32" height="32">
        <span>shnwazdev-quoteapi</span>
      </a>
      <div class="nav-links">
        ${nav.map((item) => `<a href="${item.href}"${active === item.key ? ' aria-current="page"' : ''}>${item.label}</a>`).join('')}
      </div>
    </nav>
  </header>
  <main>${body}</main>
  <footer class="footer">
    <div class="footer-inner">
      <span>shnwazdev-quoteapi</span>
      <a href="${base}/health">Health check</a>
    </div>
  </footer>
  <script>
    document.querySelectorAll('[data-copy]').forEach((button) => {
      button.addEventListener('click', async () => {
        const target = document.getElementById(button.dataset.copy);
        if (!target) return;
        await navigator.clipboard.writeText(target.textContent.trim());
        const current = button.textContent;
        button.textContent = 'Copied';
        window.setTimeout(() => {
          button.textContent = current;
        }, 1200);
      });
    });
  </script>
</body>
</html>`
}

function landingPage (ctx) {
  const base = baseUrl(ctx)

  return shell({
    title: 'shnwazdev-quoteapi',
    description: 'Generate Telegram-style quote images from message JSON with a Vercel-hosted API.',
    active: 'home',
    base,
    body: `
      <section class="section hero">
        <div data-motion>
          <p class="eyebrow">Vercel quote image API</p>
          <h1>Telegram-style quote images from one API call.</h1>
          <p class="lead">Send message JSON to the API and receive a generated quote card as JSON, PNG, or WebP. Built for bots, dashboards, and tools that need shareable quote images fast.</p>
          <div class="actions">
            <a class="button" href="/docs">Open docs</a>
            <a class="button secondary" href="${base}/generate">View API shape</a>
          </div>
          <div class="metrics" aria-label="API highlights">
            <div class="metric"><strong>POST</strong><span>single request</span></div>
            <div class="metric"><strong>PNG</strong><span>direct output</span></div>
            <div class="metric"><strong>WebP</strong><span>supported format</span></div>
          </div>
        </div>
        <aside class="quote-preview" aria-label="Quote image preview" data-motion data-delay="1">
          <div class="preview-top">
            <div class="window-dots" aria-hidden="true"><span></span><span></span><span></span></div>
            <code>${base}/generate.png</code>
          </div>
          <div class="quote-card">
            <div class="profile">
              <div class="avatar">S</div>
              <div>
                <p class="name">Shnwaz Dev</p>
                <p class="handle">@quoteapi</p>
              </div>
            </div>
            <p class="quote-line">Build once, send JSON, get a clean quote image back.</p>
          </div>
        </aside>
      </section>
      <section class="strip">
        <div class="section">
          <p class="eyebrow" data-motion>What it does</p>
          <h2 data-motion data-delay="1">A small public face for a focused image API.</h2>
          <div class="feature-grid">
            <article class="feature" data-motion>
              <h3>Quote rendering</h3>
              <p>Creates Telegram-style quote cards from message text, sender details, replies, avatars, and media fields.</p>
            </article>
            <article class="feature" data-motion data-delay="1">
              <h3>Multiple responses</h3>
              <p>Use JSON responses for bot workflows or direct image endpoints when you want the generated file immediately.</p>
            </article>
            <article class="feature" data-motion data-delay="2">
              <h3>Vercel ready</h3>
              <p>Runs through a serverless handler while keeping the original local Node.js start command available.</p>
            </article>
          </div>
        </div>
      </section>
      <section class="section">
        <p class="eyebrow" data-motion>Flow</p>
        <h2 data-motion data-delay="1">From message data to image output.</h2>
        <div class="steps">
          <div class="step" data-motion><h3>Prepare JSON</h3><p>Build a request with one or more Telegram-like message objects.</p></div>
          <div class="step" data-motion data-delay="1"><h3>Post to API</h3><p>Send the request to <span class="inline-code">/generate</span>, <span class="inline-code">/generate.png</span>, or <span class="inline-code">/generate.webp</span>.</p></div>
          <div class="step" data-motion data-delay="2"><h3>Use the result</h3><p>Store the base64 payload, upload the direct image, or return it from your bot.</p></div>
        </div>
      </section>`
  })
}

function docsPage (ctx) {
  const base = baseUrl(ctx)
  const curlExample = `curl -X POST ${base}/generate.png \\
  -H "Content-Type: application/json" \\
  -o quote.png \\
  -d '{
    "messages": [
      {
        "from": { "id": 1, "name": "Shnwaz Dev" },
        "text": "Hello from shnwazdev-quoteapi"
      }
    ]
  }'`
  const jsonExample = `{
  "messages": [
    {
      "from": {
        "id": 1,
        "name": "Shnwaz Dev",
        "username": "shnwazdeveloper"
      },
      "text": "Generate a quote image from this message."
    }
  ]
}`
  const responseExample = `{
  "ok": true,
  "result": {
    "image": "base64-encoded-image",
    "type": "png"
  }
}`

  return shell({
    title: 'Docs | shnwazdev-quoteapi',
    description: 'API documentation for shnwazdev-quoteapi quote image generation endpoints.',
    active: 'docs',
    base,
    body: `
      <section class="section doc-hero">
        <p class="eyebrow" data-motion>Documentation</p>
        <h1 data-motion data-delay="1">Use the quote image API.</h1>
        <p class="lead" data-motion data-delay="2">The API accepts Telegram-like message JSON and generates quote images. Use the JSON endpoint for encoded output or the file endpoints for direct PNG/WebP responses.</p>
      </section>
      <section class="section docs-layout">
        <aside class="doc-nav" aria-label="Documentation sections" data-motion>
          <a href="#quick-start">Quick start</a>
          <a href="#endpoints">Endpoints</a>
          <a href="#request-body">Request body</a>
          <a href="#responses">Responses</a>
        </aside>
        <div>
          <article class="doc-panel" id="quick-start" data-motion>
            <h2>Quick start</h2>
            <p>Post a message payload to the image endpoint and save the response as a file.</p>
            <div class="code-title">
              <strong>cURL</strong>
              <button class="copy" type="button" data-copy="curl-example">Copy</button>
            </div>
            <pre id="curl-example"><code>${escapeHtml(curlExample)}</code></pre>
          </article>

          <article class="doc-panel" id="endpoints" data-motion>
            <h2>Endpoints</h2>
            <div class="endpoint">
              <div class="endpoint-header"><span class="method">POST</span><code>/generate</code></div>
              <div class="endpoint-body"><p>Returns a JSON response containing the generated image payload.</p></div>
            </div>
            <div class="endpoint">
              <div class="endpoint-header"><span class="method">POST</span><code>/generate.png</code></div>
              <div class="endpoint-body"><p>Returns the generated quote image directly as a PNG file.</p></div>
            </div>
            <div class="endpoint">
              <div class="endpoint-header"><span class="method">POST</span><code>/generate.webp</code></div>
              <div class="endpoint-body"><p>Returns the generated quote image directly as a WebP file.</p></div>
            </div>
            <div class="endpoint">
              <div class="endpoint-header"><span class="method">POST</span><code>/quote/generate</code></div>
              <div class="endpoint-body"><p>Legacy-compatible route for existing clients.</p></div>
            </div>
          </article>

          <article class="doc-panel" id="request-body" data-motion>
            <h2>Request body</h2>
            <p>Send JSON with a <span class="inline-code">messages</span> array. Each message should include sender data and text.</p>
            <div class="code-title">
              <strong>JSON</strong>
              <button class="copy" type="button" data-copy="json-example">Copy</button>
            </div>
            <pre id="json-example"><code>${escapeHtml(jsonExample)}</code></pre>
          </article>

          <article class="doc-panel" id="responses" data-motion>
            <h2>Responses</h2>
            <p>Successful JSON responses include <span class="inline-code">ok: true</span>. Direct file endpoints return image bytes with the matching content type.</p>
            <div class="code-title">
              <strong>JSON response</strong>
              <button class="copy" type="button" data-copy="response-example">Copy</button>
            </div>
            <pre id="response-example"><code>${escapeHtml(responseExample)}</code></pre>
          </article>
        </div>
      </section>`
  })
}

function escapeHtml (value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function sendHtml (ctx, html) {
  ctx.status = 200
  ctx.type = 'html'
  ctx.body = html
}

function sendBrandImage (ctx) {
  ctx.status = 200
  ctx.type = 'png'
  ctx.body = brandImage
}

module.exports = {
  docsPage,
  landingPage,
  sendBrandImage,
  sendHtml
}

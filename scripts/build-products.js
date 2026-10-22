
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const contentDir = path.join(root, "content", "products");
const outputFile = path.join(root, "products.json");
const pagesDir = path.join(root, "products");

function parseValue(value) {
  value = value.trim();

  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null" || value === "~") return null;

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  if (value.startsWith("[") && value.endsWith("]")) {
    const inside = value.slice(1, -1).trim();
    if (!inside) return [];
    return inside.split(",").map(item => parseValue(item));
  }

  return value;
}

function parseProduct(text) {
  const product = {};
  let currentList = null;

  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;

    const listItem = line.match(/^\s+-\s+(.+)$/);

    if (listItem && currentList) {
      product[currentList].push(parseValue(listItem[1]));
      continue;
    }

    const field = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/);
    if (!field) continue;

    const key = field[1];
    const rawValue = field[2] || "";

    if (!rawValue.trim()) {
      product[key] = [];
      currentList = key;
    } else {
      product[key] = parseValue(rawValue);
      currentList = null;
    }
  }

  return product;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function textValue(value) {
  if (Array.isArray(value)) return value.join(", ");
  return value == null ? "" : String(value);
}

function makeDetailPage(product) {
  const title = textValue(product.title) || "Apparel Product";
  const code = textValue(product.product_code) || product.slug;
  const category = String(product.category || "women").toLowerCase();
  const categoryName = category === "men" ? "Menswear" : "Womenswear";

  const fallbackImage = category === "men"
    ? "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80"
    : "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80";

  const image = typeof product.image === "string" && product.image.trim()
    ? product.image.trim()
    : fallbackImage;

  const description = textValue(product.description);
  const fabric = textValue(product.fabric);
  const colors = textValue(product.colors);
  const sizes = textValue(product.sizes);

  const detail = (label, value) => value
    ? `<div class="detail"><strong>${label}</strong><span>${escapeHtml(value)}</span></div>`
    : "";

  const safeTitle = escapeHtml(title);
  const safeImage = escapeHtml(image);
  const inquiryUrl = `/?product=${encodeURIComponent(code)}&title=${encodeURIComponent(title)}#contact`;

const whatsappMessage =
  `Hi, I'm interested in ${title} (Style No. ${code}). ` +
  `I'd like to discuss customization, MOQ and pricing.`;

const whatsappUrl =
  `https://wa.me/8619047726595?text=${encodeURIComponent(whatsappMessage)}`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${escapeHtml(description || title + " - apparel manufacturing product by Yimeiyuan Apparel.")}">
<title>${safeTitle} | Yimeiyuan Apparel</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#f7f7f3;color:#1e2925;font:15px/1.6 Arial,sans-serif}
a{color:inherit;text-decoration:none}.wrap{width:min(1100px,calc(100% - 36px));margin:auto}
header{padding:24px 0;border-bottom:1px solid #dfe4dd}.brand{font:26px Georgia,serif}.sub{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#69736e}
main{padding:42px 0 70px}.back{display:inline-block;margin-bottom:26px;color:#385b4b;font-size:13px}
.layout{display:grid;grid-template-columns:1fr 1fr;gap:46px;align-items:start}
.photo{background:#e5e6df;aspect-ratio:4/5}.photo img{width:100%;height:100%;object-fit:cover}
.tag{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#385b4b;font-weight:bold}
h1{font:clamp(34px,5vw,52px)/1.08 Georgia,serif;letter-spacing:-.04em;margin:12px 0}
.code{color:#69736e;font-size:12px;margin-bottom:22px}
.description{color:#69736e;margin:0 0 25px;white-space:pre-line}
.details{border-top:1px solid #dfe4dd;margin-bottom:28px}
.detail{display:grid;grid-template-columns:120px 1fr;gap:15px;padding:13px 0;border-bottom:1px solid #dfe4dd;font-size:13px}
.detail strong{font-size:11px;text-transform:uppercase;letter-spacing:.06em}
.button{display:inline-block;background:#385b4b;color:white;padding:15px 20px;font-size:12px;font-weight:bold;letter-spacing:.06em;text-transform:uppercase}

.whatsapp-button {
  display: inline-block;
  margin-top: 10px;
  padding: 14px 20px;
  background: #25D366;
  color: #102b1b;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: .04em;
  text-transform: uppercase;
}

.note{font-size:11px;color:#69736e;margin-top:15px}
footer{background:#1e2925;color:#eaf0e9;padding:24px 0;font-size:11px}
@media(max-width:700px){.layout{grid-template-columns:1fr;gap:28px}main{padding-top:25px}.photo{aspect-ratio:4/4}}
</style>
</head>
<body>
<header><div class="wrap"><a class="brand" href="/">Yimeiyuan Apparel</a><div class="sub">Apparel Manufacturing · Guangdong, China</div></div></header>
<main class="wrap">
<a class="back" href="/#products">← Back to Products</a>
<div class="layout">
<div class="photo"><img src="${safeImage}" alt="${safeTitle}" onerror="this.onerror=null;this.src='${fallbackImage}'"></div>
<div>
<div class="tag">${escapeHtml(categoryName)}</div>
<h1>${safeTitle}</h1>
<div class="code">Style No. ${escapeHtml(code)}</div>
${description ? `<p class="description">${escapeHtml(description)}</p>` : ""}
<div class="details">
${detail("Category", categoryName)}
${detail("Fabric", fabric)}
${detail("Colors", colors)}
${detail("Sizes", sizes)}
</div>
<a class="button" href="${inquiryUrl}">Inquire About This Product ↗</a>

<a class="whatsapp-button"
   href="${whatsappUrl}"
   target="_blank"
   rel="noopener noreferrer">
  Inquire on WhatsApp ↗
</a>

<p class="note">Share your target quantity and requirements so we can review your inquiry.</p>
</div>
</div>
</main>
<footer><div class="wrap">© ${new Date().getFullYear()} Yimeiyuan Apparel · OEM / ODM Inquiries</div></footer>
</body>
</html>`;
}

function buildProducts() {
  let products = [];

  if (fs.existsSync(contentDir)) {
    const files = fs.readdirSync(contentDir)
      .filter(file => /\.ya?ml$/i.test(file));

    products = files.map(file => {
      const text = fs.readFileSync(path.join(contentDir, file), "utf8");
      return {
        ...parseProduct(text),
        slug: path.basename(file, path.extname(file))
      };
    });
  }

  products = products.filter(product => product.published !== false);

  fs.writeFileSync(outputFile, JSON.stringify(products, null, 2), "utf8");

  // Rebuild generated product pages from published CMS products.
  fs.rmSync(pagesDir, { recursive: true, force: true });
  fs.mkdirSync(pagesDir, { recursive: true });

  for (const product of products) {
    const slug = String(product.slug || "")
      .replace(/[^a-zA-Z0-9_-]/g, "");

    if (!slug) continue;

    const pageDir = path.join(pagesDir, slug);
    fs.mkdirSync(pageDir, { recursive: true });
    fs.writeFileSync(
      path.join(pageDir, "index.html"),
      makeDetailPage({ ...product, slug }),
      "utf8"
    );
  }

  console.log(
    `Generated products.json and ${products.length} product detail pages.`
  );
}

buildProducts();


const fs = require("fs");
const path = require("path");

const root = process.cwd();
const contentDir = path.join(root, "content", "products");
const outputFile = path.join(root, "products.json");
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
    return inside
      .split(",")
      .map((item) => parseValue(item));
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

function buildProducts() {
  let products = [];

  if (fs.existsSync(contentDir)) {
    const files = fs
      .readdirSync(contentDir)
      .filter((file) => /\.ya?ml$/i.test(file));

    products = files.map((file) => {
      const filePath = path.join(contentDir, file);
      const text = fs.readFileSync(filePath, "utf8");
      return {
        ...parseProduct(text),
        slug: path.basename(file, path.extname(file)),
      };
    });
  }

  products = products.filter(
    (product) => product.published !== false
  );

  fs.writeFileSync(
    outputFile,
    JSON.stringify(products, null, 2),
    "utf8"
  );

  console.log(`Generated products.json with ${products.length} products.`);
}

buildProducts();

Yimeiyuan Apparel CMS starter

IMPORTANT:
- This package does not include or replace your existing root index.html.
- Keep your existing index.html in the GitHub repository root.
- Copy the files/folders from this package into the ROOT of the existing yimeiyuan-website repository, merging folders when asked.
- Do not upload the outer folder itself as a nested folder.

Included:
- wrangler.jsonc: Cloudflare Workers static-assets configuration for this repository layout.
- .assetsignore: excludes deployment config and CMS content files from public static assets.
- admin/index.html: Decap CMS entry page.
- admin/config.yml: Decap Turbo GitHub backend and product collection configuration.
- content/products/: where the CMS will save product records in GitHub.
- images/products/: product image destination.

The package has not been deployed or tested against your live Worker. Before applying it, keep your existing GitHub ZIP backup. After committing these files, check Cloudflare deployment status and test the homepage and /admin/ URL before making further changes.

CMS product records are saved to GitHub. The existing homepage still needs a separate update to read those records before newly added products will automatically appear in the product catalog.

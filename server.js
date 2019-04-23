const express = require('express');
const app = express();
const request = require('request');
const path = require('path');

/* Use app directory */
app.use(express.static(__dirname + '/app'));

/* Shopify credentials from .env variables */
const { parsed } = require('dotenv').config();
const { SHOPIFY_STORE_NAME, SHOPIFY_API_KEY, SHOPIFY_PASSWORD } = parsed;
const SHOPIFY_API_URL = `https://${SHOPIFY_API_KEY}:${SHOPIFY_PASSWORD}@${SHOPIFY_STORE_NAME}.myshopify.com/admin/products.json`;

/* Main page */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* Sends product information from Shopify */
app.get('/products', (req, res) => {
  request(SHOPIFY_API_URL, (error, response, data) => {
    let shopifyData = parseShopifyItems(data);
    res.send(shopifyData);
  });
});

/* Function to parse data from Shopify */
function parseShopifyItems(data) {
  data = JSON.parse(data);
  let items = [];
  data.products.forEach(item => {
    let { title: name, variants, inventory_quantity: quantity, sku, updated_at } = item;

    if (!variants) {
      items.push({ name, variant: null, quantity, sku, updated_at });
    } else {
      variants.forEach(variantItem => {
        let { title: variant, inventory_quantity: quantity, sku, updated_at } = variantItem;
        items.push({ name, variant, quantity, sku, updated_at })
      });
    }
  })
  return items;
}

/* Listen in on port 3000 */
app.listen(3000, () => console.log('Listening in on port 3000'));
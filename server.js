const express = require('express');
const app = express();
const request = require('request');
const path = require('path');

/* Use client directory */
app.use(express.static(__dirname + '/client'));

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
    let shopifyData = parseShopifyJSON(data);
    res.send(shopifyData);
  });
});

/* Function to parse data from Shopify */
function parseShopifyJSON(data) {

  data = JSON.parse(data);
  let items = [];

  data.products.forEach(item => {
    let { title, variants, inventory_quantity, sku, created_at, updated_at, price = null } = item;

    if (!variants) {
      items.push({ description: title, title, variant: null, quantity: inventory_quantity, sku, created_at, updated_at, price });
    } else {
      variants.forEach(variantItem => {
        
        let { title: variant, inventory_quantity, sku, created_at, updated_at, price } = variantItem;
        let description = `${title} (${variant})`;

        items.push({ description, title, variant, quantity: inventory_quantity, sku, created_at, updated_at, price });
      });
    }
  })

  return items;
}

/* Listen in on port 3000 */
app.listen(3000, () => console.log('Listening in on port 3000'));
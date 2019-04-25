const express = require('express');
const app = express();
const request = require('request');
const path = require('path');
const port = 3000;

/* Use client directory */
app.use(express.static(__dirname + '/client'));

/* Shopify credentials from .env variables */
const { parsed = {} } = require('dotenv').config();
const { SHOPIFY_STORE_NAME, SHOPIFY_API_KEY, SHOPIFY_PASSWORD } = parsed;
const SHOPIFY_API_URL = `https://${SHOPIFY_API_KEY}:${SHOPIFY_PASSWORD}@${SHOPIFY_STORE_NAME}.myshopify.com/admin`;

/* Main page */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/views/index.html'));
});

/* Sends product information from Shopify */
app.get('/products', (req, res) => {
  request(`${SHOPIFY_API_URL}/products.json`, (error, response, data) => {
    let shopifyData = parseShopifyJSON(data);
    res.send(shopifyData);
  });
});

app.delete('/products', (req, res) => {
  let { id, product_id } = req.query;
  request.delete(`${SHOPIFY_API_URL}/api/products/#{${product_id}}.json`, (error, response, data) => {
    if (error) {
      console.error(error)
    } else {
      res.send('Success deleting item!');
    } 
  });
});


/* Function to parse data from Shopify */
function parseShopifyJSON(data) {
  data = JSON.parse(data);
  let items = [];

  data.products.forEach(item => {
    let { title, variants } = item;
    variants.forEach(variantItem => {
      
      let { id, product_id, title: variant, inventory_quantity, sku, created_at, updated_at, price } = variantItem;
      let hasVariants = variant === 'Default Title' ? false : true;
      if(!hasVariants) variant = null;

      let description = hasVariants ? `${title} (${variant})` : title;

      items.push({ id, product_id, description, title, variant, quantity: inventory_quantity, sku, created_at, updated_at, price });
    });
  })

  return items;
}

/* Listen in on port 3000 */
app.listen(port, () => console.log(`Listening in on port ${3000}`));

/* For testing */
module.exports = { app, port, SHOPIFY_API_URL }
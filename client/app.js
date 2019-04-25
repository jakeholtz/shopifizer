/* Set up App module */
angular.module('StitchFront',[])
       .controller('MainController', mainController);

/* Main Controller */
function mainController($http) {

  const ctrl = this;

  ctrl.products = [];
  ctrl.filteredProducts = [];
  ctrl.filters = {};
  ctrl.deleteMode = false;
  ctrl.obscureContent = false;

  ctrl.$onInit = () => {
    $http.get('/products', { cache: true })
      .then((res) => initiateProducts(res.data))
      .catch(err => console.error(err));
  };

  ctrl.filterProducts = () => {
    ctrl.filteredProducts = ctrl.products.filter((product) => {
      let { title, variant = '', created_at } = product;
      let { searchString, startDate, endDate } = ctrl.filters;
      let productString = (`${title} ${variant}`).toLowerCase();

      let hasString = searchString ? productString.includes(searchString) : true;
      let greaterThanStart = startDate ? formatDate(created_at) >= formatDate(startDate) : true;
      let lessThanEnd = endDate ? formatDate(created_at) <= formatDate(endDate) : true;

      return hasString && greaterThanStart && lessThanEnd;
    });
  }

  ctrl.toggleDeleteMode = () => {
    ctrl.deleteMode = !ctrl.deleteMode;
  }

  ctrl.deleteProduct = (index) => {
    let { id, product_id }  = ctrl.filteredProducts[index];
    ctrl.products = ctrl.products.filter((item) => item.id !== id);
    ctrl.filteredProducts = ctrl.filteredProducts.filter((item) => item.id !== id); 
      $http.delete('/products', { params: { id, product_id }} )
       .then((res) => console.log(res))
       .catch(err => console.error(err));
  }

  ctrl.openModal = () => {
    ctrl.obscureContent = true;
    ctrl.newItem = {};
  }

  ctrl.addNewProduct = () => {
    let { title, sku, quantity, price } = ctrl.newItem;
    if (!title || !sku || !quantity || !price) return (ctrl.obscureContent = false);

    let created_at = new Date();

    ctrl.products.push({ description: title, title, variant: null, quantity, sku, created_at, updated_at: created_at, price });
    ctrl.filterProducts = ctrl.products;
    
    ctrl.obscureContent = false;
  }

  function initiateProducts(products) {
    ctrl.products = products;
    ctrl.filteredProducts = products;
  }

  function formatDate(date) {
    if (!(date instanceof Date)) date = new Date(date);
    return date.setHours(0,0,0,0).valueOf();
  }
};
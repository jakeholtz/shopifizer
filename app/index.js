const stitchFront = angular.module('StitchFront',[]);

stitchFront.controller('MainController', mainController);

function mainController($http) {

  const ctrl = this;

  ctrl.products = [];
  ctrl.filteredProducts = [];
  ctrl.filters = {};

  ctrl.$onInit = () => {
    $http.get('/products', { cache: true })
      .then((res) => initiateProducts(res.data))
      .catch(err => console.error(err));
  };

  ctrl.filterProducts = () => {
    ctrl.filteredProducts = ctrl.products.filter((product) => {
      let { name, updated_at, variant = '' } = product;
      let { searchString, startDate, endDate } = ctrl.filters;
      let productString = (`${name} ${variant}`).toLowerCase();

      let hasString = searchString ? productString.includes(searchString) : true;
      let greaterThanStart = startDate ? sanitizeDate(updated_at) >= sanitizeDate(startDate) : true;
      let lessThanEnd = endDate ? sanitizeDate(updated_at) <= sanitizeDate(endDate) : true;

      return hasString && greaterThanStart && lessThanEnd;
    });
  }

  function initiateProducts(products) {
    ctrl.products = products;
    ctrl.filteredProducts = products;
  }

  function sanitizeDate(date) {
    if (!(date instanceof Date)) date = new Date(date);
    return date.setHours(0,0,0,0).valueOf();
  }
};
var app = angular.module("inventoryApp", []);

app.controller("InventoryController", function($scope, $http) {

  var API_URL = "http://localhost:5000/api/products";

  $scope.products = [];

  // ---------- Load products from MongoDB ----------
function loadProducts() {
  $http.get(API_URL).then(function(response) {
    $scope.products = response.data;
    $scope.connectionError = false;
  }).catch(function(err) {
    $scope.connectionError = true;
    console.error("Failed to load products:", err);
  });
}
  loadProducts();

  // ============================================================
  // MEMBER 1 SECTION — Product Management + Dashboard
  // ============================================================
  $scope.newProduct = {};

  $scope.addProduct = function() {
   if (!$scope.newProduct.maxStock) {
  $scope.newProduct.maxStock = $scope.newProduct.quantity * 2;
}
    $http.post(API_URL, $scope.newProduct).then(function() {
      $scope.newProduct = {};
      loadProducts();
    });
  };

  $scope.deleteProduct = function(product) {
    $http.delete(API_URL + "/" + product._id).then(function() {
      loadProducts();
    });
  };

  $scope.getTotalStock = function() {
    var total = 0;
    angular.forEach($scope.products, function(p) { total += p.quantity; });
    return total;
  };

  // ============================================================
  // MEMBER 2 SECTION (YOU) — Stock Management + Alerts + Reports
  // ============================================================

  $scope.addStock = function(product, quantity) {
    if (product && quantity > 0) {
      var updatedQty = product.quantity + Number(quantity);
      $http.put(API_URL + "/" + product._id, { quantity: updatedQty }).then(function() {
        $scope.stockQty = null;
        loadProducts();
      });
    }
  };

  $scope.removeStock = function(product, quantity) {
    if (product && quantity > 0) {
      if (product.quantity >= quantity) {
        var updatedQty = product.quantity - Number(quantity);
        $http.put(API_URL + "/" + product._id, { quantity: updatedQty }).then(function() {
          $scope.stockQty = null;
          loadProducts();
        });
      } else {
        alert("Not enough stock to remove!");
      }
    }
  };

  $scope.getLowStockCount = function() {
    var count = 0;
    angular.forEach($scope.products, function(p) {
      if (p.quantity > 0 && p.quantity <= p.minStock) count++;
    });
    return count;
  };

  $scope.getOutOfStockCount = function() {
    var count = 0;
    angular.forEach($scope.products, function(p) {
      if (p.quantity === 0) count++;
    });
    return count;
  };

  $scope.getAvailableCount = function() {
    return $scope.products.length - $scope.getLowStockCount() - $scope.getOutOfStockCount();
  };

  $scope.getReorderQty = function(product) {
    return product.maxStock - product.quantity;
  };

  $scope.getCategorySummary = function() {
    var summary = {};
    angular.forEach($scope.products, function(p) {
      if (!summary[p.category]) {
        summary[p.category] = { name: p.category, count: 0, stock: 0 };
      }
      summary[p.category].count++;
      summary[p.category].stock += p.quantity;
    });
    return Object.values(summary);
  };

});
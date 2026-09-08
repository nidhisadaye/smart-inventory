app.service("inventoryService", function($http) {

    this.getProducts = function() {
        return $http.get("http://localhost:5000/api/products");
    };

    this.addProduct = function(product) {
        return $http.post("http://localhost:5000/api/products", product);
    };

    this.updateProduct = function(id, product) {
        return $http.put(
            "http://localhost:5000/api/products/" + id,
            product
        );
    };

    this.deleteProduct = function(id) {
        return $http.delete(
            "http://localhost:5000/api/products/" + id
        );
    };

});
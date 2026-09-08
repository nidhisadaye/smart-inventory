app.controller("ProductController", ["$scope", "inventoryService", function($scope, inventoryService) {

    $scope.products = [];

    $scope.newProduct = {
        name: "",
        category: "",
        price: null,
        quantity: null,
        minStock: 5,
        maxStock: 100
    };

    $scope.editingProduct = null;

    $scope.getTotalQuantity = function() {
        return $scope.products.reduce(function(total, product) {
            return total + Number(product.quantity || 0);
        }, 0);
    };

    $scope.getInventoryValue = function() {
    var total = $scope.products.reduce(function(sum, product) {
        return sum + (Number(product.price || 0) * Number(product.quantity || 0));
    }, 0);

    return total.toLocaleString("en-IN");
    };

    $scope.getLowStockCount = function() {
        return $scope.products.filter(function(product) {
            return Number(product.quantity || 0) <= Number(product.minStock || 0);
        }).length;
    };
    $scope.searchProducts = function() {
    $scope.searchText = ($scope.searchText || "").trim();
    };

    $scope.getCategories = function() {
    var categories = [];

    $scope.products.forEach(function(product) {
        if (product.category && categories.indexOf(product.category) === -1) {
            categories.push(product.category);
        }
    });

    return categories.sort();
    };

    $scope.loadProducts = function() {
        inventoryService.getProducts()
            .then(function(response) {
                $scope.products = response.data;
            })
            .catch(function(error) {
                console.error("Failed to load products:", error);
            });
    };

    $scope.addProduct = function() {

        var product = {
            name: $scope.newProduct.name,
            category: $scope.newProduct.category,
            price: Number($scope.newProduct.price),
            quantity: Number($scope.newProduct.quantity),
            minStock: Number($scope.newProduct.minStock),
            maxStock: Number($scope.newProduct.maxStock)
        };

        inventoryService.addProduct(product)
            .then(function(response) {

                $scope.products.push(response.data);

                $scope.newProduct = {
                    name: "",
                    category: "",
                    price: null,
                    quantity: null,
                    minStock: 5,
                    maxStock: 100
                };

                if ($scope.productForm) {
                    $scope.productForm.$setPristine();
                    $scope.productForm.$setUntouched();
                }

            })
            .catch(function(error) {
                console.error("Failed to add product:", error);
                window.alert("Failed to add product.");
            });
    };

    // Open professional edit modal
    $scope.editProduct = function(product) {

        $scope.editingProduct = {
            _id: product._id,
            name: product.name,
            category: product.category,
            price: Number(product.price),
            quantity: Number(product.quantity),
            minStock: Number(product.minStock),
            maxStock: Number(product.maxStock)
        };

        $scope.editModalOpen = true;
    };

    // Close edit modal
    $scope.closeEditModal = function() {
        $scope.editModalOpen = false;
        $scope.editingProduct = null;
    };

    // Save edited product
    $scope.saveEditedProduct = function() {

        if (!$scope.editingProduct) {
            return;
        }

        var updatedProduct = {
            name: $scope.editingProduct.name,
            category: $scope.editingProduct.category,
            price: Number($scope.editingProduct.price),
            quantity: Number($scope.editingProduct.quantity),
            minStock: Number($scope.editingProduct.minStock),
            maxStock: Number($scope.editingProduct.maxStock)
        };

        if (
            !updatedProduct.name ||
            !updatedProduct.category ||
            isNaN(updatedProduct.price) ||
            updatedProduct.price < 0 ||
            isNaN(updatedProduct.quantity) ||
            updatedProduct.quantity < 0 ||
            isNaN(updatedProduct.minStock) ||
            updatedProduct.minStock < 0 ||
            isNaN(updatedProduct.maxStock) ||
            updatedProduct.maxStock < 0
        ) {
            window.alert("Please enter valid product details.");
            return;
        }

        if (updatedProduct.minStock > updatedProduct.maxStock) {
            window.alert("Minimum stock cannot be greater than maximum stock.");
            return;
        }

        inventoryService.updateProduct(
            $scope.editingProduct._id,
            updatedProduct
        )
        .then(function(response) {

            var index = $scope.products.findIndex(function(product) {
                return product._id === $scope.editingProduct._id;
            });

            if (index !== -1) {
                $scope.products[index] = response.data;
            }

            $scope.closeEditModal();

        })
        .catch(function(error) {
            console.error("Update failed:", error);
            window.alert("Failed to update product.");
        });
    };

    $scope.deleteProduct = function(product) {

        if (!confirm("Are you sure you want to delete " + product.name + "?")) {
            return;
        }

        inventoryService.deleteProduct(product._id)
            .then(function() {

                var index = $scope.products.indexOf(product);

                if (index !== -1) {
                    $scope.products.splice(index, 1);
                }

            })
            .catch(function(error) {
                console.error("Failed to delete product:", error);
                alert("Failed to delete product.");
            });
    };

    $scope.loadProducts();

}]);
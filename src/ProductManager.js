const fs = require('fs');

class ProductManager {
        constructor(filePath) {
            this.path = filePath;
            this.products = this.loadProducts();
    
            if (this.products.length === 0) {
                this.createSampleProducts();
                this.saveProducts();
            }
        }
    
        generateId() {
            return '_' + Math.random().toString(36).substr(2, 9);
        }
    
        loadProducts() {
            try {
                if (!fs.existsSync(this.path)) {
                    this.saveProducts([]);
                    return [];
                }
    
                const data = fs.readFileSync(this.path, 'utf8');
                return JSON.parse(data);
            } catch (error) {
                return [];
            }
        }
    
        saveProducts(products) {
            const data = JSON.stringify(products, null, 2);
            fs.writeFileSync(this.path, data, 'utf8');
        }
    
        createSampleProducts() {
            const sampleProducts = [
                {
                    title: 'Producto 1',
                    description: 'Descripción del Producto 1',
                    price: 19.99,
                    thumbnail: 'producto1.jpg',
                    code: 'P001',
                    stock: 50
                },
                {
                    title: 'Producto 2',
                    description: 'Descripción del Producto 2',
                    price: 29.99,
                    thumbnail: 'producto2.jpg',
                    code: 'P002',
                    stock: 40
                },
            ];
    
            this.products = [...this.products, ...sampleProducts];
        }

    getProducts(limit) {
        try {
            const allProducts = this.products;
            if (limit) {
                return allProducts.slice(0, limit);
            }
            return allProducts;
        } catch (error) {
            throw new Error('Error al obtener productos.');
        }
    }

    addProduct({ title, description, price, thumbnail, code, stock }) {
        const newProduct = {
            id: this.generateId(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        this.products.push(newProduct);
        this.saveProducts();
        return newProduct;
    }
    getProductById(productId) {
        const product = this.products.find(product => product.id === productId);
        if (!product) {
            throw new Error('Producto no encontrado.');
        }
        return product;
    }

    updateProduct(productId, updatedFields) {
        const index = this.products.findIndex(product => product.id === productId);
        if (index === -1) {
            throw new Error('Producto no encontrado.');
        }

        this.products[index] = { ...this.products[index], ...updatedFields };
        this.saveProducts();
        return this.products[index];
    }

    deleteProduct(productId) {
        const index = this.products.findIndex(product => product.id === productId);
        if (index === -1) {
            throw new Error('Producto no encontrado.');
        }

        this.products.splice(index, 1);
        this.saveProducts();
    }
}

module.exports = ProductManager;

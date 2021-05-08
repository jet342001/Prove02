const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'books.json'
)
const getBooksFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            return cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
}


module.exports = class Book {
    constructor(id, title, imageUrl, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    save() {
        getBooksFromFile(books => {
            if (this.id) {
                const existingBookIndex = books.findIndex(prod => prod.id === this.id);
                const updatedBooks = [...books];
                updatedBooks[existingBookIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedBook), (err) => {
                    console.log(err);
                });
            } else {
                this.id = Math.random().toString();
                console.log(books)
                books.push(this);
                fs.writeFile(p, JSON.stringify(books), (err) => {
                    console.log(err);
                });
            }
        });
    }

    static deleteById(id) {
        getBooksFromFile(books => {
            const product = books.find(prod => prod.id === id);
            const updatedBooks = books.filter(prod => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedbooks), err => {
                if (!err) {
                    //Cart.deleteProduct(id, product.price);
                    console.log("l");
                }
            });
        });
    }

    static fetchAll(cb) {
        getBooksFromFile(cb);
    }

    static findById(id, cb) {
        getBooksFromFile(books => {
            const product = books.find(p => p.id === id);
            cb(product);
        });
    }
}
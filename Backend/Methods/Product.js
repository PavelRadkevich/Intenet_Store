async function GetAllProducts(db) {
    try {
        const products = await db('Product').select('*');
        return products;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

async function GetProductById(db, id_) {
    try {
        const product = await db('Product').select('*').where({id: id_})
        return product;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

async function AddProduct(db, name, description, unitPrice, unitWeight, categoryId) {
    try {
        await db('Product').insert({
            name: name,
            description: description,
            unitPrice: unitPrice,
            unitWeight: unitWeight,
            categoryId: categoryId
        }).returning('ID').then(async function(ID) {
            const newProduct = await db('Product').where({id: ID[0].ID});
            return newProduct;
        });
    } catch(error) {
        console.error(error);
        throw new Error(error);
    }
}

async function EditProduct (db, id, parametres) {
    try {
        await db('Product').where({id: id}).update(parametres);

        const updatedProduct = await db('Product').where({id: id}).first();
        return updatedProduct
    } catch(error) {
        console.error(error);
        throw new Error(error);
    }
}

module.exports = {GetAllProducts, GetProductById, AddProduct, EditProduct};
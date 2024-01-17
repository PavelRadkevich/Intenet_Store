async function GetAllCategories(db) {
    try {
        const categories = await db('Category').select('*');
        return categories;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

async function GetCategoryById(db, id) {
    try {
        const product = await db('Category').select('*').where({ id })
        return product;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

module.exports = {GetAllCategories, GetCategoryById};
async function GetAllOrderStatus(db) {
    try {
        const status = await db('OrderStatus').select('*');
        return status;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

module.exports = {GetAllOrderStatus};
async function AddOrderItem(db, orderId, productId, quantity) {
    try {
        await db('OrderItem').insert({
            orderId: orderId,
            productId: productId,
            quantity: quantity,
        }).returning('ID').then(async function(ID) {
            const newProduct = await db('OrderItem').where({id: ID[0].ID});
            return newProduct;
        });
    } catch(error) {
        console.error(error);
        throw new Error(error);
    }
}

async function GetOrderItemById(db, id) {
    try {
        const orderItem = await db('OrderItem').select('*').where({ id })
        return orderItem;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

async function EditOrderItem(db, id, orderId, productId, quantity) {
    try {
        const orderItem = await db('Order_').where({ id }).first();

        if (orderItem.ProductId != productId) {
            return 'You cannot change the product ID in an existing orderItem.';
        }
    
        if (orderItem.OrderId != orderId) {
            return 'You cannot change the order ID in an existing orderItem.';
        }

        if (quantity == 0 || quantity < 0) {
            return 'You cannot add an item with a negative or zero quantity';
          }

        await db('OrderItem').where({ id }).update({ 
            quantity: quantity, 
          });

        const newOrderItem = await db('OrderItem').where({ id }).first();
        return newOrderItem;
    } catch(error) {
        console.error(error);
        throw new Error(error);
    }
    
}

module.exports = {AddOrderItem, GetOrderItemById, EditOrderItem};
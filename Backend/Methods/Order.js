const { applyPatch, applyReducer } = require('fast-json-patch');

async function GetAllOrders(db) {
    try {
        const products = await db('Order_').select('*');
        return products;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

async function GetOrderById(db, id) {
    try {
        const product = await db('Order_').select('*').where({ id })
        return product;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

async function AddOrder(db, approvalDate, orderStatusId, userName, email, phoneNumber) {
    let newOrder = '';
    try {
        await db('Order_').insert({
            approvalDate: approvalDate,
            orderStatusId: orderStatusId,
            userName: userName,
            email: email,
            phoneNumber: phoneNumber,
        }).returning('ID').then(async function(ID) {
            newOrder = await db('Order_').where({id: ID[0].ID});
        });
    } catch(error) {
        console.error(error);
        throw new Error(error);
    }
    return newOrder[0];
}

async function EditOrder(db, id, patchOperations) {
    try {
        const order = await db('Order_').where({ id }).first();

        const clonedOrder = JSON.parse(JSON.stringify(order));

        patchOperations.reduce(applyReducer, clonedOrder);
        
        if (!(typeof(clonedOrder.UserName) === 'string' && clonedOrder.UserName.match(/^[a-z]+$/i))) {
            return 'Username can only contain letters';
        }
    
        if (!clonedOrder.Email.includes("@")) {
            return 'Invalid email (Correct example: \'aji@gmail.com\'';
        }
    
        const pattern = /^[0-9\s+]+$/;
        if(!pattern.test(clonedOrder.PhoneNumber)) {
            return 'Invalid phone number (Correct example: \'+48 111 111 111\'';
        }

        const actualStatus = await db('Order_').select('OrderStatusId').where({ id });
        if(actualStatus[0].OrderStatusId == 3 && clonedOrder.OrderStatusId != 3) {
            return 'You cannot change the status of a canceled order';
        }

        if(clonedOrder.OrderStatusId < actualStatus[0].OrderStatusId) {
            return 'You cannot change the order status to the \'previous one\'';
        }

        await db('Order_').where({ id }).update({ 
            ApprovalDate: clonedOrder.ApprovalDate, 
            OrderStatusId: clonedOrder.OrderStatusId, 
            UserName: clonedOrder.UserName,
            Email: clonedOrder.Email,
            PhoneNumber: clonedOrder.PhoneNumber
          });
        return clonedOrder;
    } catch(error) {
        console.error(error);
        throw new Error(error);
    }
    
}

async function GetOrderByStatus(db, id) {
    try {
        const order = await db('Order_').select('*').where({ OrderStatusId: id })
        return order;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

async function GetOrderOrderItems(db, id) {
    try {
        const orderItems = await db('OrderItem').select('*').where({OrderId: id});
        return orderItems;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}
module.exports = {GetAllOrders, GetOrderById, AddOrder, EditOrder, GetOrderByStatus, GetOrderOrderItems};
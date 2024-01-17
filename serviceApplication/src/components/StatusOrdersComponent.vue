<template>
    <div class="fontSize container justify-content-center ">
        <h1>Zamówienia według statusów</h1>
        <table striped hover :items="orders" class="mt-3 table-bordered" responsive style="color: whitesmoke;">
            <thead>
                <tr>
                    <th>Status zamówienia</th>
                    <th>Id zamówienia</th>
                    <th>Data zatwierdzenia</th>
                </tr>
            </thead>
            <tbody >
                <tr v-for="(order) in orders" :key="order.id">
                    <td>
                        {{ statuses[order.OrderStatusId - 1] }}
                    </td>
                    <td class="col-md-1">
                            {{order.Id}} 
                    </td>
                    <td>
                        {{ order.ApprovalDate }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

export default {
    props: {
        orders: [],
    },

    data() {
        return {
            orderItems: [],

            statuses: [
                'Not Approved', 'Approved', 'Cancelled', 'Completed'
            ]         
        }
    },
}

</script>
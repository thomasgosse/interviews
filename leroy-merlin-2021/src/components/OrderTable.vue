<template>
  <table>
    <thead>
      <tr>
        <th v-for="header in headers" :key="header">
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, i) in items" :key="item.id" :data-cy="`row-${i + 1}`">
        <td>{{ item.id }}</td>
        <td>{{ item.customerId }}</td>
        <td>{{ formatBasket(item.basket) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Order, Item } from "@/types";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "OrderTable",
  props: {
    headers: Array as PropType<string[]>,
    items: Array as PropType<Order[]>
  },
  methods: {
    formatBasket(basket: Item[]): string {
      // First we reduce the array to group quantities by same item id
      const unique = basket.reduce((acc: any, val: Item) => {
        if (acc[val.productId]) {
          acc[val.productId] += val.quantity;
        } else {
          acc[val.productId] = val.quantity;
        }
        return acc;
      }, {});
      // Then we create a string for each key and quantity, and join the array to get the basket formatted
      return Object.keys(unique)
        .map(key => `${key}: ${unique[key]}`)
        .join(", ");
    }
  }
});
</script>

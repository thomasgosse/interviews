<template>
  <table>
    <thead>
      <tr>
        <th>Products</th>
        <th v-for="store in stores" :key="store">
          {{ store }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(productStock, i) in getProductStocks()"
        :key="productStock.id"
        :data-cy="`row-${i + 1}`"
      >
        <td>{{ productStock.id }}</td>
        <td v-for="stock in productStock.stocksByStore" :key="stock">
          {{ stock }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Store } from "@/types";
import { defineComponent, PropType } from "vue";

type Product = {
  storeId: string;
  productId: string;
  quantity: number;
};

type ProductStock = {
  id: string;
  stocksByStore: number[];
};

export default defineComponent({
  name: "StockTable",
  props: {
    items: {
      type: Array as PropType<Store[]>,
      required: true
    }
  },
  data() {
    return {
      dataItems: this.items
    };
  },
  computed: {
    stores(): string[] {
      return this.dataItems.map(item => item.id);
    },
    products(): Product[] {
      return this.dataItems.flatMap(item =>
        item.stock.map(s => ({ ...s, storeId: item.id }))
      );
    },
    uniqueProductNames(): string[] {
      const productNames = this.dataItems.flatMap(item =>
        item.stock.map(s => s.productId)
      );
      return Array.from(new Set(productNames));
    }
  },
  methods: {
    getProductStocks(): ProductStock[] {
      const productStocks: ProductStock[] = [];

      this.uniqueProductNames.forEach(product => {
        const stocks: number[] = [];
        this.stores.forEach(store => {
          const findProduct = this.products.find(
            (it: any) => it.productId == product && it.storeId == store
          );
          stocks.push(findProduct ? findProduct.quantity : 0);
        });
        productStocks.push({ id: product, stocksByStore: stocks });
      });

      return productStocks;
    }
  }
});
</script>

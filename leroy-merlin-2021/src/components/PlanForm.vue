<template>
  <form @submit="submit">
    <label>Pick an order</label>
    <select
      v-model="selectedOrder"
      @change="resetAll"
      required
      data-cy="sOrder"
    >
      <option disabled value="_">Pick an order</option>
      <option
        v-for="order in orders"
        :key="order.id"
        :value="{ id: order.id, customerId: order.customerId }"
      >
        {{ order.id }} (for {{ order.customerId }})
      </option>
    </select>

    <label>Select an item from the order</label>
    <select
      v-model="selectedItem"
      :disabled="!selectedOrder.id"
      @change="resetStoreDrone"
      required
      data-cy="sItem"
    >
      <option disabled value="_">Product from {{ selectedOrder.id }}</option>
      <option
        v-for="item in getBasketItems(selectedOrder.id)"
        :key="item.productId"
        :value="item.productId"
        :disabled="item.quantity === 0"
      >
        {{ item.productId }} (left in order: {{ item.quantity }})
      </option>
    </select>

    <label>Chose a store</label>
    <select
      v-model="selectedStore"
      :disabled="!selectedItem"
      @change="resetDrone"
      required
      data-cy="sStore"
    >
      <option disabled value="_">Pick a store</option>
      <option
        v-for="stock in stores"
        :key="stock.id"
        :value="stock.id"
        :disabled="!hasProductInStock(stock)"
      >
        {{ stock.id }}
        {{ hasProductInStock(stock) ? "" : "- no more stock" }}
      </option>
    </select>

    <label>Chose the delivery drone</label>
    <select
      v-model="selectedDrone"
      :disabled="!selectedStore"
      required
      data-cy="sDrone"
    >
      <option disabled value="_">Pick the delivery drone</option>
      <option
        v-for="drone in drones"
        :key="drone.id"
        :value="{ id: drone.id, energyCost: getEnergyCost(drone) }"
        :disabled="!isDroneAvailable(drone)"
        required
      >
        {{ drone.id }}
        {{
          isDroneAvailable(drone)
            ? `- use ${getEnergyCost(drone).toFixed(2)}% of battery`
            : "- not enough autonomy"
        }}
      </option>
    </select>

    <p v-if="selectedItem && selectedStore && selectedDrone.id">
      You're about to deliver <b>1x {{ selectedItem }}</b
      >, from <b>{{ selectedStore }}</b> store, using
      <b>drone {{ selectedDrone.id }}</b>
    </p>
    <p v-if="selectedDrone.energyCost && selectedDrone.id">
      This action will use
      <b
        >{{ selectedDrone.energyCost.toFixed(2) }}% of {{ selectedDrone.id }}'s
        autonomy</b
      >
    </p>
    <button type="submit">Create</button>
    <span class="error">{{ errorMessage }}</span>
  </form>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { State } from "@/store/index";
import { Drone, Store, Item, Plan, Order } from "@/types";
import { getTotalDistance } from "@/services/distance-service";

const MAX_DRONE_CAPACITY = 100;

export default defineComponent({
  name: "PlanForm",
  props: {
    closeModal: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      selectedOrder: { id: "", customerId: "" },
      selectedItem: "",
      selectedDrone: { id: "", energyCost: 0 },
      selectedStore: "",
      errorMessage: ""
    };
  },
  computed: {
    draftPlan(): Plan {
      return {
        productId: this.selectedItem,
        customerId: this.selectedOrder.customerId,
        drone: this.selectedDrone.id,
        store: this.selectedStore
      };
    }
  },
  setup() {
    const store = useStore<State>();
    const drones = computed(() => store.state.drones);
    const orders = computed(
      () => store.getters.ordersEmptyItemFiltered as Order[]
    );
    const customers = computed(() => store.state.customers);
    const stores = computed(() => store.state.stores);
    const createPlan = (draftPlan: Plan, orderId: string, energyCost: number) =>
      store.dispatch("createPlan", { draftPlan, orderId, energyCost });

    return { drones, orders, customers, stores, createPlan };
  },
  methods: {
    async submit(e: Event) {
      e.preventDefault();
      this.errorMessage = "";
      try {
        this.createPlan(
          this.draftPlan,
          this.selectedOrder.id,
          this.selectedDrone.energyCost
        );
        this.closeModal();
      } catch (e) {
        this.errorMessage = "An error occured: " + e.message;
      }
    },
    resetAll() {
      this.selectedItem = "";
      this.resetStoreDrone();
    },
    resetStoreDrone() {
      this.selectedStore = "";
      this.resetDrone();
    },
    resetDrone() {
      this.selectedDrone = { id: "", energyCost: 0 };
      this.errorMessage = "";
    },
    getBasketItems(orderId: string): Item[] {
      const order = this.orders.find(order => order.id === orderId);
      return order ? order.basket : [];
    },
    hasProductInStock(store: Store): boolean {
      const product = store.stock.find(s => s.productId == this.selectedItem);
      return product ? product.quantity >= 1 : false;
    },
    isDroneAvailable(drone: Drone) {
      return drone.autonomy - this.getEnergyCost(drone) >= 0;
    },
    getEnergyCost(drone: Drone): number {
      const customer = this.customers.find(
        c => c.id === this.selectedOrder.customerId
      );
      const store = this.stores.find(s => s.id === this.selectedStore);
      if (!customer || !store) return MAX_DRONE_CAPACITY;

      return getTotalDistance(drone, store, customer);
    }
  }
});
</script>

<style lang="scss" scoped>
form {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 400px;

  button[type="submit"] {
    margin-top: 15px;
  }

  select {
    -moz-appearance: none;
    -webkit-appearance: none;
    width: 100%;
    padding: 10px;
    border-radius: var(--default-radius);
    background: var(--background);
    border-width: 2px;
    margin-bottom: 15px;

    background: url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0Ljk1IDEwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9LmNscy0ye2ZpbGw6IzQ0NDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmFycm93czwvdGl0bGU+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iNC45NSIgaGVpZ2h0PSIxMCIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIxLjQxIDQuNjcgMi40OCAzLjE4IDMuNTQgNC42NyAxLjQxIDQuNjciLz48cG9seWdvbiBjbGFzcz0iY2xzLTIiIHBvaW50cz0iMy41NCA1LjMzIDIuNDggNi44MiAxLjQxIDUuMzMgMy41NCA1LjMzIi8+PC9zdmc+)
      no-repeat 95% 50%;

    &:enabled {
      border-color: var(--secondary);
    }
  }

  label {
    font-weight: 400;
    margin-bottom: 5px;
    font-size: 15px;
  }

  .error {
    margin-top: 5px;
    text-align: center;
    font-weight: 500;
    color: red;
  }
}

@media screen and (max-width: 600px) {
  form {
    width: 100%;
  }
}
</style>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="header in headers" :key="header">
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody v-if="plans.length === 0">
      <tr class="empty-table">
        <td colspan="4">
          <span class="empty-table__content">
            <p class="empty-table__content--title">
              There are no flight plans for now...
            </p>
            <button @click="openModal" data-cy="openModalBtn">
              Create one
            </button>
            <img
              class="empty-table__image"
              src="../assets/undraw-drone-delivery.svg"
              width="400"
              height="400"
              alt="Drone delivering item to a customer"
            />
          </span>
        </td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr>
        <td>
          <button @click="openModal">+ Add plan</button>
        </td>
        <td></td>
        <td></td>
        <td class="controls__delete">
          <button @click="reset" class="controls__delete--btn">
            Reset all
          </button>
        </td>
      </tr>
      <tr
        v-for="(plan, i) in plans"
        :key="plan.customerId + plan.productId + plan.drone.autonomy"
        :data-cy="`row-${i + 1}`"
      >
        <td>{{ plan.drone }}</td>
        <td>{{ plan.store }}</td>
        <td>{{ plan.productId }}</td>
        <td>{{ plan.customerId }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Plan } from "@/types";
import { defineComponent, PropType } from "vue";
import { deleteAll } from "@/services/local-storage";

export default defineComponent({
  name: "PlanTable",
  props: {
    plans: {
      type: Array as PropType<Plan[]>,
      required: true
    },
    openModal: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      headers: ["Drones", "Stores", "Produts", "Customers"]
    };
  },
  methods: {
    reset() {
      deleteAll();
    }
  }
});
</script>

<style lang="scss" scoped>
.empty-table {
  text-align: center;

  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    &--title {
      font-weight: 600;
      font-size: 22px;
    }
  }

  &__image {
    max-width: 100%;
    max-height: 400px;
  }
}

.controls__delete {
  display: flex;
  justify-content: flex-end;

  &--btn {
    border-color: red;
    color: red;
  }

  &--btn:hover,
  &--btn:active,
  &--btn:focus {
    background-color: rgb(230, 139, 139);
  }
}
</style>

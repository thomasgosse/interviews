import { createStore, Store as VueStore } from "vuex";
import { Customer, Drone, Order, Store, Plan } from "@/types";
import actions from "./actions";

export interface State {
  orders: Order[];
  stores: Store[];
  customers: Customer[];
  drones: Drone[];
  plans: Plan[];
}

export const store = createStore<State>({
  state: {
    orders: [],
    stores: [],
    customers: [],
    drones: [],
    plans: []
  },
  actions,
  getters: {
    ordersEmptyItemFiltered(state): Order[] {
      return state.orders
        .map(order => ({
          customerId: order.customerId,
          id: order.id,
          basket: order.basket.filter(item => item.quantity > 0)
        }))
        .filter(order => order.basket.length > 0);
    }
  }
});

export function useStore() {
  return store as VueStore<State>;
}

import { getItem, storeAll } from "@/services/local-storage";
import { Customer, Drone, Order, Store, Plan } from "@/types";
import { State } from "./index";

type AState = { state: State };

function findIndex(items: any[], key: any, toFind: string) {
  const indexOrder = items.findIndex(item => item[key] === toFind);
  if (indexOrder === -1) {
    throw new Error(`${toFind} could not be found`);
  } else {
    return indexOrder;
  }
}

export default {
  fetchOrders({ state }: AState) {
    state.orders = getItem<Order[]>("orders") || [];
  },

  fetchStores({ state }: AState) {
    state.stores = getItem<Store[]>("stores") || [];
  },

  fetchCustomers({ state }: AState) {
    state.customers = getItem<Customer[]>("customers") || [];
  },

  fetchDrones({ state }: AState) {
    state.drones = getItem<Drone[]>("drones") || [];
  },

  fetchPlans({ state }: AState) {
    state.plans = getItem<Plan[]>("plans") || [];
  },

  createPlan(
    { state }: AState,
    {
      draftPlan,
      orderId,
      energyCost
    }: { draftPlan: Plan; orderId: string; energyCost: number }
  ) {
    const indexOrder = findIndex(state.orders, "id", orderId);
    const indexBasket = findIndex(
      state.orders[indexOrder].basket,
      "productId",
      draftPlan.productId
    );
    const indexDrone = findIndex(state.drones, "id", draftPlan.drone);
    const indexStore = findIndex(state.stores, "id", draftPlan.store);
    const indexStock = findIndex(
      state.stores[indexStore].stock,
      "productId",
      draftPlan.productId
    );
    const customer = state.customers.find(
      customer => customer.id === draftPlan.customerId
    );

    // Update order, removing the selected product
    state.orders[indexOrder].basket[indexBasket].quantity += -1;
    // Update drone autonomy
    state.drones[indexDrone].autonomy += -energyCost;
    // update drone position: equal to customer position
    state.drones[indexDrone].x = customer
      ? customer.x
      : state.drones[indexDrone].x;
    state.drones[indexDrone].y = customer
      ? customer.y
      : state.drones[indexDrone].y;
    // Update store stock
    state.stores[indexStore].stock[indexStock].quantity += -1;

    state.plans.push(draftPlan);

    storeAll(
      [state.customers, state.drones, state.orders, state.plans, state.stores],
      ["customers", "drones", "orders", "plans", "stores"]
    );
  }
};

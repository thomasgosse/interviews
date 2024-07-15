import customers from "../../data/customers.json";
import drones from "../../data/drones.json";
import orders from "../../data/orders.json";
import stores from "../../data/stores.json";

import actions from "@/store/actions";
import { getItem, storeAll } from "@/services/local-storage";
import { Plan } from "@/types";
import { State } from "@/store";

jest.mock("@/services/local-storage", () => {
  return {
    getItem: jest
      .fn()
      // eslint-disable-next-line
      .mockReturnValueOnce(require("../../data/customers.json"))
      // eslint-disable-next-line
      .mockReturnValueOnce(require("../../data/drones.json"))
      // eslint-disable-next-line
      .mockReturnValueOnce(require("../../data/orders.json"))
      // eslint-disable-next-line
      .mockReturnValueOnce(require("../../data/stores.json")),
    storeAll: jest.fn()
  };
});

describe("Fetch actions should return data from local storage service", () => {
  const state: State = {
    customers: [],
    drones: [],
    orders: [],
    stores: [],
    plans: []
  };

  it("fetchCustomers", () => {
    actions.fetchCustomers({ state });

    expect(getItem).toBeCalledWith("customers");
    expect(state.customers).toEqual(customers);
  });

  it("fetchDrones", () => {
    actions.fetchDrones({ state });

    expect(getItem).toBeCalledWith("drones");
    expect(state.drones).toEqual(drones);
  });

  it("fetchOrders", () => {
    actions.fetchOrders({ state });

    expect(getItem).toBeCalledWith("orders");
    expect(state.orders).toEqual(orders);
  });

  it("fetchStores", () => {
    actions.fetchStores({ state });

    expect(getItem).toBeCalledWith("stores");
    expect(state.stores).toEqual(stores);
  });
});

describe("Create plan feature", () => {
  afterEach(() => jest.clearAllMocks());

  const state = {
    customers,
    drones,
    orders,
    stores,
    plans: []
  };

  it("Should create a plan AND update state", () => {
    const draftPlan: Plan = {
      drone: "Alpha",
      customerId: "Jean Dupont",
      productId: "Axe",
      store: "Villeneuve"
    };
    const energyCost = 25.54;
    const orderId = "LMFRORDER-1";
    const customerId = "Jean Dupont";
    actions.createPlan({ state }, { draftPlan, orderId, energyCost });

    expect(state.plans[0]).toEqual({
      drone: "Alpha",
      customerId,
      productId: "Axe",
      store: "Villeneuve"
    });

    const customer = customers.find(c => c.id === customerId);
    const drone = state.drones.find(d => d.id === draftPlan.drone);
    expect(drone?.autonomy).toEqual(100 - energyCost);
    expect(drone?.x).toEqual(customer?.x);
    expect(drone?.y).toEqual(customer?.y);

    const order = state.orders.find(o => o.id === orderId);
    expect(order?.basket[0].quantity).toEqual(4);

    const store = state.stores.find(s => s.id === draftPlan.store);
    expect(store?.stock[0].quantity).toEqual(9);

    expect(storeAll).toHaveBeenCalledTimes(1);
    expect(storeAll).toHaveBeenLastCalledWith(
      [state.customers, state.drones, state.orders, state.plans, state.stores],
      ["customers", "drones", "orders", "plans", "stores"]
    );
  });

  it("Should throw an error if a data does not match, AND not update state", () => {
    // Should be the same output with a different field that does not match
    const draftPlan: Plan = {
      drone: "NOT_DRONE",
      customerId: "Jean Dupont",
      productId: "Axe",
      store: "Villeneuve"
    };
    const energyCost = 25.54;
    const orderId = "LMFRORDER-1";

    const tmpState = JSON.stringify(state);

    try {
      actions.createPlan({ state }, { draftPlan, orderId, energyCost });
    } catch (e) {
      expect(e.message).toBe("NOT_DRONE could not be found");
      expect(state).toEqual(JSON.parse(tmpState));
      expect(storeAll).toHaveBeenCalledTimes(0);
    }
  });
});

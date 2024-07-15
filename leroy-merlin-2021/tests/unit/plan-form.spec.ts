import { mount } from "@vue/test-utils";
import PlanForm from "@/components/PlanForm.vue";
import { createStore, Store } from "vuex";
import { State } from "@/store";

import customers from "../../data/customers.json";
import drones from "../../data/drones.json";
import orders from "../../data/orders.json";
import stores from "../../data/stores.json";

const closeModalMock = jest.fn();
const createPlanMock = jest.fn();

const state = {
  customers,
  drones,
  orders,
  stores,
  plans: []
};

const actions = {
  fetchOrders: jest.fn(),
  fetchStores: jest.fn(),
  fetchCustomers: jest.fn(),
  fetchDrones: jest.fn(),
  fetchPlans: jest.fn(),
  createPlan: createPlanMock
};

const getters = {
  ordersEmptyItemFiltered: () => orders
};

describe("PlanForm.vue", () => {
  let store: Store<State>;

  beforeEach(() => {
    store = createStore<State>({ state, actions, getters });
  });

  afterEach(() => {
    closeModalMock.mockClear();
    createPlanMock.mockClear();
  });

  it("Should render", () => {
    const wrapper = mount(PlanForm, {
      props: {
        closeModal: closeModalMock
      },
      global: {
        plugins: [store]
      }
    });
    expect(wrapper).toBeDefined();
  });

  it("Should return basket items", () => {
    const wrapper = mount(PlanForm, {
      props: {
        closeModal: closeModalMock
      },
      global: {
        plugins: [store]
      }
    });

    const expectedBasket = [
      {
        productId: "Axe",
        quantity: 5
      },
      {
        productId: "Nail",
        quantity: 1
      },
      {
        productId: "Hammer",
        quantity: 1
      }
    ];
    expect(wrapper.vm.getBasketItems("LMFRORDER-1")).toEqual(expectedBasket);
  });

  it("Should test product stock availability", () => {
    const wrapper = mount(PlanForm, {
      props: {
        closeModal: closeModalMock
      },
      global: {
        plugins: [store]
      }
    });

    wrapper.vm.selectedItem = "Hammer";
    // Hammer are available in Villeneuve store
    expect(wrapper.vm.hasProductInStock(stores[0])).toBe(true);
    // Hammer are not available in Roncq store
    expect(wrapper.vm.hasProductInStock(stores[1])).toBe(false);
  });

  it("Should compute energy cost", () => {
    const wrapper = mount(PlanForm, {
      props: {
        closeModal: closeModalMock
      },
      global: {
        plugins: [store]
      }
    });
    wrapper.vm.selectedOrder = { id: "LMFRORDER-1", customerId: "Jean Dupont" };
    wrapper.vm.selectedStore = "Roncq";
    // Is a string because toFixed
    expect(wrapper.vm.getEnergyCost(drones[0]).toFixed(0)).toBe("81");
  });

  it("Should return max energy cost (100) if store or customer in unrecognized", () => {
    const wrapper = mount(PlanForm, {
      props: {
        closeModal: closeModalMock
      },
      global: {
        plugins: [store]
      }
    });
    wrapper.vm.selectedOrder = {
      id: "LMFRORDER-1",
      customerId: "Jean Inconnu"
    };
    wrapper.vm.selectedStore = "NOT_RECOGNIZE";
    // Is a string because toFixed
    expect(wrapper.vm.getEnergyCost(drones[0])).toBe(100);
  });

  it("Should returns drone availability", () => {
    const wrapper = mount(PlanForm, {
      props: {
        closeModal: closeModalMock
      },
      global: {
        plugins: [store]
      }
    });
    wrapper.vm.selectedOrder = {
      id: "LMFRORDER-1",
      customerId: "Jean Dupoont"
    };
    wrapper.vm.selectedStore = "Roncq";
    expect(wrapper.vm.isDroneAvailable(drones[0])).toBe(true);
  });

  it("Should submit form: success case", () => {
    const wrapper = mount(PlanForm, {
      props: {
        closeModal: closeModalMock
      },
      global: {
        plugins: [store]
      }
    });

    wrapper.vm.submit({ preventDefault: jest.fn() });

    expect(createPlanMock).toHaveBeenCalledTimes(1);
    expect(closeModalMock).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.errorMessage).toBe("");
  });
});

describe("PlanForm.vue submit failure case", () => {
  it("Should submit form: failure case", () => {
    const createPlanMockFailure = jest.fn().mockImplementation(() => {
      throw new Error("FAILURE");
    });
    actions.createPlan = createPlanMockFailure;
    const store = createStore<State>({ state, actions, getters });

    const wrapper = mount(PlanForm, {
      props: {
        closeModal: closeModalMock
      },
      global: {
        plugins: [store]
      }
    });

    wrapper.vm.submit({ preventDefault: jest.fn() });

    expect(createPlanMockFailure).toHaveBeenCalledTimes(1);
    expect(closeModalMock).toHaveBeenCalledTimes(0);
    expect(wrapper.vm.errorMessage).toBe("An error occured: FAILURE");
  });
});

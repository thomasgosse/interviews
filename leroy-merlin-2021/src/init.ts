import customers from "../data/customers.json";
import drones from "../data/drones.json";
import orders from "../data/orders.json";
import stores from "../data/stores.json";

import { Customer, Drone, Order, Store } from "./types";

const keys = ["customers", "drones", "orders", "stores"];

type Datas = {
  customers: Customer[];
  drones: Drone[];
  orders: Order[];
  stores: Store[];
};

const datas: Datas = { customers, drones, orders, stores };

export default function init(): void {
  keys.forEach(key => {
    const exists = localStorage.getItem(key);
    if (!exists) {
      const data = datas[key as keyof Datas];
      const dataJson = JSON.stringify(data);
      localStorage.setItem(key, dataJson);
    }
  });
}

import { Drone, Store, Customer } from "@/types";

export function getDistance(x1: number, x2: number, y1: number, y2: number) {
  const squareX = Math.pow(x1 - x2, 2);
  const squareY = Math.pow(y1 - y2, 2);
  return Math.sqrt(squareX + squareY);
}

export function getTotalDistance(
  drone: Drone,
  store: Store,
  customer: Customer
): number {
  const dDroneStore = getDistance(drone.x, store.x, drone.y, store.y);
  const dStoreCustomer = getDistance(store.x, customer.x, store.y, customer.y);
  return dDroneStore + dStoreCustomer;
}

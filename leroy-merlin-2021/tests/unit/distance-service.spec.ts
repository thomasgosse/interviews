import { getDistance, getTotalDistance } from "@/services/distance-service";
import { Customer, Drone, Store } from "@/types";

describe("Distance computation service", () => {
  it("Should returns the distance between two point on a 2D plan", () => {
    expect(getDistance(1, 4, 12, 8)).toBe(5);
    expect(getDistance(4, 4, 8, 16)).toBe(8);
  });

  it("Should returns the sum of drone <-> store AND store <-> customer distance", () => {
    const drone: Drone = {
      autonomy: 1485789,
      x: 1,
      y: 12,
      id: "DRONE"
    };
    const store: Store = {
      x: 4,
      y: 8,
      id: "STORE",
      stock: []
    };
    const customer: Customer = {
      id: "JEAN",
      x: 4,
      y: 16
    };
    expect(getTotalDistance(drone, store, customer)).toBe(13);
  });
});

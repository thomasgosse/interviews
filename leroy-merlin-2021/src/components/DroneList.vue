<template>
  <div class="drones__content">
    <div v-for="(drone, i) in drones" :key="drone.id" class="drone-card">
      <img
        :src="droneImages[i]"
        width="150"
        height="150"
        class="drone-card__img"
      />
      <div class="drone-card__info">
        <h2>{{ drone.id }}</h2>
        <div>Current position: x:{{ drone.x }} - y:{{ drone.y }}</div>
        <progress :value="drone.autonomy" max="100" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Drone } from "@/types";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "DroneList",
  props: {
    drones: Array as PropType<Drone[]>
  },
  data() {
    return {
      droneImages: [
        require("../assets/drone1.jpeg"),
        require("../assets/drone2.jpeg"),
        require("../assets/drone3.jpeg"),
        require("../assets/drone4.jpeg"),
        require("../assets/drone5.jpeg")
      ]
    };
  }
});
</script>

<style lang="scss">
.drones__content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.drone-card {
  padding: 10px 20px 10px 10px;
  background: white;
  border-radius: var(--default-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

  h2 {
    margin: 0;
  }

  &__img {
    object-fit: contain;
  }

  &__info {
    display: flex;
    flex-direction: column;
  }
}

progress {
  margin-top: 10px;
  -webkit-appearance: none;
}

::-webkit-progress-bar {
  background-color: var(--secondary);
}
</style>

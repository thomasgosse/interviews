<template>
  <Page title="Drones">
    <drone-list :drones="drones"></drone-list>
  </Page>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { State } from "@/store/index";
import Page from "@/components/Page.vue";
import DroneList from "@/components/DroneList.vue";

export default defineComponent({
  name: "Drones",
  components: {
    Page,
    "drone-list": DroneList
  },
  setup() {
    const store = useStore<State>();
    const drones = computed(() => store.state.drones);
    return { drones };
  }
});
</script>

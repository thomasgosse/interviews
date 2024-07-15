<template>
  <Header />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/components/Header.vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "Home",
  components: {
    Header
  },
  setup() {
    const store = useStore();
    store.dispatch("fetchOrders");
    store.dispatch("fetchDrones");
    store.dispatch("fetchCustomers");
    store.dispatch("fetchStores");
    store.dispatch("fetchPlans");
  }
});
</script>

<style lang="scss">
#app {
  font-family: Helvetica Neue;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  max-width: 1200px;
  margin: auto;
}

body,
html {
  margin: 0;
  background: var(--background);

  --background: rgb(253, 253, 246);
  --primary: #79be1e;
  --secondary: #cbe3b5;
  --title-font-size: 40px;
  --default-radius: 4px;

  @media screen and (max-width: 600px) {
    --title-font-size: 30px;
  }
}

table {
  flex: 1;
  -webkit-flex: 1 1 auto;
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 14px;
  font-family: sans-serif;

  border-radius: 8px;
  overflow: hidden;

  th {
    background-color: var(--primary);
    color: var(--background);
    text-align: left;
  }

  th,
  td {
    padding: 12px 15px;
  }

  tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
  }

  tbody tr:last-of-type {
    border-bottom: 2px solid var(--primary);
  }
}

button {
  margin: 0;
  font-weight: 600;
  font-size: 16px;
  padding: 8px 20px;
  min-height: 48px;
  min-width: 48px;
  height: 0;
  cursor: pointer;
  border-radius: var(--default-radius);
  text-align: center;
  border: 2px solid transparent;
  transition: all ease 200ms;
  color: var(--primary);
  border-color: var(--primary);
  background-color: var(--background);
}

button:hover,
button:active,
button:focus {
  background-color: var(--secondary);
}
</style>

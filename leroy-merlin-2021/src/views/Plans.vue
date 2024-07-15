<template>
  <Page title="Plans">
    <div class="plans__content">
      <div class="plans__content--wrapper">
        <plan-table :plans="plans" :openModal="openModal"></plan-table>
      </div>
    </div>
    <plan-modal v-if="showModal" :closeModal="closeModal" />
  </Page>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { State } from "@/store/index";
import Page from "@/components/Page.vue";
import PlanTable from "@/components/PlanTable.vue";
import PlanModal from "@/components/PlanModal.vue";

export default defineComponent({
  name: "Plans",
  components: {
    Page,
    PlanTable,
    PlanModal
  },
  data() {
    return {
      showModal: false
    };
  },
  setup() {
    const store = useStore<State>();
    const plans = computed(() => store.state.plans);
    return { plans };
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    }
  }
});
</script>

<style lang="scss" scoped>
.plans__content {
  overflow-x: auto;

  &--wrapper {
    display: flex;
    flex: 1;
  }
}
</style>

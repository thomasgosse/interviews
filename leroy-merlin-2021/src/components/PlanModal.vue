<template>
  <div class="modal">
    <button class="modal__close" @click="closeModal">X</button>
    <Page title="Create plan">
      <plan-form :closeModal="closeModal"></plan-form>
    </Page>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Page from "./Page.vue";
import PlanForm from "./PlanForm.vue";

export default defineComponent({
  name: "PlanModal",
  components: {
    Page,
    PlanForm
  },
  props: {
    closeModal: {
      type: Function,
      required: true
    }
  }
});
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background: var(--background);

  &__close {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
</style>

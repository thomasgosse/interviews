<template>
  <div class="page">
    <h1 class="page__title">{{ title }}</h1>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Page",
  props: {
    title: String
  }
});
</script>

<style scoped lang="scss">
.page {
  padding: 30px;

  &__title {
    font-size: var(--title-font-size);
    font-weight: 700;
    color: var(--primary);
  }
}

@media screen and (max-width: 600px) {
  .page {
    padding: 15px;

    &__title {
      text-align: center;
    }
  }
}
</style>

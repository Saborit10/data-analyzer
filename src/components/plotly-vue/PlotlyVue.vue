<script setup lang="ts">
import Plotly from "plotly.js-dist-min";
import { onMounted, onUnmounted, onUpdated, ref } from "vue";
import { computed } from "vue";

/* Props */
const props = defineProps<{
  traces: object[];
  layout?: object;
  config?: object;
}>();

/* Template Refs */
const plotlyRef = ref(null);

/* Empty data flag */
const isEmpty = computed(() => {
  for (let i = 0; i < props.traces.length; i++)
    if (props.traces[i].x.length > 0 || props.traces[i].y.length > 0)
      return false;
  return true;
});

/* Function to build the plot */
const buildPlot = () => {
  if (!isEmpty.value)
    Plotly.newPlot(plotlyRef.value, props.traces, props.layout, props.config);
  else
    plotlyRef.value.innerHTML =
      '<div id="plotlyContainer" ref="plotlyRef"></div>';
};

/* Build plot on mounted and on update */
onUpdated(buildPlot);

// Redraw chart on resize
onMounted(() => {
  const observer = new ResizeObserver(buildPlot);
  observer.observe(plotlyRef.value);
});

onUnmounted(() => {
  const observer = new ResizeObserver(buildPlot);
  observer.unobserve(plotlyRef.value);
});
</script>

<template>
  <div id="plotlyContainer" ref="plotlyRef"></div>
</template>

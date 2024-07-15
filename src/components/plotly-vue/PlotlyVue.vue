<script setup lang="ts">
import Plotly from "plotly.js-dist-min";
import { onMounted, onUnmounted, onUpdated, ref } from "vue";
import { computed } from "vue";

const props = defineProps<{
  traces: object[];
  layout?: object;
  config?: object;
}>();

const isEmpty = computed(() => {
  for (let i = 0; i < props.traces.length; i++)
    if (props.traces[i].x.length > 0 || props.traces[i].y.length > 0)
      return false;
  return true;
});

const buildPlot = () => {
  Plotly.newPlot("plotlyContainer", props.traces, props.layout, props.config);
};

// Build Plotly chart
onUpdated(buildPlot);

// Redraw chart on resize
const plotlyRef = ref(null);

const handleResize = () => {
  Plotly.newPlot(plotlyRef.value, props.traces, props.layout, props.config);
};

onMounted(() => {
  const observer = new ResizeObserver(handleResize);
  observer.observe(plotlyRef.value);
});

onUnmounted(() => {
  const observer = new ResizeObserver(handleResize);
  observer.unobserve(plotlyRef.value);
});
</script>

<template>
  <div id="plotlyContainer" ref="plotlyRef"></div>
</template>

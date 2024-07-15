<script setup>
import DataForm from "./components/data-form/DataForm.vue";
import Panel from "primevue/panel";
import PlotlyVue from "./components/plotly-vue/PlotlyVue.vue";
import DataframeVue from "./components/dataframe-vue/DataframeVue.vue";
import { reactive, ref } from "vue";

/* Dataframe ref */
let dataframe = ref();

/* Traces ref */
let traces = ref([]);
let trace = reactive({
  x: [],
  y: [],
  mode: "",
  type: "",
});

/* Layout ref */
const layout = {};

/* Chart config ref */
const chartConfig = {
  displayModeBar: false,
  scrollZoom: false,
  dragmode: false,
};

/* Triggered when data is loaded to a dataframe */
const onDataLoaded = (data) => {
  dataframe.value = data;
};

/* Triggered to show data as a chart */
const showData = (data) => {
  const xSeries = dataframe.value[data.x];
  const ySeries = dataframe.value[data.y];

  switch (data.type) {
    case "scatter":
      trace = {
        x: xSeries.values,
        y: ySeries.values,
        mode: "markers",
        type: "scatter",
        marker: {
          color: "#10B981",
        },
      };
      break;
    case "bar":
      trace = {
        x: xSeries.values,
        y: ySeries.values,
        mode: "markers",
        type: "bar",
        marker: {
          color: "#10B981",
        },
      };
      break;
    case "lines":
      trace = {
        x: xSeries.values,
        y: ySeries.values,
        mode: "lines+markers",
        type: "scatter",
        marker: {
          color: "#10B981",
        },
      };
      break;
  }

  traces.value = [trace];
};

/* Triggered to clear data chart and dataframe */
const clearData = () => {
  trace = {
    x: [],
    y: [],
    mode: "",
    type: "",
  };
  traces.value = [trace];

  dataframe.value = undefined;
};
</script>

<template>
  <section
    class="bg-white dark:bg-gray-800 p-10 rounded-xl flex flex-col gap-8 w-full"
  >
    <div class="flex flex-row w-full gap-8 items-end">
      <p
        class="text-4xl text-black dark:text-white font-bold inline whitespace-nowrap"
      >
        Data Analyzer
      </p>

      <DataForm
        @data-loaded="onDataLoaded"
        @show-data="showData"
        @clear-data="clearData"
        class="w-full"
      />
    </div>

    <div class="flex flex-row gap-3 h-full">
      <Panel header="Gráfico de los Datos" class="w-1/2">
        <PlotlyVue :traces="traces" :layout="layout" :config="chartConfig" />
      </Panel>

      <Panel header="Datos" class="w-1/2 flex flex-col gap-y-2">
        <DataframeVue :df="dataframe" />
      </Panel>
    </div>
  </section>
</template>

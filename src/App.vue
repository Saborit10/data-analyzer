<script setup>
import DataForm from "./components/data-form/DataForm.vue";
import Panel from "primevue/panel";
import PlotlyVue from "./components/plotly-vue/PlotlyVue.vue";
import DataframeVue from "./components/dataframe-vue/DataframeVue.vue";
import { reactive, ref } from "vue";

const layout = {};

const chartConfig = {
  displayModeBar: false,
  scrollZoom: false,
  dragmode: false,
};

let traces = ref([]);
let dataframe = ref();
let trace = reactive({
  x: [],
  y: [],
  mode: "",
  type: "",
});

const onDataLoaded = (data) => {
  dataframe.value = data;
};

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
      };
      break;
    case "bar":
      trace = {
        x: xSeries.values,
        y: ySeries.values,
        mode: "markers",
        type: "bar",
      };
      break;
    case "lines":
      trace = {
        x: xSeries.values,
        y: ySeries.values,
        mode: "lines+markers",
        type: "scatter",
      };
      break;
  }

  traces.value = [trace];
};

const clearData = () => {};
</script>

<template>
  <section
    class="bg-white dark:bg-gray-800 p-10 rounded-xl flex flex-col gap-8 w-full"
  >
    <h1 class="text-4xl text-black dark:text-white font-bold text-center">
      Data Analyzer
    </h1>

    <div class="flex flex-row gap-3 h-full">
      <Panel header="Gráfico de los Datos" class="w-1/2">
        <PlotlyVue :traces="traces" :layout="layout" :config="chartConfig" />
      </Panel>

      <Panel header="Datos" class="w-1/2 flex flex-col gap-y-2">
        <DataForm
          @data-loaded="onDataLoaded"
          @show-data="showData"
          @clear-data="clearData"
        />
        <DataframeVue :df="dataframe" />
      </Panel>
    </div>
  </section>
</template>

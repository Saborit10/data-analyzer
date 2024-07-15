<script setup lang="ts">
import { ref } from "vue";

import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import FileUpload from "primevue/fileupload";

import * as dfd from "danfojs/dist/danfojs-browser/src";

/* Define the events that this component emits */
const emit = defineEmits(["dataLoaded", "showData", "clearData"]);

/* Ref to the selected columns */
const selectedXColumn = ref();
const selectedYColumn = ref();

/* Ref to the column options */
const xColumnOptions = ref([]);
const yColumnOptions = ref([]);

/* Ref to the loading state flag of submit button */
const isInLoadingState = ref<boolean>(false);

/* Type Chart Options */
const chartTypeOptions = [
  { name: "Gráfico de Barras", code: "bar" },
  { name: "Gráfico de Puntos", code: "scatter" },
  { name: "Gráfico de Líneas", code: "lines" },
];

/* Ref to chart type */
const selectedChartType = ref(chartTypeOptions[0]);

/* Process Data */
const loadFile = () => {
  emit("showData", {
    x: selectedXColumn.value.name,
    y: selectedYColumn.value.name,
    type: selectedChartType.value.code,
  });
};

/* Triggered when a file is selected */
const onFileSelect = async (event) => {
  const dataFile: string = event.files[0];

  let format = null;

  if (dataFile.name.endsWith(".csv")) format = "csv";
  else if (dataFile.name.endsWith(".json")) format = "json";
  else if (dataFile.name.endsWith(".xls") || dataFile.name.endsWith(".xlsx"))
    format = "xls";

  let dfPromise = null;
  if (format === "csv") dfPromise = dfd.readCSV(dataFile);
  else if (format === "json") dfPromise = dfd.readJSON(dataFile);
  else dfPromise = dfd.readExcel(dataFile);

  dfPromise.then((df) => {
    df.rename({ "": "index" }, { inplace: true });

    const columnOptions = df.columns.map((column, index) => ({
      name: column,
      code: index,
    }));

    xColumnOptions.value = columnOptions;
    yColumnOptions.value = columnOptions;

    selectedXColumn.value = columnOptions[0];
    selectedYColumn.value = columnOptions[1];

    emit("dataLoaded", df);

    loadFile();
  });
};

/* Triggered when a file is cleared */
const onFileCleared = () => {
  emit("clearData");
};
</script>

<template>
  <form class="flex flex-col gap-2">
    <div class="flex flex-row justify-between">
      <FileUpload
        mode="basic"
        name="demo[]"
        :maxFileSize="1000000"
        @select="onFileSelect"
        @clear="onFileCleared"
      />

      <Button
        type="button"
        label="Cargar"
        icon="pi pi-search"
        :loading="isInLoadingState"
        @click="loadFile"
      />
    </div>
    <div class="flex flex-row justify-between">
      <Dropdown
        v-model="selectedXColumn"
        :options="xColumnOptions"
        optionLabel="name"
        filter
        class="w-full md:w-[14rem]"
        @change="loadFile"
      />

      <Dropdown
        v-model="selectedYColumn"
        :options="yColumnOptions"
        optionLabel="name"
        filter
        class="w-full md:w-[14rem]"
        @change="loadFile"
      />

      <Dropdown
        v-model="selectedChartType"
        :options="chartTypeOptions"
        optionLabel="name"
        filter
        class="w-full md:w-[14rem]"
        @change="loadFile"
      />
    </div>
  </form>
</template>

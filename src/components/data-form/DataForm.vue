<script setup lang="ts">
import { ref } from "vue";

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

  xColumnOptions.value = [];
  yColumnOptions.value = [];
};
</script>

<template>
  <form class="flex flex-col gap-2 w-100">
    <div class="flex flex-row justify-between items-end w-100">
      <FileUpload
        mode="basic"
        name="demo[]"
        :maxFileSize="1000000"
        @select="onFileSelect"
        @clear="onFileCleared"
        class="max-w-64 truncate"
        chooseLabel="Seleccionar archivo"
      />

      <div class="flex gap-2">
        <div class="flex flex-col">
          <label for="x-column" class="text-slate-600 font-light text-sm"
            >Columna del eje x</label
          >
          <Dropdown
            id="x-column"
            v-model="selectedXColumn"
            :options="xColumnOptions"
            optionLabel="name"
            filter
            class="w-48"
            @change="loadFile"
          />
        </div>

        <div class="flex flex-col">
          <label for="y-column" class="text-slate-600 font-light text-sm"
            >Columna del eje y</label
          >
          <Dropdown
            v-model="selectedYColumn"
            :options="yColumnOptions"
            optionLabel="name"
            filter
            class="w-48"
            @change="loadFile"
          />
        </div>

        <div class="flex flex-col">
          <label for="x-column" class="text-slate-600 font-light text-sm"
            >Tipo de gráfico</label
          >
          <Dropdown
            v-model="selectedChartType"
            :options="chartTypeOptions"
            optionLabel="name"
            class="w-48"
            @change="loadFile"
          />
        </div>
      </div>
    </div>
  </form>
</template>

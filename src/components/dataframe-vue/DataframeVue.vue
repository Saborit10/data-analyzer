<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { computed } from "vue";

const props = defineProps<{ df: any }>();

/* Data to show in the table */
const dfValues = computed(() => {
  return props.df.values.map((row, index) => {
    let rowValue = {};
    for (let i = 0; i < row.length; i++) {
      rowValue[props.df.columns[i]] = row[i];
    }
    return rowValue;
  });
});
</script>

<template>
  <div>
    <DataTable
      v-if="props.df"
      :value="dfValues"
      stripedRows
      tableStyle="font-size: 0.7rem"
      paginator
      :rows="10"
    >
      <Column
        v-for="col in props.df.columns"
        :key="col"
        :field="col"
        :header="col"
      ></Column>
    </DataTable>

    <DataTable v-else :value="[]" stripedRows tableStyle=""> </DataTable>
  </div>
</template>

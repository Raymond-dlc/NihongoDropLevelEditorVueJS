<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { registerAllModules } from 'handsontable/registry';
import { useRoute } from 'vue-router';
import Handsontable from 'handsontable';
import { type Word } from '@/model/Word'
import 'handsontable/dist/handsontable.full.css';

// register Handsontable's modules
registerAllModules();

const route = useRoute();

const isLoading = ref<boolean>(false);

const wordsData = ref<Word[]>([]);
const tableRef = ref<HTMLElement | null>(null);

async function fetchWords() {
  isLoading.value = true
  try {
    const response = await axios.get(`/api/words`);
    wordsData.value = response.data;
  } catch (error) {
    console.log("Failed to load chapter", error);
  } finally {
    isLoading.value = false;
  }
}

function updateTable() {
  if (tableRef.value) {
    new Handsontable(tableRef.value, {
      data: wordsData.value,
      height: 'auto',
      width: 'auto',
      // Sort by id descending
      columnSorting: {
        initialConfig: {
          column: 0,
          sortOrder: 'desc'
        }
      },
      // Header titles
      colHeaders: [
        "ID",
        "Japanese",
        "Furigana",
        "English"
      ],
      // Mapping with the model
      columns(column) {
        switch (column) {
          case 0:
            return { data: 'wordId' };
          case 1:
            return { data: 'japanese' };
          case 2:
            return { data: 'furigana' };
          case 3:
            return { data: 'english' };
          default:
            return {};
        }
      },
      minSpareRows: 1,
      autoWrapRow: true,
      autoWrapCol: true,
      licenseKey: 'non-commercial-and-evaluation',
    });
  }
}

onMounted(fetchWords);

// Fetch data on initial render as well
watch(route, fetchWords, { immediate: true });
// Create the table immediately
watch(wordsData, updateTable, { immediate: true }); 
</script>

<template>
  <main class="flex flex-col flex-1 bg-grey-100 p-8 pl-32 md:p-8">
    <h1 class="text text-4xl font-extrabold text-sakura mb-8">Words</h1>
    <div ref="tableRef" id="words-table"></div>
  </main>
</template>

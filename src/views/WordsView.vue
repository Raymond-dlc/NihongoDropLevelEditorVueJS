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
var table: Handsontable | null = null

const updateWord = async (word: Word) => {
  try {
    // Try to update the word with a PUT request
    const response = await axios.put(`/api/words/${word.id}`, word);
    console.log('Word updated');
  } catch (error) {
    // Check if the error is a 404 Not Found
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      try {
        // If 404, try to create the word with a POST request
        const response = await axios.post('/api/words', word);
        console.log('Word created');
      } catch (postError) {
        console.log('Failed to create word', postError);
      }
    } else {
      console.log('Failed to update word', error);
    }
  } finally {
    isLoading.value = false;
  }
}

async function fetchWords() {
  isLoading.value = true
  try {
    const response = await axios.get(`/api/words`);
    console.log("words loaded");
    wordsData.value = response.data;
  } catch (error) {
    console.log("Failed to load chapter", error);
  } finally {
    isLoading.value = false;
  }
}

function updateTable() {
  if (tableRef.value) {
    table = new Handsontable(tableRef.value, {
      data: wordsData.value,
      height: 'auto',
      width: '100%',
      stretchH: 'all', //to fill container width
      allowInsertRow: false,
      renderAllRows: true,
      beforeChangeRender(changes, source) {
        console.log("render change?", changes, source)
      },
      beforeRefreshDimensions() {
        return false;
      },
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
            return { data: 'id' };
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
      afterChange(changes, source) {
        changes?.forEach(change => {
          var updatedRow = table?.getDataAtRow(change[0]);
          const updatedWord: Word = {
            id: updatedRow?.[0].toString() ?? "",
            japanese: updatedRow?.[1] ?? "",
            furigana: updatedRow?.[2] ?? "",
            english: updatedRow?.[3] ?? "",
          }
          console.log(updatedWord);
          updateWord(updatedWord)
        });

        console.log(changes)
        console.log(source)
      },
      afterCreateRow(index, amount, source) {
        if (source?.toString() === "addWord") {
          table?.setDataAtCell(0, 0, table?.countRows() - 1)
          console.log(`created, ${index}, ${amount}, ${source}`)
        }
      },
      minSpareRows: 0,
      // autoWrapRow: true,
      // autoWrapCol: true,
      licenseKey: 'non-commercial-and-evaluation',
    });
  }
}

const addWordRow = () => {
  table?.alter('insert_row_above', 0, 1, "addWord")
}

// Fetch data on initial render as well
watch(route, fetchWords, { immediate: true });
// Create the table immediately
watch(wordsData, updateTable, { immediate: true }); 
</script>

<template>
  <!-- Main -->
  <main class="flex grow h-full h-dvh bg-mint-green-100 ">
    <!-- content -->
    <div class="flex flex-col grow">
      <div class="flex-0 pb-4">
        <h1 class="text text-4xl font-bold text-sakura mb-8">Words</h1>
        <button @click="addWordRow"
          class="rounded-full bg-mint-green-100 outline outline-2 outline-green-800 hover:bg-mint-green-500 px-4 py-3">
          <span class="text text-s text-green-800 font-bold">+ Add word</span>
        </button>
      </div>
      <div class="grow w-full">
        <div ref="tableRef" class="w-full" id="words-table"></div>
      </div>
    </div>
  </main>
</template>

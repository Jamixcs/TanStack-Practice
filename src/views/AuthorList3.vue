<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useQuery } from '@tanstack/vue-query'

const router = useRouter()
const errorMessage = ref(null)

async function fetchAuthorsData() {
  try {
    console.log(
      'Page 3 >>>>>>>> fetchAuthorsData called (staleTime = 0, refetch on window focus triggers fetch)',
    )
    const response = await axios.get('https://fakerestapi.azurewebsites.net/api/v1/Authors')

    console.log(response.data)
    return response.data
  } catch (error) {
    errorMessage.value = error.message
    console.error(error)
  }
}

async function updateAuthorsData(data) {
  try {
    console.log('Page 3 >>>>>>>> updateAuthorsData called')
    const response = await axios.post('https://fakerestapi.azurewebsites.net/api/v1/Authors', data)

    return response.data
  } catch (error) {
    errorMessage.value = error.message
    console.error(error)
  }
}

const { data, isError, fetchStatus } = useQuery({
  queryKey: ['authorData'],
  queryFn: fetchAuthorsData,
})

const localAuthors = ref([])

watch(
  () => data.value,
  (newVal) => {
    if (newVal) {
      localAuthors.value = JSON.parse(JSON.stringify(newVal))
    }
  },
  { immediate: true },
)

const editingIndex = ref(null)
const buttonAction = ref('Edit')

function buttonHandler(index, action, data) {
  if (action === 'Edit') {
    editingIndex.value = index
    buttonAction.value = 'Save'
  } else {
    updateAuthorsData(data)
    editingIndex.value = null
    buttonAction.value = 'Edit'
  }
}

function onBack() {
  router.back()
}
</script>

<template>
  <div>
    <button
      class="bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded"
      @click="onBack"
    >
      Back
    </button>
    <div
      class="flex justify-center items-center"
      v-if="fetchStatus === 'fetching' && localAuthors.length === 0"
    >
      <div
        class="w-20 h-20 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"
      ></div>
    </div>
    <span v-else-if="isError" class="text-red-500">Error: {{ errorMessage }}</span>
    <table v-if="localAuthors" class="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2 text-left">#</th>
          <th class="border border-gray-300 px-4 py-2 text-left">First Name</th>
          <th class="border border-gray-300 px-4 py-2 text-left">Last Name</th>
          <th class="border border-gray-300 px-4 py-2 text-left">Edit</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="author in localAuthors" :key="author.id">
          <td class="border border-gray-300 px-4 py-2">{{ author.id + 1 }}</td>
          <td class="border border-gray-300 px-4 py-2">
            <input
              v-if="editingIndex?.id === author.id"
              v-model="author.firstName"
              class="border border-gray-300 px-2 py-1 rounded w-full"
            />
            <span v-else>{{ author.firstName }}</span>
          </td>
          <td class="border border-gray-300 px-4 py-2">
            <input
              v-if="editingIndex?.id === author.id"
              v-model="author.lastName"
              class="border border-gray-300 px-2 py-1 rounded w-full"
            />
            <span v-else>{{ author.lastName }}</span>
          </td>
          <td class="border border-gray-300 px-4 py-2">
            <button
              class="text-blue-500 hover:text-blue-700 p-1 rounded-md"
              @click="buttonHandler(author, buttonAction, author)"
              aria-label="Edit"
            >
              {{ buttonAction }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped></style>

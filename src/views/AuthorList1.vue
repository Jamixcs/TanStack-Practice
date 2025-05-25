<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useQuery } from '@tanstack/vue-query'

const router = useRouter()
const errorMessage = ref(null)

async function fetchAuthorsData() {
  try {
    console.log(
      'Page 1 >>>>>>>> fetchAuthorsData called (staleTime = 0, refetch on window focus triggers fetch)',
    )
    const response = await axios.get('https://fakerestapi.azurewebsites.net/api/v1/Authors')

    console.log(response.data)
    return response.data
  } catch (error) {
    errorMessage.value = error.message
    console.error(error)
  }
}

const { data, isError, fetchStatus, status } = useQuery({
  queryKey: ['authorData'],
  queryFn: fetchAuthorsData,
})

function onBack() {
  router.back()
}
</script>

<template>
  <div>
    <button
      class="rounded bg-pink-400 px-4 py-2 font-bold text-white hover:bg-pink-500"
      @click="onBack"
    >
      Back
    </button>
    <div class="flex items-center justify-center" v-if="fetchStatus === 'fetching' && !data">
      <div
        class="h-20 w-20 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"
      ></div>
    </div>
    <span v-else-if="isError" class="text-red-500">Error: {{ errorMessage }}</span>
    <table v-if="data" class="w-full table-auto border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2 text-left">#</th>
          <th class="border border-gray-300 px-4 py-2 text-left">First Name</th>
          <th class="border border-gray-300 px-4 py-2 text-left">Last Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(author, index) in data" :key="index">
          <td class="border border-gray-300 px-4 py-2">{{ index + 1 }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ author.firstName }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ author.lastName }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped></style>

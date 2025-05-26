<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { fetchAuthors, updateAuthor, deleteAuthor } from '../utilities/api/author/authorQuery.js'

const localAuthors = ref([])
const router = useRouter()

const { data, isError, fetchStatus, refetch: refetchAuthors } = fetchAuthors()

const { mutate: executeUpdateAuthor } = updateAuthor({onSuccess: refetchAuthors})
const { mutate: executeDeleteAuthor } = deleteAuthor({onSuccess: refetchAuthors})

const editingAuthorId = ref(null)

watch(
  () => data.value,
  (newVal) => {
    if (newVal) {
      localAuthors.value = JSON.parse(JSON.stringify(newVal))
    }
  },
  { immediate: true },
)

function editHandler(authorId) {
  editingAuthorId.value = authorId
}

function saveHandler(authorData) {
  executeUpdateAuthor(authorData)
  editingAuthorId.value = null
}

function deleteHandler(authorId) {
  localAuthors.value = localAuthors.value.filter((author) => author.id !== authorId)

  executeDeleteAuthor(authorId)
  editingAuthorId.value = null
}

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
    <div
      class="flex items-center justify-center"
      v-if="fetchStatus === 'fetching' && localAuthors.length === 0"
    >
      <div
        class="h-20 w-20 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"
      ></div>
    </div>
    <p v-else-if="isError" class="text-red-500">isError: {{ isError }}</p>
    <table v-if="localAuthors" class="w-full table-auto border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2 text-left">#</th>
          <th class="border border-gray-300 px-4 py-2 text-left">First Name</th>
          <th class="border border-gray-300 px-4 py-2 text-left">Last Name</th>
          <th class="border border-gray-300 px-4 py-2 text-left">Edit</th>
          <th class="border border-gray-300 px-4 py-2 text-left">Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="author in localAuthors" :key="author.id">
          <td class="border border-gray-300 px-4 py-2">{{ author.id + 1 }}</td>
          <td class="border border-gray-300 px-4 py-2">
            <input
              v-if="editingAuthorId === author.id"
              v-model="author.firstName"
              class="w-full rounded border border-gray-300 px-2 py-1"
            />
            <span v-else>{{ author.firstName }}</span>
          </td>
          <td class="border border-gray-300 px-4 py-2">
            <input
              v-if="editingAuthorId === author.id"
              v-model="author.lastName"
              class="w-full rounded border border-gray-300 px-2 py-1"
            />
            <span v-else>{{ author.lastName }}</span>
          </td>
          <td class="border border-gray-300 px-4 py-2">
            <button
              class="rounded-md p-1 text-blue-500 hover:text-blue-700"
              @click="editingAuthorId === author.id ? saveHandler(author) : editHandler(author.id)"
            >
              {{ editingAuthorId === author.id ? 'Save' : 'Edit' }}
            </button>
          </td>
          <td class="border border-gray-300 px-4 py-2">
            <button
              class="rounded-md p-1 text-red-500 hover:text-red-700"
              @click="deleteHandler(author.id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped></style>

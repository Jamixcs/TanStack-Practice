<script setup></script>

<template>
  <div class="flex flex-col gap-4 p-20">
    <RouterLink
      to="/authorList1"
      class="inline-block rounded bg-pink-400 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-pink-500"
      >Author List 1 - GET</RouterLink
    >
    <RouterLink
      to="/authorList2"
      class="inline-block rounded bg-pink-400 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-pink-500"
      >Author List 2 - GET, PUT, DELETE</RouterLink
    >
  </div>
</template>

<style lang="scss" scoped></style>

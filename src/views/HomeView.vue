<script setup></script>

<template>
  <div class="flex flex-col gap-4 p-20">
    <RouterLink
      to="/authorList1"
      class="inline-block rounded bg-pink-400 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-pink-500"
      >Author List 1（staleTime = 0）</RouterLink
    >
    <RouterLink
      to="/authorList2"
      class="inline-block rounded bg-pink-400 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-pink-500"
      >Author List 2（staleTime = 5000ms）</RouterLink
    >
    <RouterLink
      to="/authorList3"
      class="inline-block rounded bg-pink-400 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-pink-500"
      >Author List 3（staleTime = 0）</RouterLink
    >
  </div>
</template>

<style lang="scss" scoped></style>

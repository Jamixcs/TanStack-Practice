<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useQuery } from '@tanstack/vue-query'

const router = useRouter()
const errorMessage = ref(null)
const apiKey = import.meta.env.VITE_WEATHER_API_KEY

async function fetchWeatherData() {
  try {
    console.log('🔄  Page 1 >>>>>>>> fetchWeatherData called')
    const response = await axios.get(
      'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-077?limit=3',
      {
        params: {
          Authorization: apiKey,
        },
      },
    )
    console.log(response.data)
    return response.data
  } catch (error) {
    errorMessage.value = error.message
    console.error(error)
  }
}

const { data, isError, fetchStatus } = useQuery({
  queryKey: ['weatherData'],
  queryFn: fetchWeatherData,
  select: (data) => data.records.Locations[0],
  staleTime: 5 * 1000,
})

function onBack() {
  router.back()
}
</script>

<template>
  <div>
    <button @click="onBack">Back</button>
    <div class="flex justify-center items-center" v-if="fetchStatus === 'fetching'">
      <div
        class="w-20 h-20 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"
      ></div>
    </div>
    <span v-else-if="isError" class="text-red-500">Error: {{ errorMessage }}</span>
    <div v-else-if="data">
      <h1>{{ data.DatasetDescription }}</h1>
      <div v-for="(item, index) in data.Location" :key="index">
        <h2>{{ item.LocationName }}</h2>
        <pre>
 {{ item.WeatherElement[0].ElementName }}:{{
            item.WeatherElement[0].Time[0].ElementValue[0].Temperature
          }}</pre
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

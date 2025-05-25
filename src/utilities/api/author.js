import axios from 'axios'

export async function fetchAuthors() {
  try {
    console.log('fetchAuthorsData called')
    const response = await axios.get('https://fakerestapi.azurewebsites.net/api/v1/Authors')
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export async function updateAuthors(data) {
  try {
    console.log('updateAuthorsData called')
    const response = await axios.put(
      `https://fakerestapi.azurewebsites.net/api/v1/Authors/${data.id}`,
      data,
    )
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}
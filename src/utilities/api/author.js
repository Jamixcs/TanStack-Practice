import axios from 'axios'

export async function fetchAuthors() {
  try {
    console.log('fetchAuthors called')
    const response = await axios.get('https://fakerestapi.azurewebsites.net/api/v1/Authors')
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export async function updateAuthor(data) {
  try {
    console.log('updateAuthor called')
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

export async function deleteAuthor(id) {
  try {
    console.log('deleteAuthor called')
    const response = await axios.delete(
      `https://fakerestapi.azurewebsites.net/api/v1/Authors/${id}`
    )
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}
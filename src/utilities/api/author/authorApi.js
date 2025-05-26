import axios from 'axios'

export async function fetchAuthorsApi() {
  try {
    console.log('fetchAuthors called')
    const response = await axios.get('https://fakerestapi.azurewebsites.net/api/v1/Authors')
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export async function updateAuthorApi(data) {
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

export async function deleteAuthorApi(id) {
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

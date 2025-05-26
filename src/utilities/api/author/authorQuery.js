import {get, put, del} from '../vueQuery'
import { deleteAuthorApi, fetchAuthorsApi, updateAuthorApi } from '../author/authorApi.js'

export function fetchAuthors() {
  return get(['authorData'], fetchAuthorsApi)
}

export function updateAuthor(options) {
  return put((data) => updateAuthorApi(data), options)
}

export function deleteAuthor(options) {
  return del((id) => deleteAuthorApi(id), options)
}

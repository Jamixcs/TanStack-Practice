import { useQuery, useMutation } from '@tanstack/vue-query'

export function get(key, fn, optionParams) {
  return useQuery({
    queryKey: key,
    queryFn: fn,
    ...optionParams
  })
}

export function put(fn, optionParams) {
  return useMutation({
    mutationFn: (newData) => fn(newData),
    ...optionParams
  })
}

export function del(fn, optionParams) {
  return useMutation({
    mutationFn: (newData) => fn(newData),
    ...optionParams
  })
}


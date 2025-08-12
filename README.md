# TanStack Query (Vue Query) 核心概念與實踐指南

本指南旨在闡述 TanStack Query (Vue Query) 中 `useMutation` Hook 的核心設計哲學、工作原理及其在實際應用中的重要回呼函式。

---

## 一、`useMutation` 的設計哲學：操作的設定與執行分離

TanStack Query 的 `useMutation` Hook 採用了將資料變更操作的「設定」與「執行」階段分離的設計模式。這使得非同步操作的管理更加清晰、可控且具備高度可複用性。

### 1. 設定階段 (Configuration)

當開發者在組件中呼叫 `useMutation` Hook 時，例如：

```javascript
import { useMutation } from '@tanstack/vue-query'
import { updateAuthorApi } from './api/authorApi' // 假設這是實際執行 API 請求的函式

export const useUpdateAuthor = () => {
  return useMutation({
    mutationFn: updateAuthorApi, // 定義實際執行資料變更的函式
    // 其他選項，如 onSuccess, onError, onSettled 等
  })
}
```

在此階段，`useMutation` 並不會立即執行任何 API 請求。它僅是接收並儲存了操作的定義，包括：

- `mutationFn`：一個非同步函式，負責執行實際的資料變更邏輯 (例如發送 Axios 請求)。
- 各種生命週期回呼：如 `onSuccess`、`onError`、`onSettled`，用於定義操作成功、失敗或完成後的行為。

`useMutation` 會回傳一個包含操作狀態 (`isPending`, `isError`, `isSuccess`) 和一個核心觸發函式 (`mutate`) 的物件。

### 2. 執行階段 (Execution)

實際的資料變更操作是透過呼叫 `useMutation` 回傳的 `mutate` 函式來觸發的。例如：

```vue
<template>
  <button @click="handleUpdate">更新作者</button>
</template>

<script setup>
import { useUpdateAuthor } from './hooks/useUpdateAuthor' // 假設這是你的 useUpdateAuthor Hook

const { mutate: executeUpdateAuthor, isPending } = useUpdateAuthor()

const handleUpdate = () => {
  const authorData = { id: 1, name: '新作者名稱' }
  executeUpdateAuthor(authorData) // 在此時傳入操作所需的變數
}
</script>
```

當 `executeUpdateAuthor(authorData)` 被呼叫時，`mutate` 函式會將 `authorData` 作為參數，轉發給在設定階段定義的 `mutationFn` (`updateAuthorApi`)，從而觸發實際的 API 請求。

### 這種設計的優勢

- **自動化狀態管理**：`useMutation` 自動提供並管理操作的各種狀態 (如 `isPending`, `isError`)，無需手動維護。
- **高度可複用性**：操作邏輯被封裝在一個 Hook 中，可在應用程式的任何地方重複使用，保持行為一致性。
- **豐富的生命週期回呼**：提供多種回呼函式，方便處理操作前後、成功、失敗等不同階段的副作用。
- **開發者工具支援**：TanStack Query DevTools 能清晰地追蹤和監控每一次 `mutate` 操作的狀態和資料流。

---

## 二、`mutate` 函式的工作原理深度解析

`mutate` 函式是 `useMutation` Hook 的核心輸出之一，它扮演著觸發資料變更操作的關鍵角色。其工作原理基於 JavaScript 的閉包 (Closure) 特性。

1.  **`useMutation` 作為「函式工廠」**：

    - 當你呼叫 `useMutation` 時，它會接收你的配置 (包括 `mutationFn`)，並在內部將這些配置儲存起來。
    - 隨後，`useMutation` 會**產生**一個新的 `mutate` 函式並回傳給你。

2.  **`mutate` 函式是一個「閉包」**：
    - 這個由 `useMutation` 產生的 `mutate` 函式，會「記住」它被創建時所處的環境，特別是它所關聯的 `mutationFn`。
    - 當你呼叫 `mutate(variables)` 時，`mutate` 函式的內部邏輯會被觸發。它會取出它所「記住」的 `mutationFn`，並將你傳入的 `variables` **直接作為參數傳遞給那個 `mutationFn`**。

簡而言之，`mutate` 函式是一個預先配置好的觸發器。它知道要執行哪個 `mutationFn`，並負責將你傳入的資料正確地轉發給該函式。

---

## 三、利用 `onSuccess` 進行副作用處理與快取失效

`onSuccess` 是 `useMutation` Hook 提供的一個重要回呼選項，用於在資料變更操作成功完成後執行特定的邏輯。

### 1. 執行時機

- `onSuccess` 回呼函式會在 `mutationFn` 成功執行並回傳結果後被觸發。

### 2. 主要用途

`onSuccess` 的主要用途包括：

- **執行副作用**：例如顯示成功通知、導航到其他頁面、記錄日誌等。
- **快取失效 (Cache Invalidation)**：這是 TanStack Query 中非常關鍵的一個概念。當資料成功變更後，通常需要通知 Query Client，某些相關的查詢資料可能已經過時，需要重新獲取以保持 UI 的資料一致性。

### 3. `onSuccess` 函式接收的參數

`onSuccess` 回呼函式通常會接收到以下參數，以便開發者進行更精細的控制：

- `data`：`mutationFn` 成功回傳的資料。
- `variables`：你傳給 `mutate` 函式的參數 (即觸發操作時傳入的資料)。
- `context`：一個可選的上下文物件，通常用於在 `onMutate` 中傳遞資料。

### 範例：更新後重新獲取資料

```javascript
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { updateAuthorApi } from './api/authorApi'

export const useUpdateAuthor = () => {
  const queryClient = useQueryClient() // 取得 Query Client 實例

  return useMutation({
    mutationFn: updateAuthorApi,
    onSuccess: (data, variables) => {
      console.log('作者更新成功！回傳資料:', data, '更新變數:', variables)
      alert(`作者 ${variables.name} 已成功更新！`)

      // 觸發 'authors' 這個 Query Key 的快取失效，使其重新獲取最新資料
      queryClient.invalidateQueries({ queryKey: ['authors'] })

      // 或者，如果知道具體要更新的查詢，可以直接設定查詢資料
      // queryClient.setQueryData(['author', variables.id], data);
    },
    onError: (error) => {
      console.error('作者更新失敗！', error)
      alert('更新失敗，請稍後再試。')
    },
  })
}
```

透過 `onSuccess` 結合 `queryClient.invalidateQueries`，可以有效地管理應用程式的資料狀態，確保使用者介面始終顯示最新的資料。

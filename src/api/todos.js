async function request(baseUrl, path, options = {}) {
  const { body, headers = {}, ...rest } = options
  const hasBody = body !== undefined

  let response

  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...rest,
      ...(hasBody ? { body } : {}),
      headers: {
        ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
    })
  } catch {
    throw new Error('백엔드 서버에 연결할 수 없습니다.')
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || '요청에 실패했습니다.')
  }

  return data
}

export async function fetchTodos(baseUrl) {
  return request(baseUrl, '')
}

export async function createTodo(baseUrl, title) {
  return request(baseUrl, '', {
    method: 'POST',
    body: JSON.stringify({ title }),
  })
}

export async function updateTodo(baseUrl, id, title) {
  return request(baseUrl, `/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ title }),
  })
}

export async function deleteTodo(baseUrl, id) {
  return request(baseUrl, `/${id}`, { method: 'DELETE' })
}

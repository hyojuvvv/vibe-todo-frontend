import { useCallback, useEffect, useState } from 'react'
import { createTodo, deleteTodo, fetchTodos, updateTodo } from './api/todos'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function App() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const loadTodos = useCallback(async () => {
    if (!API_BASE_URL) {
      setError('API 주소가 설정되지 않았습니다. .env 파일을 확인해 주세요.')
      setLoading(false)
      return
    }

    setError('')
    setLoading(true)

    try {
      const data = await fetchTodos(API_BASE_URL)
      setTodos(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTodos()
  }, [loadTodos])

  async function withPending(action) {
    setError('')
    setPending(true)

    try {
      await action()
    } catch (err) {
      setError(err.message)
    } finally {
      setPending(false)
    }
  }

  function handleAdd(title) {
    return withPending(async () => {
      const todo = await createTodo(API_BASE_URL, title)
      setTodos((prev) => [todo, ...prev])
    })
  }

  function handleUpdate(id, title) {
    return withPending(async () => {
      const updated = await updateTodo(API_BASE_URL, id, title)
      setTodos((prev) => prev.map((todo) => (todo._id === id ? updated : todo)))
    })
  }

  function handleDelete(id) {
    return withPending(async () => {
      await deleteTodo(API_BASE_URL, id)
      setTodos((prev) => prev.filter((todo) => todo._id !== id))
    })
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>할 일 목록</h1>
          <p className="subtitle">오늘 해야 할 일을 관리하세요</p>
        </header>

        <main className="main">
          <TodoForm onAdd={handleAdd} disabled={pending} />

          {error && (
            <div className="alert alert-error" role="alert">
              <span>{error}</span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={loadTodos}>
                다시 시도
              </button>
            </div>
          )}

          {loading ? (
            <div className="loading">불러오는 중...</div>
          ) : (
            <>
              <p className="todo-count">
                총 <strong>{todos.length}</strong>개
              </p>
              <TodoList todos={todos} onUpdate={handleUpdate} onDelete={handleDelete} disabled={pending} />
            </>
          )}
        </main>
      </div>
    </div>
  )
}

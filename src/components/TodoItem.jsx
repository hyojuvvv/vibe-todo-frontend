import { useState } from 'react'

export default function TodoItem({ todo, onUpdate, onDelete, disabled }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)

  async function handleSave() {
    const trimmed = editTitle.trim()
    if (!trimmed || trimmed === todo.title) {
      setEditTitle(todo.title)
      setIsEditing(false)
      return
    }

    await onUpdate(todo._id, trimmed)
    setIsEditing(false)
  }

  function handleCancel() {
    setEditTitle(todo.title)
    setIsEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') handleCancel()
  }

  const createdAt = todo.createdAt
    ? new Date(todo.createdAt).toLocaleString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  return (
    <li className="todo-item">
      {isEditing ? (
        <div className="todo-edit">
          <input
            type="text"
            className="todo-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            disabled={disabled}
          />
          <div className="todo-actions">
            <button type="button" className="btn btn-primary btn-sm" onClick={handleSave} disabled={disabled}>
              저장
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleCancel} disabled={disabled}>
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="todo-content">
            <span className="todo-title">{todo.title}</span>
            {createdAt && <time className="todo-date">{createdAt}</time>}
          </div>
          <div className="todo-actions">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setIsEditing(true)}
              disabled={disabled}
            >
              수정
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(todo._id)}
              disabled={disabled}
            >
              삭제
            </button>
          </div>
        </>
      )}
    </li>
  )
}

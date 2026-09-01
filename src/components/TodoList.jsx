import TodoItem from './TodoItem'

export default function TodoList({ todos, onUpdate, onDelete, disabled }) {
  if (todos.length === 0) {
    return (
      <div className="todo-empty">
        <p>등록된 할 일이 없습니다.</p>
        <p className="todo-empty-hint">위 입력창에서 새 할 일을 추가해 보세요.</p>
      </div>
    )
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onUpdate={onUpdate}
          onDelete={onDelete}
          disabled={disabled}
        />
      ))}
    </ul>
  )
}

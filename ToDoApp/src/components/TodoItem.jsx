function TodoItem({ todo, deleteTodo}){
    return <>
   <div>
     <span>{todo.text}</span>
    <button onClick={()=> deleteTodo(todo.id)}>Delete</button>
   </div>
    </>

}
export default TodoItem;
import { useState } from "react";

function TodoInput({addTodo}){
    const [input,setInput]= useState("")
    const handleAdd=()=>{
        if (input.trim()==="")return;
        addTodo(input);
        setInput("");
    }
    return <>
    <div>
        <input value={input}
        onChange={(e)=>setInput(e.target.value)}
        placeholder="Enter task"
        />
        <button onClick={handleAdd}>ADD</button>
    </div>
    
    </>
}
export default TodoInput;
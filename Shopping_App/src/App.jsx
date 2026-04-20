import { useState } from "react"
import ProductCart from "./Components/ProductCart"
import Products from "./Pages/data"
import Cart from "./Components/Cart"

function App(){
  const [cart,setcart]= useState([])
  const addToCart=(product)=>{
    setcart([...cart,product])
  }
  const removeFromCart=(product)=>{
    setcart(cart.filter((item)=>item.id !== product))
  }
  return<>
  <h1>Shopping app</h1>
  <h2>Products</h2>
  {Products.map((product)=>(
    <ProductCart key={product.id} product={product} addToCart={addToCart}/>
  ))}
  <Cart Cart={cart} removeFromCart={removeFromCart}/>
  </>

}
export default App;
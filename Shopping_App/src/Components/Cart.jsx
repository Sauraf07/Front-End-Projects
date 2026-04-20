function Cart({Cart, removeFromCart}) {
    return<>
    <div>
        <h2>Cart</h2>
        {Cart.length === 0  && <p>Cart is empty</p>}
        {Cart.map((item)=>(
            <div key={item.id}>
                <p>{item.name}
                {item.price}
                </p>
                <button onClick={(e)=>removeFromCart(item.id)}>Remove</button>
            </div>
        ))}
    </div>
    </>
}
export default Cart;
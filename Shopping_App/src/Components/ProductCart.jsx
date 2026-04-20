function ProductCart({product, addToCart}) {
    return<>
    <div className="container-lg mt-2">
        <h3>{product.name}</h3>
        <p>{product.price}</p>

        <button onClick={()=>addToCart(product)}>Add To Cart </button>

    </div>
    </>
}
export default ProductCart;
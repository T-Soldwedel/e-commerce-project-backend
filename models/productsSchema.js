import mongoose from "mongoose"

const Schema = mongoose.Schema

const productSchema = new Schema({
    title: {type:String, required:true},
    img: {type:String, required:true},
    price: {type:Number, required:true}
});

const ProductsCollection = mongoose.model("products", productSchema)

export default ProductsCollection
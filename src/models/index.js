const Cart = require('./Cart')
const Category = require('./Category')
const Product = require('./Product')
const ProductImg = require('./Productimg')
const Purchase = require('./Purchase')
const User = require('./User')

Product.belongsTo(Category)
Category.hasMany(Product)

//cart --> uid
Cart.belongsTo(User)
User.hasMany(Cart)

//card --> pId
Cart.belongsTo(Product)
Product.hasMany(Cart)

//purchase --> uId
Purchase.belongsTo(User)
User.hasMany(Purchase)

//purchase --> pId
Purchase.belongsTo(Product)
Product.hasMany(Purchase)

//productImg --> pId
ProductImg.belongsTo(Product)
Product.hasMany(ProductImg)
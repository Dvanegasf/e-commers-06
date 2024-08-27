const catchError = require('../utils/catchError');
const Purchase = require('../models/Purchase');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

const getAll = catchError(async(req, res) => {
    const userId = req.user.id
    const results = await Purchase.findAll(
        {where : { userId },
        include: [
            {
                model: Product,
                attributes:{exclude:['createdAt','updatedAt']},
                include:[{
                    model: Category,
                    attributes:['name','id']
                }]
            }
        ],
        attributes:{exclude:['createdAt','updatedAt']},
    });
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const userId = req.user.id    
    
    const cart = await Cart.findAll({
        where:{ userId },
        raw: true,
        attributes:['quantity', 'userId', 'productId']
    })
    
    if(!cart) return res.sendStatus(404)

    const results = await Purchase.bulkCreate(cart)
    await Cart.destroy({where:{ userId }})
    return res.status(201).json(results)
});

module.exports = {
    getAll,
    create
}
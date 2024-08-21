const User = require('../../models/User')

const userCreate = async () => {

    const user = {
    firstName:"David",
    lastName:"vanegas",
    email:"david@gmail.com",
    password:"david123",
    phone:"+573002000540"
}

    await User.create(user)
}
module.exports = userCreate
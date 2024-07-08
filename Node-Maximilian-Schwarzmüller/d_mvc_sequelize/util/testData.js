

const Product = require('../models/product')
const User = require('../models/user')
const CartItem = require('../models/cart_item')

CartItem.findByPk(5)
.then(val => {console.log(val)})

// user_data = [
//     {
//         name:'john',
//         email:'john@gm.com'
//     },
    
//     {
//         name:'Ross',
//         email:'ross@gm.com'
//     },

// ]

// product_data = [{
//     title:'The Lost Bookshop',
//     imageUrl: 'https://m.media-amazon.com/images/I/91Kd+kTooAL._SL1500_.jpg',
//     description:'The Keeper of Stories meets The Lost Apothecary in this evocative and charming love story full of mystery and secrets. Gorgeous descriptions of Paris and Dublin transport you to another world - a book to truly escape into.',
//     price:284,
//     userId:2
// },
// {
//     title:'The Midnight Library',
//     imageUrl: 'https://m.media-amazon.com/images/I/81J6APjwxlL._SL1500_.jpg',
//     description:'Between life and death there is a library. When Nora seed finds herself in the midnight library, she has a chance to make things right. Up until now, her life has been full of misery and regret. She feels she has let everyone down, including herself. But things are about to change. The books in the midnight library enable Nora to live as if she had done things differently. With the help of an old friend, she can now undo every one of her regrets as she tries to work out her perfect life. ',
//     price:392,
//     userId:1
// },
// {
//     title:'The Book of Doors',
//     imageUrl: 'https://m.media-amazon.com/images/I/91ZjX0neGcL._SL1500_.jpg',
//     description:'New York bookseller Cassie Andrews is not sure what she’s doing with her life. She lives quietly, sharing an apartment with her best friend, Izzy. Then a favourite customer gives her an old book. Full of strange writing and mysterious drawings, at the very front there is a handwritten message:',
//     price:521,
//     userId:1
// }
// ]




// let promise_array = []
// for ( let  i of user_data){

//     const name = i.name;
//     const email = i.email;

//     promise_array.push(User.create({name,email}))
// }

// Promise.all(promise_array).then(()=>{
//     for ( let  i of product_data){
    
//         const title = i.title;
//         const imageUrl = i.imageUrl;
//         const price = i.price;
//         const description = i.description;
//         const userId = i.userId
    
//         Product.create({ userId, title, imageUrl, price, description })
//     }
// })



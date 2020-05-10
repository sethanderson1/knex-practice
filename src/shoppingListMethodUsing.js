require('dotenv').config()
const knex = require('knex')
const ShoppingListService = require('./shopping-list-service')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})

ShoppingListService.getAllItems(knexInstance)
  .then(items => console.log(items))


//   .then(() =>
//     ShoppingListService.insertArticle(knexInstance, {
//       title: 'New title',
//       content: 'New content',
//       date_published: new Date(),
//     })
//   )
//   .then(newArticle => {
//     console.log(newArticle)
//     return ShoppingListService.updateArticle(
//       knexInstance,
//       newArticle.id,
//       { title: 'Updated title' }
//     ).then(() => ShoppingListService.getById(knexInstance, newArticle.id))
//   })
//   .then(article => {
//     console.log(article)
//     return ShoppingListService.deleteArticle(knexInstance, article.id)
//   })
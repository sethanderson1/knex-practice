require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

// knexInstance.from('shopping_list').select('*')
//     .then(result => {
//         console.log(result)
//     })

// const qry = knexInstance
//     .select('product_id', 'name', 'price', 'category')
//     .from('amazong_products')
//     .where({ name: 'Point of view gun' })
//     .first()
//     .toQuery()
// // .then(result => {
// //     console.log(result)
// // })
// console.log(qry)

function searchByProduceName(searchTerm) {
    knexInstance
        .select('id', 'name', 'price', 'date_added', 'checked', 'category')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

// searchByProduceName('bacon')

function paginateProducts(page) {
    const productsPerPage = 6
    const offset = productsPerPage * (page - 1)
    knexInstance
        .select('id', 'name', 'price', 'date_added', 'checked', 'category')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}

// paginateProducts(2)

// function getProductsWithImages() {
//     knexInstance
//       .select('product_id', 'name', 'price', 'category', 'image')
//       .from('amazong_products')
//       .whereNotNull('image')
//       .then(result => {
//         console.log(result)
//       })
//   }

// //   getProductsWithImages()


  function resultsSinceXDaysAgo(days) {
    knexInstance
    .select('id', 'name', 'price','date_added', 'checked', 'category')
    // .count('date_added AS added')
      .where(
        'date_added',
        '>',
        knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
      )
      .from('shopping_list')
      .groupBy('name','id')
    //   .orderBy([
    //     { column: 'region', order: 'ASC' },
    //     { column: 'views', order: 'DESC' },
    //   ])
      .then(result => {
        console.log(result)
      })
  }

//   resultsSinceXDaysAgo(2)

function costPerCategory() {
    knexInstance
      .select('category')
      .sum('price AS total')
      .from('shopping_list')
      .groupBy('category')
      .then(result => {
        console.log('COST PER CATEGORY')
        console.log(result)
      })
  }
  
  costPerCategory()
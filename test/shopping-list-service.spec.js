const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Shopping service object`, function () {
    let db
    let testItems = [
        {
            id: 1,
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            name: 'First test post!',
            price: '1.20',
            checked: true,
            category: 'Lunch',

        },
        {
            id: 2,
            date_added: new Date('2100-05-22T16:28:32.615Z'),
            name: 'Second test post!',
            price: '12.20',
            checked: true,
            category: 'Snack',
        },
        {
            id: 3,
            date_added: new Date('1919-12-22T16:28:32.615Z'),
            name: 'Third test post!',
            price: '11.20',
            checked: true,
            category: 'Snack',
        },
    ]
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testItems)
        })
        it(`getAllItems() resolves all articles from 'shopping_list' table`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testItems)
                })
        })
        it(`getById() resolves an item by id from 'shopping_list' table`, () => {
            const idToGet = 1;
            const thirdItem = testItems[idToGet - 1];
            return ShoppingListService.getById(db, idToGet)
                .then(actual => {
                    expect(actual).to.eql({
                        id: idToGet,
                        name: thirdItem.name,
                        date_added: thirdItem.date_added,
                        price: thirdItem.price,
                        category: thirdItem.category,
                        checked: true,
                    });
                });
        });

        it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
            const idToDelete = 1;
            return ShoppingListService.deleteItem(db, idToDelete)
                .then(() => ShoppingListService.getAllItems(db))
                .then(allItems => {
                    // copy the test items array without the removed item
                    const expected = testItems
                        .filter(item => item.id !== idToDelete)
                        // .map(item => ({
                        //     ...item,
                        //     checked: true,
                        // }));
                    expect(allItems).to.eql(expected);
                });
        });

        it(`updateItem() updates an item in the 'shopping_list' table`, () => {
            const idOfItemToUpdate = 1;
            const newItemData = {
                name: 'updated title',
                price: '99.99',
                date_added: new Date(),
                checked: true,
            };
            const originalItem = testItems[idOfItemToUpdate - 1];
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        id: idOfItemToUpdate,
                        ...originalItem,
                        ...newItemData,
                    });
                });
        });
    });

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([]);
                });
        });

        it(`insertItem() inserts an item and resolves it with an 'id'`, () => {
            const newItem = {
                name: 'Test new name name',
                price: '5.05',
                date_added: new Date('2020-01-01T00:00:00.000Z'),
                checked: true,
                category: 'Lunch',
            };
            return ShoppingListService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newItem.name,
                        price: newItem.price,
                        date_added: newItem.date_added,
                        checked: newItem.checked,
                        category: newItem.category,
                    });
                });
        });
    });
})

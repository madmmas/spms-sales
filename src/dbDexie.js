// db.js
import Dexie from 'dexie';

const db = new Dexie('spms_org_test');

const initDB = async () => {
    await db.close();
    // if(db.open()){
    //     console.log("db is already open");
    //     return;
    // }
    await db.version(1).stores({
        products: 'id, &code, name, type, category_id, warehouse_id, brand_id, brand_name, model_id, model_no, part_number',
    });
    let tmp = db.products.orderBy('name').offset(0).limit(10).toArray();
    console.log(tmp);
};

const addProducts = (products) => {
    db.products.bulkPut(products);
};

const updateProduct = (product) => {
    db.products.put(product);
};

const getProducts = async (first, limit) => {
    // initDB();
    // if(db.open()){
    //     // console.log("db is already open");
    //     // initDB();
    //     // return db.products.orderBy('name').offset(first).limit(limit).toArray();
    // }
    let t = await Dexie.exists(db.products);
    console.log(t)
    return [];
};

const getProductById = (id) => {
    return db.products.get(id);
};

export default {
    initDB,
    addProducts,
    updateProduct,
    getProducts,
    getProductById,
};
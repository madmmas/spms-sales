import Dexie from 'dexie';

var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

// var open = indexedDB.open("spms_org_test", 1);

const db = new Dexie('spms_org_test');

const initDB = async () => {
    await db.close();
    await db.version(1).stores({
        products: 'id, &code, name, type, category_id, warehouse_id, brand_id, brand_name, model_id, model_no, part_number',
    });
    let tmp = await db.products.orderBy('name').offset(0).limit(10).toArray();
    console.log(tmp);
};

const getProducts = async (first, limit) => {
    let open = await db.open();
    console.log("version", open.verno);
    let tbls = await db.tables;
    console.log(tbls);
    let total = await db.table("products").count();
    let result = await db.table("products").orderBy('name').offset(first).limit(limit).toArray();
    // console.log(result);

    return [result, total];
}

const addProducts = async (products) => {
    let open = await db.open();
    // let products = JSON.parse(localStorage.getItem("products"));
    let result = await db.table("products").bulkPut(products);
    console.log(result);
};

export default {
    initDB,
    getProducts,
    addProducts,
};
const db = new PouchDB("items");
async function test() {
    console.log(await removeItem({_id: "test", itemInfo: "name"}, "test"));
    await addItem({_id: "test", itemInfo: "name"});
    console.log(await getAllItems("test"));
    await addItem({_id: "test", itemInfo: "name1"});
    await addItem({_id: "test", itemInfo: "name2"});
    console.log(await getAllItems("test"));
}

/** 
* @param {string} id of item
* @returns {object} Returns array of objects containing all items for a particular department
* 
*/
export async function getAllItems(id) {
    const result = [];
    try {
        const departments = await db.get(id);
        departments.value.forEach(element => {
            result.push(element);
        });
    }
    catch(e) {
        console.log(e);
    }
   return result;
}

export async function addItem(item) {
    try {
        const itemList = await db.get(item._id);
        await db.put({ _id: item._id, _rev: itemList._rev, value: itemList.value.concat([item])});
    }
    catch(e) {
        console.log(e);
        await db.put({_id: item._id, value: [item]});
    }
    return await getAllItems(item._id);
 }

/** 
* @param {object} item contains item information
* @returns {object} Returns array of object containing all department names
* 
*/

 export async function removeItem(item) {
    try {
        const itemList = await db.get(item._id);
        const arrayList = itemList.value;
        let index = arrayList.findIndex((e) => e["itemInfo"] === item["itemInfo"]);
        if (index != -1) {
            arrayList.splice(index, 1);
        }
        await db.put({_id: item._id, _rev: itemList._rev, value: arrayList});
    }
    catch(e) {
        console.log(e);
    }
    return await getAllItems(item._id);
 }

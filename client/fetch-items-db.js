/** 
* @param {string} id of item
* @returns {object} Returns array of objects containing all items for a particular department
* 
*/
export async function getAllItems(id) {
    try {
      const departments = await db.get(id);
      return departments.value;
    } catch (e) {
      console.error("Error occurred while retrieving items:", e);
      return [];
    }
  }

export async function addItem(item) {
    try {
        const itemList = await db.get(item._id);
        itemList.value.push(item);
        await db.put({ _id: item._id, _rev: itemList._rev, value: itemList.value });
      } catch (e) {
        console.error("Error occurred while adding item:", e);
        await db.put({ _id: item._id, value: [item] });
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
        await fetch(`/deleteItem/${item._id}`, {
            method: "DELETE",
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify(item),
        });
        return await getAllItems(item._id);
    }
    catch(e) {
        console.log(e);
        throw e; // Rethrow the error to propagate it to the caller
    }
}
const db = new PouchDB("storeDepartments");
async function test() {
    await removeDepartments("test")
    await getAllDepartments();
    await addDepartments("1");
    await addDepartments("2");
}

/** 
*
* @returns {object} Returns array of names containing all department names
* 
*/
export async function getAllDepartments() {
    const result = [];
    try {
        const departments = await db.get("departments");
        departments.value.forEach(element => {
            result.push(element);
        });
    }
    catch(e) {
        console.log(e);
    }
   return result;
}

/** 
*
* @returns {object} Returns array of names containing all department names
* 
*/
export async function addDepartments(name) {
    try {
        const departmentList = await db.get("departments");
        await db.put({ _id: "departments", _rev: departmentList._rev, value: departmentList.value.concat([name])});
    }
    catch(e) {
        console.log(e);
        await db.put({_id: "departments", value: [name]});
    }
    return await getAllDepartments();
 }

 export async function removeDepartments(name) {
    try {
        const departmentList = await db.get("departments");
        const arrayList = departmentList.value;
        let index = arrayList.indexOf(name);
        if (index != -1) {
            arrayList.splice(index, 1);
        }
        await db.put({_id: "departments", _rev: departmentList._rev, value: arrayList});
    }
    catch(e) {
        console.log(e);
    }
    return await getAllDepartments();
 }
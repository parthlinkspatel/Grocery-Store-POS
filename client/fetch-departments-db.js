/** 
*
* @returns {object} Returns array of names containing all department names
* 
*/
export async function getAllDepartments() {
    const result = [];
    try {
        let departments = await fetch("/getAllDepartments", {
            method: "GET",
        });
        departments = await departments.json();
    
        departments.forEach(element => {
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
        let departmentList = await fetch(`/addDepartment/${name}`, {
            method: "POST",
        }) 
    }
    catch(e) {
        console.log(e);
    }
    return await getAllDepartments();
 }

 export async function removeDepartments(name) {
    try {
        await fetch(`/deleteDepartment/${name}`, {
            method: "DELETE",
        });
    }
    catch(e) {
        console.log(e);
    }
    return await getAllDepartments();
 }
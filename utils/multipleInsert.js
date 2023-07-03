
const { addOneObj } = require("./singleInsert");

//values to add to my list

// my insert many function
const multipleInsert = async (collection, list1, list2) => {
    let myfinds;
    const objectList = addObj(list1, list2)

    const newNote = []
    for (i=0; i < list1.length; i++) {
        let note = `List of object having the following details: name: ${list1[i]}, age: ${list2[i]} is added to the document`

        newNote.push(note);
    }

    await collection.insertMany(objectList).then((result) => {
        myfinds = `${result} ${newNote}`
        console.log('Successful Insert of multiple items')
    }).catch((error) => {
        myfinds = error })
    // adding confirmation note

    return myfinds

}

//adding object to list
const listObj = []

const addObj = (title, value) => {
    for (i=0; i < title.length; i++) {
        let object = addOneObj(title[i], value[i])
        listObj.push(object);
    }
    return listObj
}

module.exports = multipleInsert;
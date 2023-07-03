


// my single insert function
const singleInsert = async (collection, title, value) => {

    let object =  addOneObj(title, value)
    let myfinds;
    // adding confirmation note
    const note = `Object with name: ${title} and age: ${value} is added to the document`

    await collection.insertOne(object).then((result)  => {
        myfinds = `${result} ${note}`
        console.log('Successful Find')
    }).catch((error) => {
        myfinds = error       
    })

    return myfinds
}


// create a single object
const addOneObj = (name, value) => {
    let newobj = 
    {
        name: name,
        age: value
    }

    return newobj
}

module.exports = {singleInsert, addOneObj}



// my single update function
const multipleUpdate = async (collection, condition, value) => {

    let filter = {completed: condition}
    let updateValue = {$set: {
        completed: value
    }}

    let myfinds;
    // adding confirmation note
    //const note = `Object with name: ${title} and age: ${value} is added to the document`

    await collection.updateMany(filter, updateValue).then((result)  => {
        myfinds = result
        console.log('Successful update')
    }).catch((error) => {
        myfinds = error       
    })

    return myfinds
}

module.exports = multipleUpdate
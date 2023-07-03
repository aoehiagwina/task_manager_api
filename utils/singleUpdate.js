


// my single update function
const singleUpdate = async (collection, condition, value) => {

    let filter = {_id: condition}
    let updateValue = {$set: {
        name: value
    }}

    let myfinds;
    // adding confirmation note
    //const note = `Object with name: ${title} and age: ${value} is added to the document`

    await collection.updateOne(filter, updateValue).then((result)  => {
        myfinds = result
        console.log('Successful update')
    }).catch((error) => {
        myfinds = error       
    })

    return myfinds
}

module.exports = singleUpdate
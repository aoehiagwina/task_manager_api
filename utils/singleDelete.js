// my single delete function
const singleDelete = async (collection, condition) => {

    let filter = {_id: condition}

    let myfinds;
    // adding confirmation note
    //const note = `Object with name: ${title} and age: ${value} is added to the document`

    await collection.deleteOne(filter).then((result)  => {
        myfinds = result
        console.log('Successfully deleted')
    }).catch((error) => {
        myfinds = error       
    })

    return myfinds
}

module.exports = singleDelete
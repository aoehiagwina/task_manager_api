


const multipleDelete = async (collection, condition) => {

    let filter = {name: condition}

    let myfinds;
    // adding confirmation note
    //const note = `Object with name: ${title} and age: ${value} is added to the document`

    await collection.deleteMany(filter).then((result)  => {
        myfinds = result
        console.log('Successfully deleted')
    }).catch((error) => {
        myfinds = error       
    })

    return myfinds
}

module.exports = multipleDelete
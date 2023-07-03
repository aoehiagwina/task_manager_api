



//my multiple find function
const multipleFinder = async (collection, value) => {

    //Example of using find
    const query = {completed: value};
    //return conditions: description and completed only
    const option = { projection: { _id: 0, description: 1, completed: 1 }}

    let myfinds;

    await collection.find(query, option).toArray().then((result)  => {
        console.log('Successful Find')
        myfinds = result
    }).catch((error) => {
        console.log('Error')
        myfinds = error
    })

    return myfinds


}

module.exports = multipleFinder
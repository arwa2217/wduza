export const removeSelectedCollectionClass = (className = ".collection-menu-wrapper") => {
    const allCollection =  document.querySelectorAll(className)
    if (allCollection.length){
        for (let i = 0; i < allCollection.length; i++) {
            const item = allCollection[i]
            item.classList.remove("selected")
        }
    }
}
export const addSelectedCollectionClass = (className = ".collection-menu-wrapper", collectionId) => {
    const currentCollection = document.querySelector(`${className}-${collectionId}`)
    if (currentCollection){
        currentCollection.classList.add("selected");
    }
}
export const getConstantNameById = (id, data) => {
    let item = data.find(item => item.id === id);
    return item ? item.name : '';
}
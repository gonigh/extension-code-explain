export const strToArray = (str: string): string[] => {
    let array: string[] = [];
    str = str.replace(/[\[\]']+/g, '');
    str.split(',').forEach(item=>{
        array.push(item.trim());
    });
    return array;
}
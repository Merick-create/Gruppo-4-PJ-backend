export class NotFoundError extends Error {
    constructor(){
        super('product not found');
    }
    
}
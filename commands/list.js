module.exports = {
    name: 'list',
    description: "sample command",
    execute(message, args){
        const id = message.author.id;
        return id;
    }
}
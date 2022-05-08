const mongoose = require('mongoose');

const trim = (content, beacon) => {
    const point = content.indexOf(beacon) + beacon.length + 1;
    const temp = content.slice(point, content.length);
    return temp;
}

const trimDesc = (content, beacon) => {
    const point = content.indexOf(beacon);
    const temp = content.slice(0, point);
    return temp;
}

const trimUser = (content, beacon) => {
    const point = content.indexOf(beacon);
    const temp = content.slice(point + 2, content.indexOf('>'));
    return temp;
}

const trimVal = (content, beacon) => {
    const point = content.indexOf(beacon);
    const temp = content.slice(point + 2, content.length);
    const tempNum = Number.parseInt(temp, 10);
    return tempNum;
}

const trimId = (content) => {
    const leftPoint = content.indexOf('s');
    const temp = content.slice(0, leftPoint);
    return temp;
}


module.exports = {
    name: 'pop',
    description: "sample command",
    execute(message, args){
        const full = trim(message.content, 'favor');
        const desc = trimDesc(full, '<@');
        const doneBy = message.author.id;
        const doneFor = trimUser(full, '<@');
        const value = trimVal(full, '>');

        console.log('FULL MESSAGE ' + full);

        console.log("Request from: " + message.channel.guild.name);
        if(doneFor === doneBy){
            message.channel.send('error');
        }
        else{
            message.channel.send("Favor Description: [" + desc + "]");
            message.channel.send("Favor From User With ID: [" + doneBy + "]");
            message.channel.send("Favor To User With ID: [" + doneFor + "]");
            message.channel.send("Favor Value: [" + value + "]");

        }

        const sampleFavor = {
            favID: mongoose.Types.ObjectId().toString(),
            desc: desc,
            doneBy: doneBy,
            doneFor: doneFor,
            value: value,
            status: false
        };

        return { sampleFavor, doneBy, doneFor};

    }
}

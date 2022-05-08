const Discord = require('discord.js');
const mongoose = require('mongoose');
//const morgan = require('morgan');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const dbURI = 'mongodb+srv://lotunKO:goodpass@dbotgl.ybgbj.mongodb.net/dbotgl?retryWrites=true&w=majority';
const dbCheRI = 'mongodb+srv://lotunKO:goodpass@dbotgl.ybgbj.mongodb.net/dbotgl?retryWrites=true&w=majority'

const Favor = require('./models/favor');
const Homie = require('./models/homie');

const create_favor = (data) => {
    const newFavor = new Favor(data);
    newFavor.save()
        .then((result) => {
            console.log(`added ${newFavor} to database`);
        })
        .catch((err) => {
            console.log(err);
        })
}

const create_homie = async (data) => {
    const newHomie = new Homie(data);
    await newHomie.save()
        .then((result) => {
            console.log(`added ${newHomie} to database`);
        })
        .catch((err) => {
            console.log(err);
        })
}

const get_user = async (id, message) => {
    const resp = client.users.fetch(id)
        .then((user) => {
            console.log(user.username);
            message.channel.send(`Username: ${user.username}`);
            return user.username;
        })
        .catch((err) => {
            console.log("FOUND ERROR: " + err);
        });
    //console.log("resp " + resp);
    return resp;
}

const handle_update = (id1, id2, fav, value, message) => {
    Homie.findOne({homieID: id1})
        .then((result) => {
            if(result === null){
                console.log("cant find homie");
                const userName = get_user(id1, message)
                    .then((user) => {
                        console.log("User 1: " + user);
                        const homieData = {
                            homieID: id1,
                            userName: user,
                            favorsOwed: [],
                            favorsDone: [],
                            bucks: 100 + value
                        };
                        homieData.favorsDone.push(fav);
                        create_homie(homieData);
                    })
                console.log('username: ' + userName);
               
            }
            else{
                console.log('homie successfully found');

                console.log("found: " + result);
                
                result.favorsDone.push(fav);

                result.bucks += value;

                console.log("new homie: " + result);

                result.save();
                    
            }
        })
    Homie.findOne({homieID: id2})
        .then((result) => {
            if(result === null){
                console.log("cant find homie");
                const userName = get_user(id2, message)
                .then((user) => {
                    console.log("User 2: " + user);
                    const homieData = {
                        homieID: id2,
                        userName: user,
                        favorsOwed: [],
                        favorsDone: [],
                        bucks: 100 - value
                    };
                    homieData.favorsOwed.push(fav);
                    create_homie(homieData);
                })
            }
            else{
                console.log('homie successfully found');

                console.log("found: " + result);
                
                result.favorsOwed.push(fav);

                result.bucks -= value;

                console.log("new homie: " + result);

                result.save();
                    
            }
        })
}

const find_favor = async (id) => {
    Favor.findOne({favID: id})
        .then((result) => {
            if(result === null){
                console.log("cant find favor");
            }
            else{
                console.log('favor successfully found');
                console.log(result);
                return result;
            }
        })
}

const list_favors = async(id, message) => {
    Favor.find({ })
        .then((data) =>{ 
            const newArray = data.filter((fav) => {
                return fav.doneBy == id;
            })
            console.log(newArray);
            message.channel.send('Listing all your favors: ');
            for(const fav of newArray){
                message.channel.send(`Favor: ${fav.desc}`);
            }
            return newArray;
        })
}

//mongo DB
mongoose.connect(dbCheRI)
    .then((result) => {
        console.log('CONNECTED TO MONGO DB');
        // app.listen(PORT, console.log(`Server is starting at port ${PORT}`));
    })
    .catch((err) => {
        console.log(err);
    })

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected!'); 
})

//client stuff
client.once('ready', () => {
    console.log('Good Looks Bot Active');
});

const prefix = '&';
const fs = require('fs');
const list = require('./commands/list');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter((file) => (
    file.endsWith('.js')
));

for(const file of commandFiles){
    const command = require(`./commands/${file}`); //get the module
    client.commands.set(command.name, command); //set the command to the module
}

//message stuff
client.on('messageCreate', message => {
    if(!message.content.startsWith(prefix) || message.author.bot){
        return;
    }
    
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    // console.log(command);

    if(command === 'favor'){
        const payload = client.commands.get('pop').execute(message, args);
        if(payload.doneBy === payload.doneFor){
            message.channel.send('cannot do a favor for yourself');
        }
        else{
            create_favor(payload.sampleFavor);
            handle_update(payload.doneBy, payload.doneFor, payload.sampleFavor.favID, payload.sampleFavor.value, message);
        }
    }
    else if(command === 'list'){
        const payload = client.commands.get('list').execute(message, args);
        list_favors(payload, message);
    }
    else{
        message.channel.send('offline');
    }

})


client.login('hold');

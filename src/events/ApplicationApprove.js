const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const settings = require('../../settings.json');
const promisedMySQL = require('../utils/promisedMySQL');

const setDisabled = (actionRow) => {
    const newRow = new MessageActionRow();
    
    actionRow.components.forEach(component => {
        const newComponent = component;
        newComponent.setDisabled(true);

        newRow.addComponents(newComponent);
    });

    return newRow;
};

module.exports = {
    eventName: "interactionCreate",
    run: async(client, interaction) => {
        if(interaction.isButton() && interaction.customId == "applicationapprove") {
            await interaction.update({ components: [ setDisabled(interaction.message.components[0]) ] });
            await interaction.followUp({ content: "Approved!", ephemeral: true });
            await interaction.message.edit({ components: [ setDisabled(interaction.message.components[0]) ] });

            const embed = new MessageEmbed();

            embed.setTitle("Looking for work!");
            embed.setThumbnail(interaction.message.embeds[0].author.iconURL);
            embed.setColor("#00ffbb");
            embed.setFooter({ text: "Please reach out to twitter.com/artchainlabs for any queries." });
            embed.setFields(
                interaction.message.embeds[0].fields
            );

            const mainLookingForWorkChannel = client.channels.cache.get(settings.mainguild_lookingforwork_channelid);
            mainLookingForWorkChannel.send({ embeds: [ embed ] }).catch((_error) => { console.warn("Couldn't send Job Listing in the mainguild_lookingforwork_channelid!") });
        }
    }
}
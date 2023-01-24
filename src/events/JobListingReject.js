const { MessageActionRow } = require('discord.js');

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
        if(interaction.isButton() && interaction.customId == "joblistingreject") {
            await interaction.update({ components: [ setDisabled(interaction.message.components[0]) ] });
            await interaction.followUp({ content: "Rejected!", ephemeral: true });

            interaction.guild.members.fetch(interaction.message.components[0].components[2].customId).then(member => {
                member.send("Your submission has been cancelled. Please try again.").catch((_error) => { });
            }).catch((_error) => { });
        }
    }
}
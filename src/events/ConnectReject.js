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
        if(interaction.isButton() && interaction.customId == "connectreject") {
            await interaction.update({ components: [ setDisabled(interaction.message.components[0]) ] });
            await interaction.followUp({ content: "Application Cancelled!", ephemeral: true });
        }
    }
}
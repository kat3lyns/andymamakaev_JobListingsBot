const { Modal, MessageActionRow, TextInputComponent } = require('discord.js');

const form = new Modal();

form.setCustomId("connectsubmit");
form.setTitle("Application Creation");
form.addComponents(
    new MessageActionRow().setComponents(
        new TextInputComponent()
            .setCustomId("name")
            .setLabel("Your Discord Username (Artchain#8211)")
            .setRequired(true)
            .setStyle("SHORT")),
    new MessageActionRow().setComponents(
        new TextInputComponent()
            .setCustomId("budget")
            .setLabel("Budget")
            .setRequired(true)
            .setStyle("SHORT")),
    new MessageActionRow().setComponents(
        new TextInputComponent()
            .setCustomId("refid")
            .setLabel("Listing's Reference ID")
            .setRequired(true)
            .setStyle("SHORT")),
    new MessageActionRow().setComponents(
        new TextInputComponent()
            .setCustomId("twitter")
            .setLabel("Twitter Username")
            .setRequired(true)
            .setStyle("SHORT")),
    new MessageActionRow().setComponents(
        new TextInputComponent()
            .setCustomId("requirements")
            .setLabel("Specific Requirements")
            .setRequired(true)
            .setStyle("PARAGRAPH"))
);

module.exports = {
    eventName: "interactionCreate",
    run: async(client, interaction) => {
        if(interaction.isButton() && interaction.customId == "connect") {
            await interaction.showModal(form);
        }
    }
}
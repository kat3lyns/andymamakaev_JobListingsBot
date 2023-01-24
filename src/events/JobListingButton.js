const { Modal, MessageActionRow, TextInputComponent } = require('discord.js');

const form = new Modal();

form.setCustomId("makejoblistingsubmit");
form.setTitle("Job Post Creation");
form.addComponents(
    new MessageActionRow().setComponents(
        new TextInputComponent()
            .setCustomId("link")
            .setLabel("Link to Portfolio")
            .setRequired(true)
            .setStyle("SHORT")),
    new MessageActionRow().setComponents(
        new TextInputComponent()
            .setCustomId("price")
            .setLabel("Price range (per hour)")
            .setRequired(true)
            .setStyle("SHORT")),
    new MessageActionRow().setComponents(
        new TextInputComponent()
            .setCustomId("freq")
            .setLabel("Payment Frequency (e.g Upfront/Installment)")
            .setRequired(true)
            .setStyle("SHORT")),
    new MessageActionRow().setComponents(
        new TextInputComponent()
            .setCustomId("avail")
            .setLabel("Availability")
            .setRequired(true)
            .setStyle("PARAGRAPH")),
    new MessageActionRow().setComponents(
        new TextInputComponent()
            .setCustomId("image")
            .setLabel("Image link (right-click image on Discord)")
            .setRequired(false)
            .setStyle("SHORT"))
);

module.exports = {
    eventName: "interactionCreate",
    run: async(client, interaction) => {
        if(interaction.isButton() && interaction.customId == "makejoblisting") {
            await interaction.showModal(form);
        }
    }
}
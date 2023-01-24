const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const settings = require('../../settings.json');
const promisedMySQL = require('../utils/promisedMySQL');

module.exports = {
    eventName: "interactionCreate",
    run: async(client, interaction) => {
        if(interaction.isModalSubmit() && interaction.customId == "connectsubmit") {
            await interaction.reply({ embeds: [
                new MessageEmbed()
                    .setColor("#00ffbb")
                    .setAuthor({ name: "Application Overview", iconURL: interaction.member.displayAvatarURL() })
                    .setFields([
                        { name: "👤 Discord Username", value: interaction.fields.getTextInputValue("name"), inline: false },
                        { name: "💸 Budget", value: interaction.fields.getTextInputValue("budget"), inline: false },
                        { name: "❓ Specific Requirements", value: interaction.fields.getTextInputValue("requirements"), inline: false },
                        { name: "🐦 Twitter", value: interaction.fields.getTextInputValue("twitter"), inline: false },
                        { name: "📜 Reference ID", value: interaction.fields.getTextInputValue("refid"), inline: false }
                    ])
            ], components: [
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId("connectaccept")
                        .setStyle("SUCCESS")
                        .setEmoji("👍")
                        .setLabel("Confirm"),
                    new MessageButton()
                        .setCustomId("connectreject")
                        .setStyle("DANGER")
                        .setEmoji("👎")
                        .setLabel("Cancel")
                )
            ], ephemeral: true });
        }
    }
}
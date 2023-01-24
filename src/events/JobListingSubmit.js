const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const settings = require('../../settings.json');
const promisedMySQL = require('../utils/promisedMySQL');

module.exports = {
    eventName: "interactionCreate",
    run: async(client, interaction) => {
        if(interaction.isModalSubmit() && interaction.customId == "makejoblistingsubmit") {
            await interaction.reply({ embeds: [
                new MessageEmbed()
                    .setColor("#00ffbb")
                    .setAuthor({ name: "Completed!", iconURL: interaction.member.displayAvatarURL() })
                    .setDescription(`Your profile has been sent to the Artchain team for review.`) 
            ], ephemeral: true });

            const embed = new MessageEmbed();
            const row = new MessageActionRow();

            embed.addField("🔗 Link to Portfolio", interaction.fields.getTextInputValue("link"));
            embed.addField("💰 Price range (per hour)", interaction.fields.getTextInputValue("price"));
            embed.addField("🔄 Payment Frequency", interaction.fields.getTextInputValue("freq"));
            embed.addField("✅ Availability", interaction.fields.getTextInputValue("avail"));

            embed.setColor("#00ffbb");
            if(interaction.fields.getTextInputValue("image")) embed.setImage(interaction.fields.getTextInputValue("image"));

            row.addComponents(
                new MessageButton()
                    .setCustomId("joblistingaccept")
                    .setEmoji("✅")
                    .setLabel("Approve")
                    .setStyle("SUCCESS"),
                new MessageButton()
                    .setCustomId("joblistingreject")
                    .setEmoji("❌")
                    .setLabel("Reject")
                    .setStyle("DANGER"),
                new MessageButton()
                    .setCustomId(interaction.member.id)
                    .setEmoji("📜")
                    .setLabel("Internal Information (Ignore)")
                    .setStyle("SECONDARY")
                    .setDisabled(true)
            );

            const mainPendingListingsChannel = client.channels.cache.get(settings.mainguild_pendinglistings_channelid);
            mainPendingListingsChannel.send({ embeds: [ embed ], components: [ row ] }).catch(async(_error) => {
                await interaction.followUp({ embeds: [
                    new MessageEmbed()
                        .setColor("#00ffbb")
                        .setAuthor({ name: "Error!", iconURL: interaction.member.displayAvatarURL() })
                        .setDescription(`The image link is invalid. Please use a discord cdn link instead.`)
                ], ephemeral: true });
            });
        }
    }
}
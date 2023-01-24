const { SlashCommandBuilder, SlashCommandChannelOption } = require("@discordjs/builders");
const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");
const settings = require('../../settings.json');
const promisedMySQL = require("../utils/promisedMySQL");

module.exports = {
    commandData: new SlashCommandBuilder()
    .setName("setuplistingsubmittions")
    .setDescription("Send the embed/button to create job listings.")
    .toJSON(),

    run: async(client, interaction) => {
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            return await interaction.reply({ embeds: [
                new MessageEmbed()
                    .setColor("#00ffbb")
                    .setAuthor({ name: "Lacking Permissions!", iconURL: interaction.member.displayAvatarURL() })
                    .setDescription(`Hey <@${interaction.member.id}>, sorry you are lacking the \`MANAGE_GUILD\` permission.`)
            ], ephemeral: true });
        } else {
            await interaction.channel.send({ embeds: [
                new MessageEmbed()
                    .setColor("#00ffbb")
                    .setTitle("Share your Profile!")
                    .setDescription("Searching for work in the Web3 space? Look no further. With Artchain, your profile will be shared across over +100 Web3 community discords. Quickly find a job by clicking below with Artchain. ")
                    .setFooter({ text: "Please reach out to Artchain#8211 for any queries." })
            ], components: [
                new MessageActionRow().setComponents(
                    new MessageButton()
                        .setCustomId("makejoblisting")
                        .setStyle("SUCCESS")
                        .setLabel("Click to get started")
                        .setEmoji("👆")
                )
            ] });

            await interaction.reply({ embeds: [
                new MessageEmbed()
                    .setColor("#00ffbb")
                    .setAuthor({ name: "Done!", iconURL: interaction.member.displayAvatarURL() })
                    .setDescription(`Sent the embed to this channel!`)
                    .setFields([
                        { name: "🤔 To remind you...", value: "This command doesn't remove the existing message! Make sure to delete it.", inline: false },
                    ])
            ], ephemeral: true });

        }
    }
}
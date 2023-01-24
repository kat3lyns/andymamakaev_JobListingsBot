const { SlashCommandBuilder, SlashCommandChannelOption } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");
const settings = require('../../settings.json');
const promisedMySQL = require("../utils/promisedMySQL");

module.exports = {
    commandData: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup the channels used by the Job Listings bot")
    .addChannelOption(new SlashCommandChannelOption()
        .setName("joblistings")
        .setDescription("The channel where job listings are sent to.")
        .setRequired(true)
    )
    .toJSON(),

    run: async(client, interaction) => {
        const jobListingsChannel = interaction.options.getChannel("joblistings");

        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            return await interaction.reply({ embeds: [
                new MessageEmbed()
                    .setColor("#00ffbb")
                    .setAuthor({ name: "Lacking Permissions!", iconURL: interaction.member.displayAvatarURL() })
                    .setDescription(`Hey <@${interaction.member.id}>, sorry you are lacking the \`MANAGE_GUILD\` permission.`)
            ], ephemeral: true });
        } else if(!jobListingsChannel.isText()) {
            return await interaction.reply({ embeds: [
                new MessageEmbed()
                    .setColor("#00ffbb")
                    .setAuthor({ name: "Invalid Channels!", iconURL: interaction.member.displayAvatarURL() })
                    .setDescription(`Hey <@${interaction.member.id}>, sorry but I couldn't set your server's setup to these channels! Please make sure that you fill the command arguments with text channels.`)
                    .setFields([
                        { name: "📰 Job Listings", value: `\`${jobListingsChannel.type}\``, inline: true },
                    ])
            ], ephemeral: true });
        } else if(interaction.guild.id == settings.mainguild_id) {
            return await interaction.reply({ embeds: [
                new MessageEmbed()
                    .setColor("#00ffbb")
                    .setAuthor({ name: "Unavailable in Main Server!", iconURL: interaction.member.displayAvatarURL() })
                    .setDescription(`Hey <@${interaction.member.id}>, sorry but you can't use this command in the main server!`)
            ], ephemeral: true });
        } else {
            await interaction.reply({ embeds: [
                new MessageEmbed()
                    .setColor("#00ffbb")
                    .setAuthor({ name: "Setting up...", iconURL: interaction.member.displayAvatarURL() })
                    .setDescription(`I am uploading your new setup information onto MySQL.`)
            ], ephemeral: true });

            await promisedMySQL(`DELETE FROM setup WHERE server_id = "${interaction.guild.id}"`);
            await promisedMySQL(`INSERT INTO setup (server_id, joblistings)
                VALUES (
                    "${interaction.guild.id}",
                    "${jobListingsChannel.id}"
                )
            `);

            await interaction.editReply({ embeds: [
                new MessageEmbed()
                    .setColor("#00ffbb")
                    .setAuthor({ name: "Finished!", iconURL: interaction.member.displayAvatarURL() })
                    .setDescription(`Done! I updated the MySQL database with these channels.`)
                    .setFields([
                        { name: "📰 Job Listings", value: `<#${jobListingsChannel.id}>`, inline: true },
                        { name: "📰 Looking For Jobs", value: `<#${lookingForWorkChannel.id}>`, inline: true },
                        { name: "🤔 Looks wrong?", value: `All good! Just rerun the command \`/setup\` again.`, inline: false },
                    ])
            ], ephemeral: true });
        }
    }
}
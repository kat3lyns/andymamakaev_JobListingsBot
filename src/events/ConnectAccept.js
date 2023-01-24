const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const settings = require('../../settings.json');

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
        if(interaction.isButton() && interaction.customId == "connectaccept") {
            await interaction.update({ components: [ setDisabled(interaction.message.components[0]) ] });
            const applicationsLogChannel = await client.channels.fetch(settings.mainguild_pendingapps_channelid).catch((_error) => { return null });
            if(!applicationsLogChannel) {
                await interaction.followUp({ embeds: [
                    new MessageEmbed()
                        .setColor("#00ffbb")
                        .setAuthor({ name: "Unable to process your application!", iconURL: interaction.member.displayAvatarURL() })
                        .setDescription(`I am sorry, but I am unable to send your application to our admins to review. Please tell the admins to ensure that \`mainguild_joblistings\` is filled in properly!`)
                ], ephemeral: true });
            } else {
                await interaction.followUp({ embeds: [
                    new MessageEmbed()
                        .setColor("#00ffbb")
                        .setAuthor({ name: "Application Sent!", iconURL: interaction.member.displayAvatarURL() })
                        .setDescription(`Your application has been sent for review. Please look out for your friend requests. If accepted by the artist, you will be added by Artchain#8211 or messaged directly via Twitter.`)
                ], ephemeral: true });

                const embed = interaction.message.embeds[0];
                const row = new MessageActionRow();

                embed.description = "A new application just came in!";
                embed.setAuthor({ name: "New Application", iconURL: interaction.member.displayAvatarURL() });

                row.addComponents(
                    new MessageButton()
                        .setCustomId("applicationapprove")
                        .setEmoji("✅")
                        .setLabel("Approve")
                        .setStyle("SUCCESS")
                );

                await applicationsLogChannel.send({ embeds: [ embed ], components: [ row ] });
            }
        }
    }
}
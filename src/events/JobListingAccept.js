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
        if(interaction.isButton() && interaction.customId == "joblistingaccept") {
            await interaction.update({ components: [ setDisabled(interaction.message.components[0]) ] });
            await interaction.followUp({ content: "Approved!", ephemeral: true });
            interaction.guild.members.fetch(interaction.message.components[0].components[2].customId).then(member => {
                member.send("Your submission has been approved. Your profile will be shared across our partnered servers.").catch((_error) => { });
            }).catch((_error) => { });

            await promisedMySQL(`INSERT INTO ref (id)
                VALUES (
                    NULL
                )
            `);

            let refId = await promisedMySQL(`SELECT * FROM ref`);
            refId = refId.length;

            const embed = interaction.message.embeds[0];
            const row = new MessageActionRow();

            embed.title = `Reference ID: ${refId}`;
            embed.setColor("#00ffbb");
            embed.setFooter({ text: "Please reach out to twitter.com/artchainlabs for any queries." });

            row.addComponents(
                new MessageButton()
                    .setCustomId("connect")
                    .setEmoji("🤝")
                    .setLabel("Connect")
                    .setStyle("SUCCESS")
            );

            const mainJobListingsChannel = client.channels.cache.get(settings.mainguild_joblistings_channelid);
            const success = mainJobListingsChannel.send({ embeds: [ embed ], components: [ row ] }).catch(async(_error) => {
                await interaction.followUp({ embeds: [
                    new MessageEmbed()
                        .setColor("#00ffbb")
                        .setAuthor({ name: "Error!", iconURL: interaction.member.displayAvatarURL() })
                        .setDescription(`I couldn't post the job listing!`)
                        .setFields([
                            { name: "🤔 Why?", value: "The image link isn't a discord cdn link, I can't use it!", inline: false },
                        ])
                ], ephemeral: true });
                
                return false;
            });
            
            if(!success) return;
            const allData = await promisedMySQL(`SELECT joblistings FROM setup`);
            allData.forEach(async(data) => {
                const channel = await client.channels.fetch(data.joblistings).catch(async(_error) => {
                    await promisedMySQL(`DELETE FROM setup WHERE joblistings = "${data.joblistings}"`)
                });

                if(channel) await channel.send({ embeds: [ embed ], components: [ row ] });
            })
        }
    }
}
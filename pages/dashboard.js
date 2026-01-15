const { 
  Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, 
  StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits 
} = require('discord.js');
const mongoose = require('mongoose');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildMembers
  ]
});

process.on('unhandledRejection', error => console.error('Error:', error.message));

mongoose.connect(process.env.MONGO_URI);

const Setting = mongoose.model('Setting', new mongoose.Schema({
  guildId: { type: String, default: 'default' },
  // التذاكر
  ticketCategory: String, ticketSupportRole: String, logChannel: String,
  infoTitle: { type: String, default: 'مركز الدعم' },
  infoDescription: { type: String, default: 'يرجى اختيار القسم المناسب' },
  infoImage: String, ticketReasons: { type: Array, default: ["دعم", "شكوى"] },
  // الرسائل
  msgWelcome: { type: String, default: 'مرحباً {user}، القسم: {reason}' },
  msgClaim: { type: String, default: '✅ استلمها الإداري: {admin}' },
  msgUnclaim: { type: String, default: '⚠️ تم ترك التذكرة وهي متاحة.' },
  msgClose: { type: String, default: 'هل أنت متأكد من الإغلاق؟' },
  // الميزات القديمة
  antiLink: { type: Boolean, default: false },
  youtubeChannel: String, welcomeChannel: String
}));

const parseMsg = (str, user, admin, reason) => {
  return str.replace(/{user}/g, user || '').replace(/{admin}/g, admin || '').replace(/{reason}/g, reason || '');
};

client.once('ready', () => console.log(`✅ البوت المتكامل جاهز: ${client.user.tag}`));

// --- نظام الحماية واليوتيوب ---
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;
  const s = await Setting.findOne({ guildId: 'default' });

  if (s?.antiLink && message.content.includes('http') && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
    await message.delete().catch(() => {});
    return message.channel.send(`${message.author}, الروابط ممنوعة!`).then(m => setTimeout(() => m.delete(), 3000));
  }

  if (s?.youtubeChannel && message.channel.id === s.youtubeChannel && message.content.includes('youtube.com')) {
    message.reply("شكراً لمشاركة الفيديو!");
  }

  if (message.content === '#setup-tickets' && message.member.permissions.has(PermissionFlagsBits.Administrator)) {
    const embed = new EmbedBuilder().setTitle(s?.infoTitle).setDescription(s?.infoDescription).setColor("#5865f2");
    if (s?.infoImage) embed.setImage(s.infoImage);
    const select = new StringSelectMenuBuilder().setCustomId('ticket_select').setPlaceholder('اختر القسم...')
      .addOptions((s?.ticketReasons || ["دعم"]).map(r => ({ label: r, value: r })));
    message.channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(select)] });
  }
});

// --- نظام التفاعل (تذاكر) ---
client.on('interactionCreate', async (i) => {
  if (!i.isButton() && !i.isStringSelectMenu()) return;
  const s = await Setting.findOne({ guildId: 'default' });
  const supportRole = s?.ticketSupportRole;

  if (i.customId === 'ticket_select') {
    const hasTicket = i.guild.channels.cache.find(ch => ch.name === `ticket-${i.user.username.toLowerCase()}`);
    if (hasTicket) return i.reply({ content: `⚠️ لديك تذكرة بالفعل`, ephemeral: true });

    const channel = await i.guild.channels.create({
      name: `ticket-${i.user.username.toLowerCase()}`,
      parent: s?.ticketCategory || null,
      permissionOverwrites: [
        { id: i.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: i.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        ...(supportRole ? [{ id: supportRole, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }] : [])
      ]
    });

    const embed = new EmbedBuilder()
      .setDescription(parseMsg(s.msgWelcome, i.user, null, i.values[0]))
      .setFooter({ text: `OwnerID: ${i.user.id}` }).setColor("#5865f2");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('claim_ticket').setLabel('استلام').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('close_request').setLabel('إغلاق').setStyle(ButtonStyle.Danger)
    );

    await channel.send({ embeds: [embed], components: [row] });
    await channel.send({ content: `🔔 <@&${supportRole}> | تذكرة جديدة بانتظاركم!` });
    await i.reply({ content: `✅ فتحت: ${channel}`, ephemeral: true });
  }

  if (i.customId === 'claim_ticket') {
    if (!i.member.roles.cache.has(supportRole)) return i.reply({ content: "للدعم فقط", ephemeral: true });
    
    const oldEmbed = i.message.embeds[0];
    const ownerId = oldEmbed.footer.text.split(': ')[1];
    const owner = await client.users.fetch(ownerId).catch(() => null);

    await i.channel.permissionOverwrites.edit(supportRole, { SendMessages: false });
    await i.channel.permissionOverwrites.edit(i.user.id, { SendMessages: true, ViewChannel: true });

    const claimEmbed = EmbedBuilder.from(oldEmbed).setColor("#23a559").setTitle("تم الاستلام")
      .setDescription(parseMsg(s.msgClaim, owner, i.user)).addFields({ name: "المستلم", value: `${i.user.tag}`, inline: true });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('unclaim_ticket').setLabel('ترك').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('close_request').setLabel('إغلاق').setStyle(ButtonStyle.Danger)
    );
    await i.update({ embeds: [claimEmbed], components: [row] });
  }

  if (i.customId === 'unclaim_ticket') {
    const oldEmbed = i.message.embeds[0];
    const claimerTag = oldEmbed.fields.find(f => f.name === "المستلم")?.value;
    if (i.user.tag !== claimerTag && !i.member.permissions.has(PermissionFlagsBits.Administrator)) return i.reply({ content: "لست المستلم", ephemeral: true });

    const ownerId = oldEmbed.footer.text.split(': ')[1];
    const owner = await client.users.fetch(ownerId);

    await i.channel.permissionOverwrites.delete(i.user.id);
    await i.channel.permissionOverwrites.edit(supportRole, { SendMessages: true });

    const unclaimEmbed = new EmbedBuilder().setDescription(parseMsg(s.msgUnclaim, owner))
      .setFooter({ text: `OwnerID: ${ownerId}` }).setColor("#5865f2");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('claim_ticket').setLabel('استلام').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('close_request').setLabel('إغلاق').setStyle(ButtonStyle.Danger)
    );
    await i.update({ embeds: [unclaimEmbed], components: [row] });
    await i.channel.send(`<@&${supportRole}> | التذكرة متاحة.`);
  }

  if (i.customId === 'close_request') {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('confirm_close').setLabel('تأكيد').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('cancel_close').setLabel('تراجع').setStyle(ButtonStyle.Secondary)
    );
    await i.reply({ content: s.msgClose, components: [row] });
  }

  if (i.customId === 'confirm_close') {
    await i.reply('📦 جاري الأرشفة...');
    const messages = await i.channel.messages.fetch({ limit: 100 });
    let transcript = "\ufeff" + `سجل: ${i.channel.name}\n\n`;
    messages.reverse().forEach(m => { transcript += `[${m.createdAt.toLocaleString('ar-EG')}] ${m.author.tag}: ${m.content}\n`; });
    if (s?.logChannel) {
      const logCh = i.guild.channels.cache.get(s.logChannel);
      if (logCh) await logCh.send({ files: [{ attachment: Buffer.from(transcript, 'utf-8'), name: `transcript.txt` }] });
    }
    setTimeout(() => i.channel.delete().catch(() => {}), 2000);
  }
});

client.login(process.env.TOKEN);

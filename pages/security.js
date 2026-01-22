import mongoose from 'mongoose';

const SecuritySchema = new mongoose.Schema({
  guildId: { type: String, default: 'default' },
  antiBot: Boolean, antiLink: Boolean, antiInvite: Boolean, antiSpam: Boolean
});

const Security = mongoose.models.Security || mongoose.model('Security', SecuritySchema);

export default async function handler(req, res) {
  await mongoose.connect(process.env.MONGO_URI);
  if (req.method === 'POST') {
    await Security.findOneAndUpdate({ guildId: 'default' }, req.body, { upsert: true });
    return res.status(200).json({ success: true });
  }
  const data = await Security.findOne({ guildId: 'default' });
  res.status(200).json(data || {});
}

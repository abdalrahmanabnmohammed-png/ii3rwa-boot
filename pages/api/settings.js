import mongoose from 'mongoose';
const Setting = mongoose.models.Setting || mongoose.model('Setting', new mongoose.Schema({
  guildId: String, infoTitle: String, infoDescription: String, ticketReasons: Array, ticketCategory: String, ticketSupportRole: String, antiLink: Boolean
}));

export default async function handler(req, res) {
  await mongoose.connect(process.env.MONGO_URI);
  if (req.method === 'POST') {
    await Setting.findOneAndUpdate({ guildId: 'default' }, req.body, { upsert: true });
    return res.status(200).json({ success: true });
  }
  const settings = await Setting.findOne({ guildId: 'default' });
  res.status(200).json(settings || {});
}

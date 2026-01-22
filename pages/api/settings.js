import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  guildId: { type: String, default: 'default' }
});

const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);

export default async function handler(req, res) {
  await mongoose.connect(process.env.MONGO_URI);
  if (req.method === 'POST') {
    await Setting.findOneAndUpdate({ guildId: 'default' }, req.body, { upsert: true });
    return res.status(200).json({ success: true });
  }
  const s = await Setting.findOne({ guildId: 'default' });
  res.status(200).json(s || {});
}

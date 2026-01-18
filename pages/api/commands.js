import mongoose from 'mongoose';

const CommandSchema = new mongoose.Schema({
  guildId: { type: String, default: 'default' },
  clearName: String,
  banName: String,
  unbanName: String,
  muteName: String,
  banReasons: { type: Array, default: [] }
});

const CommandModel = mongoose.models.Command || mongoose.model('Command', CommandSchema);

export default async function handler(req, res) {
  await mongoose.connect(process.env.MONGO_URI);
  if (req.method === 'POST') {
    await CommandModel.findOneAndUpdate({ guildId: 'default' }, req.body, { upsert: true });
    return res.status(200).json({ success: true });
  }
  const data = await CommandModel.findOne({ guildId: 'default' });
  res.status(200).json(data || { banReasons: [] });
}

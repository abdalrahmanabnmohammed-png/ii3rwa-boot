import dbConnect from '../../lib/mongodb';
import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  guildId: { type: String, default: 'default' },
  infoTitle: String, infoDescription: String, infoImage: String, infoThumbnail: String, infoColor: String,
  ticketCategory: String, ticketSupportRole: String, ticketReasons: Array
});

const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'POST') {
    await Setting.findOneAndUpdate({ guildId: 'default' }, req.body, { upsert: true });
    return res.status(200).json({ success: true });
  }
  const settings = await Setting.findOne({ guildId: 'default' });
  res.status(200).json(settings || {});
}

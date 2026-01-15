import dbConnect from '../../lib/mongodb';
import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  guildId: { type: String, default: 'default' },
  ticketCategory: String,
  ticketSupportRole: String,
  ticketTitle: String,
  ticketDescription: String,
  ticketColor: String,
  ticketReasons: Array // تخزين الأسباب كمصفوفة
});

const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'POST') {
    const updated = await Setting.findOneAndUpdate({ guildId: 'default' }, req.body, { upsert: true, new: true });
    return res.status(200).json(updated);
  }
  const settings = await Setting.findOne({ guildId: 'default' });
  res.status(200).json(settings || {});
}

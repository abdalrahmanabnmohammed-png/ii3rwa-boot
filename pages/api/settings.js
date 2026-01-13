dbConnect();
import dbConnect from '../../lib/mongodb';
import mongoose from 'mongoose';

// تعريف شكل البيانات (Schema)
const SettingSchema = new mongoose.Schema({
  guildId: String,
  youtubeChannelId: String,
  antiLinks: Boolean,
});

const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { youtubeId, antiLinks } = req.body;
    // حفظ البيانات (سنثبت الـ ID حالياً للسيرفر الخاص بك)
    await Setting.findOneAndUpdate(
      { guildId: 'default' }, 
      { youtubeChannelId: youtubeId, antiLinks: antiLinks },
      { upsert: true }
    );
    return res.status(200).json({ message: 'تم الحفظ بنجاح' });
  }
  
  const settings = await Setting.findOne({ guildId: 'default' });
  res.status(200).json(settings);
}

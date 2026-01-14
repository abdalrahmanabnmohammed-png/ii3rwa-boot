import dbConnect from '../../lib/mongodb';
import mongoose from 'mongoose';

// تعريف "شكل" البيانات الموسع ليدعم مميزات البريميوم
const SettingSchema = new mongoose.Schema({
  guildId: { type: String, default: 'default' },
  youtubeChannelId: String,
  antiLinks: Boolean,
  welcomeMsg: String,
  welcomeChannel: String,
  logChannel: String,
});

// منع إعادة تعريف الموديل إذا كان موجوداً مسبقاً
const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);

export default async function handler(req, res) {
  await dbConnect();

  // عند الضغط على زر "حفظ التغييرات" في اللوحة
  if (req.method === 'POST') {
    try {
      const { youtubeId, antiLinks, welcomeMsg, welcomeChannel, logChannel } = req.body;
      
      const updatedSettings = await Setting.findOneAndUpdate(
        { guildId: 'default' },
        { 
          youtubeChannelId: youtubeId, 
          antiLinks: antiLinks,
          welcomeMsg: welcomeMsg,
          welcomeChannel: welcomeChannel,
          logChannel: logChannel
        },
        { upsert: true, new: true } // إنشاء إعدادات جديدة إذا لم تكن موجودة
      );

      return res.status(200).json({ message: 'تم الحفظ بنجاح', data: updatedSettings });
    } catch (error) {
      return res.status(500).json({ message: 'خطأ في الحفظ', error: error.message });
    }
  }

  // عند فتح الصفحة لجلب البيانات الحالية
  if (req.method === 'GET') {
    try {
      const settings = await Setting.findOne({ guildId: 'default' });
      return res.status(200).json(settings || {});
    } catch (error) {
      return res.status(500).json({ message: 'خطأ في جلب البيانات' });
    }
  }
}

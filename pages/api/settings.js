import dbConnect from '../../lib/mongodb';
import mongoose from 'mongoose';

// تعريف المخطط ليشمل كل الميزات (القديمة والجديدة)
const SettingSchema = new mongoose.Schema({
  guildId: { type: String, default: 'default' },
  
  // إعدادات مظهر التذاكر
  infoTitle: { type: String, default: 'مركز الدعم' },
  infoDescription: { type: String, default: 'يرجى اختيار القسم المناسب' },
  infoImage: { type: String, default: '' },
  infoColor: { type: String, default: '#5865f2' },
  
  // إعدادات المعرفات (IDs)
  ticketCategory: { type: String, default: '' },
  ticketSupportRole: { type: String, default: '' },
  logChannel: { type: String, default: '' },
  welcomeChannel: { type: String, default: '' },
  youtubeChannel: { type: String, default: '' },
  
  // إعدادات الأقسام والحماية
  ticketReasons: { type: Array, default: [] },
  antiLink: { type: Boolean, default: false },
  
  // تخصيص رسائل الإيمبد داخل التذكرة
  msgWelcome: { type: String, default: '' },
  msgClaim: { type: String, default: '' },
  msgUnclaim: { type: String, default: '' },
  msgClose: { type: String, default: 'هل أنت متأكد من إغلاق التذكرة؟' }
});

// التأكد من عدم إعادة تعريف الموديل إذا كان موجوداً مسبقاً
const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      // تحديث البيانات أو إنشاؤها إذا لم تكن موجودة
      const updatedSettings = await Setting.findOneAndUpdate(
        { guildId: 'default' },
        { $set: req.body }, // استخدام $set لتحديث الحقول المرسلة فقط
        { upsert: true, new: true, runValidators: true }
      );
      return res.status(200).json(updatedSettings);
    } catch (error) {
      console.error("Error saving settings:", error);
      return res.status(500).json({ error: "فشل في حفظ الإعدادات" });
    }
  }

  if (req.method === 'GET') {
    try {
      const settings = await Setting.findOne({ guildId: 'default' });
      return res.status(200).json(settings || {});
    } catch (error) {
      return res.status(500).json({ error: "فشل في جلب الإعدادات" });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

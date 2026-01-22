import mongoose from 'mongoose';

// تعريف شكل البيانات في قاعدة البيانات
const SecuritySchema = new mongoose.Schema({
  guildId: { type: String, default: 'default' },
  antiBot: Boolean,
  antiLink: Boolean,
  antiInvite: Boolean,
  antiSpam: Boolean
});

const Security = mongoose.models.Security || mongoose.model('Security', SecuritySchema);

export default async function handler(req, res) {
  // الاتصال بقاعدة البيانات باستخدام الرابط الخاص بك
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  if (req.method === 'POST') {
    // حفظ الإعدادات عند الضغط على زر حفظ في الموقع
    await Security.findOneAndUpdate({ guildId: 'default' }, req.body, { upsert: true });
    return res.status(200).json({ success: true });
  }

  // جلب الإعدادات لعرضها في الموقع
  const data = await Security.findOne({ guildId: 'default' });
  res.status(200).json(data || {});
}

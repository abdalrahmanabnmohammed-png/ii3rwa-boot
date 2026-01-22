import mongoose from 'mongoose';

// تعريف السكيما
const SecuritySchema = new mongoose.Schema({
  guildId: { type: String, default: 'default' },
  antiBot: { type: Boolean, default: false },
  antiLink: { type: Boolean, default: false },
  antiInvite: { type: Boolean, default: false },
  antiSpam: { type: Boolean, default: false }
});

const Security = mongoose.models.Security || mongoose.model('Security', SecuritySchema);

export default async function handler(req, res) {
  try {
    // التعديل هنا ليتوافق مع اسم المتغير لديك في Vercel
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      console.error("خطأ: MONGODB_URI غير معرف في إعدادات Vercel");
      return res.status(500).json({ error: "Environment variable MONGODB_URI is missing" });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(uri);
    }

    if (req.method === 'POST') {
      await Security.findOneAndUpdate(
        { guildId: 'default' }, 
        { $set: req.body }, 
        { upsert: true, new: true }
      );
      return res.status(200).json({ success: true });
    }

    const data = await Security.findOne({ guildId: 'default' });
    res.status(200).json(data || {});
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "فشل الاتصال بقاعدة البيانات" });
  }
}

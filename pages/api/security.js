import mongoose from 'mongoose';

const SecuritySchema = new mongoose.Schema({
  guildId: { type: String, default: 'default' },
  antiBot: { type: Boolean, default: false },
  antiLink: { type: Boolean, default: false },
  antiInvite: { type: Boolean, default: false },
  antiSpam: { type: Boolean, default: false }
});

const Security = mongoose.models.Security || mongoose.model('Security', SecuritySchema);

export default async function handler(req, res) {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  if (req.method === 'POST') {
    // تحديث البيانات أو إنشاؤها إذا لم تكن موجودة
    await Security.findOneAndUpdate(
      { guildId: 'default' }, 
      { $set: req.body }, 
      { upsert: true, new: true }
    );
    return res.status(200).json({ success: true });
  }

  const data = await Security.findOne({ guildId: 'default' });
  res.status(200).json(data || {});
}

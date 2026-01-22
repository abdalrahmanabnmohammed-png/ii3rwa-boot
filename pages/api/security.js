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
  try {
    // قمنا بتعديل الاسم هنا ليبحث عن MONGODB_URI
    const dbUri = process.env.MONGODB_URI;

    if (!dbUri) {
      return res.status(500).json({ error: "MONGODB_URI is missing in Vercel" });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(dbUri);
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
    console.error(error);
    res.status(500).json({ error: "Connection Error" });
  }
}

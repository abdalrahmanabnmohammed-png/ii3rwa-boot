import mongoose from 'mongoose';

const SecuritySchema = new mongoose.Schema({ guildId: { type: String, default: 'default' }, antiBot: { type: Boolean, default: false }, antiLink: { type: Boolean, default: false }, antiInvite: { type: Boolean, default: false }, antiSpam: { type: Boolean, default: false } });

const Security = mongoose.models.Security || mongoose.model('Security', SecuritySchema);

export default async function handler(req, res) { try { const uri = process.env.MONGODB_URI;

} catch (error) { res.status(500).json({ error: "Database Error" }); } }

import mongoose from 'mongoose';

const ConfigSchema = new mongoose.Schema({
    key: String,
    settings: Object,
}, { timestamps: true });

const Config = mongoose.model('Configs', ConfigSchema, 'configs');
export default Config;
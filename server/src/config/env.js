const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-mock-interview',
  jwtSecret: process.env.JWT_SECRET || 'ai_mock_interview_super_secret_jwt_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  aiProvider: process.env.AI_PROVIDER || 'openai',
  aiApiKey: process.env.AI_API_KEY || '',
  aiModel: process.env.AI_MODEL || 'gpt-4o-mini'
};

module.exports = env;

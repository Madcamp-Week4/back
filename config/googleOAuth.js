const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

// 환경변수에서 Google 클라이언트 ID와 클라이언트 비밀 가져오기
// 환경변수를 사용하지 않는 경우, 직접 문자열을 입력해도 됩니다.
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// OAuth2Client 인스턴스 생성
const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);

module.exports = client;

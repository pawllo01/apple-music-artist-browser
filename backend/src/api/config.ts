export const BASE_API_URL = 'https://amp-api.music.apple.com/v1/catalog';

export const headers = {
  Authorization: `Bearer ${process.env.API_TOKEN}`,
  Origin: 'https://music.apple.com',
};

// @ts-nocheck
// ✅ قائمة المستخدمين المشتركة - تستخدم global لتخزين across requests
declare global {
  var __USERS__: any[] | undefined;
}

export const USERS: any[] = globalThis.__USERS__ || [
  {
    id: '1',
    email: 'panorama_farea@outlook.com',
    password: '123456',
    name: 'Dr. Panorama',
    role: 'doctor'
  }
];

// ✅ حفظ في global
if (!globalThis.__USERS__) {
  globalThis.__USERS__ = USERS;
}
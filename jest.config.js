module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // ✅ ROOTS AYARI EKLENDİ - tests klasörünü kök olarak tanımla
  roots: ['<rootDir>/tests'],
  
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.tsx$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // ✅ TEST MATCH GÜNCELLENDİ - tests klasöründeki tüm testleri bul
  testMatch: [
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/tests/**/*.spec.ts',
    '<rootDir>/tests/**/*.test.tsx',
    '<rootDir>/tests/**/*.spec.tsx',
    '<rootDir>/tests/**/__tests__/**/*.ts',
    '<rootDir>/tests/**/__tests__/**/*.tsx'
  ],
  
  // ✅ IGNORE PATTERNS GÜNCELLENDİ
  testPathIgnorePatterns: [
    '/dist/',
    '/node_modules/',
    '/src/'  // ✅ src içindeki testleri ignore et
  ],
  
  // ✅ COVERAGE AYARLARI (opsiyonel)
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**'  // src içindeki testleri coverage'den çıkar
  ],
  
  // ✅ CLEAR MOCKS (opsiyonel)
  clearMocks: true,
  resetMocks: true
};
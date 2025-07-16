import { apiService } from '@/services/api';

export const testApiConnection = async () => {
  console.log('🧪 Starting API Connection Test...');
  
  // Test 1: Backend Health Check
  console.log('\n1️⃣ Testing Backend Health...');
  const healthResult = await apiService.healthCheck();
  console.log('Health Result:', healthResult);
  
  // Test 2: Backend Connection
  console.log('\n2️⃣ Testing Backend Connection...');
  const connectionResult = await apiService.testBackendConnection();
  console.log('Connection Result:', connectionResult);
  
  // Test 3: Try Registration (if backend is available)
  if (connectionResult.connected) {
    console.log('\n3️⃣ Testing Registration...');
    const testUser = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'testpassword123'
    };
    
    try {
      const registerResult = await apiService.register(testUser);
      console.log('Registration Result:', registerResult);
      
      if (registerResult.success) {
        console.log('\n4️⃣ Testing Login...');
        const loginResult = await apiService.login({
          email: testUser.email,
          password: testUser.password
        });
        console.log('Login Result:', loginResult);
        
        if (loginResult.success) {
          console.log('\n5️⃣ Testing File Upload...');
          // Create a test file
          const testFile = new File(['Hello, this is a test file content!'], 'test.txt', {
            type: 'text/plain'
          });
          
          const uploadResult = await apiService.uploadSingleFile(testFile, {
            oneTimeDownload: true,
            expiryDays: 7
          });
          console.log('Upload Result:', uploadResult);
        }
      }
    } catch (error) {
      console.error('❌ Test failed:', error);
    }
  }
  
  console.log('\n✅ API Connection Test Complete!');
};

// Simple debug function to test upload step by step
export const debugUpload = async () => {
  console.log('🔍 Debug Upload Process...');
  
  // Check if user is authenticated
  const token = localStorage.getItem('authToken');
  console.log('🔑 Auth token exists:', !!token);
  
  if (!token) {
    console.log('❌ No auth token found. Please log in first.');
    return;
  }
  
  // Test backend connection
  console.log('🌐 Testing backend connection...');
  const connection = await apiService.testBackendConnection();
  console.log('Backend connected:', connection.connected);
  
  if (!connection.connected) {
    console.log('❌ Backend not connected. Please start the backend server.');
    return;
  }
  
  console.log('✅ Ready for upload test!');
};

// Auto-run test when imported (for debugging)
if (typeof window !== 'undefined') {
  // Only run in browser environment
  setTimeout(() => {
    console.log('🔍 Auto-running API connection test...');
    testApiConnection();
  }, 2000);
} 
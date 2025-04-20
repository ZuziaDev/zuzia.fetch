// Import the zuzia.fetch library
// Note: In a real project, you would import from the package
// import zuzia from 'zuzia.fetch';
// For our test, we'll import directly from our source
import zuzia from "./src/index.js"

// Test basic functionality
async function testBasicRequest() {
  console.log("Testing basic GET request...")

  try {
    const response = await zuzia.get("https://api.zuzia.dev")
    console.log("✅ Basic GET request successful")
    console.log("Response:", response.data)
    return true
  } catch (error) {
    console.error("❌ Basic GET request failed:", error.message)
    return false
  }
}

// Test creating a custom instance
async function testCustomInstance() {
  console.log("\nTesting custom instance...")

  // Create a custom instance with baseURL
  const api = zuzia.create({
    baseURL: "https://api.zuzia.dev/v1",
    timeout: 5000,
  })

  try {
    const response = await api.get("/github")
    console.log("✅ Custom instance request successful")
    console.log("Response:", response.data)
    return true
  } catch (error) {
    console.error("❌ Custom instance request failed:", error.message)
    return false
  }
}

// Test request interceptors
async function testInterceptors() {
  console.log("\nTesting interceptors...")

  const api = zuzia.create({
    baseURL: "https://jsonplaceholder.typicode.com",
  })

  // Add request interceptor
  api.useRequestInterceptor((config) => {
    console.log("Request interceptor called")
    // Add custom header
    config.headers["X-Custom-Header"] = "test-value"
    return config
  })

  // Add response interceptor
  api.useResponseInterceptor((response) => {
    console.log("Response interceptor called")
    // Add custom property to response
    response.customProp = "intercepted"
    return response
  })

  try {
    const response = await api.get("/github")
    console.log("✅ Interceptor test successful")
    console.log("Custom header was added to request")
    console.log("Custom property from interceptor:", response.customProp)
    return true
  } catch (error) {
    console.error("❌ Interceptor test failed:", error.message)
    return false
  }
}

// Test POST request with data
async function testPostRequest() {
  console.log("\nTesting POST request with data...")

  const api = zuzia.create({
    baseURL: "https://jsonplaceholder.typicode.com",
  })

  const data = {
    title: "foo",
    body: "bar",
    userId: 1,
  }

  try {
    const response = await api.post("/posts", data)
    console.log("✅ POST request successful")
    console.log("Response:", response.data)
    return true
  } catch (error) {
    console.error("❌ POST request failed:", error.message)
    return false
  }
}

// Test error handling
async function testErrorHandling() {
  console.log("\nTesting error handling...")

  try {
    // This should fail with 404
    await zuzia.get("https://jsonplaceholder.typicode.com/nonexistent")
    console.error("❌ Error handling test failed: Expected an error but got success")
    return false
  } catch (error) {
    console.log("✅ Error handling test successful")
    console.log("Error:", error.name, error.message)
    if (error.status) {
      console.log("Status:", error.status)
    }
    return true
  }
}

// Run all tests
async function runTests() {
  console.log("=== ZUZIA.FETCH TESTS ===")
  console.log("Version:", zuzia.VERSION)

  const results = await Promise.all([
    testBasicRequest(),
    testCustomInstance(),
    testInterceptors(),
    testPostRequest(),
    testErrorHandling(),
  ])

  const passedTests = results.filter(Boolean).length
  const totalTests = results.length

  console.log("\n=== TEST SUMMARY ===")
  console.log(`Passed: ${passedTests}/${totalTests}`)

  if (passedTests === totalTests) {
    console.log("✅ All tests passed!")
  } else {
    console.log("❌ Some tests failed.")
  }
}

// Run the tests
runTests().catch((error) => {
  console.error("Test runner error:", error)
})

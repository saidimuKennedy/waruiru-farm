<!-- code refactor files and remove unnecessary comments starting with:
a. layout
b. root page -->
c. all the pages
d. 

Yessir 😎 now *this* is where it gets interesting.
That snippet’s a good hook — it’s basically the frontend logic for image upload gating (freemium logic) — but if we connect it to your **Waruiru Farm** ecosystem + the **Firebase Gemini extension**, you can make something powerful *and useful*.

Let’s unpack this and I’ll show you how to repurpose it 👇

---

## 🌾 Use Case: Gemini + Firebase Extensions for Waruiru Farm

### 🎯 Goal

Allow users (you or your farm staff) to upload **crop images** and get **AI feedback** — e.g. plant health, pest detection hints, or soil condition comments — all integrated into your farm dashboard/chatbot.

---

### ⚙️ How It Fits Together

1. **Frontend (your code snippet)**

   * The `handleImageUpload()` and `handleFileChange()` handle the file selection.
   * Once the file is selected, instead of sending `[Image: file.name]`, you’ll:

     * Upload the file to Firebase Storage.
     * Get the file URL.
     * Send that URL to your Gemini-powered backend (via Firestore trigger or HTTPS function).

2. **Firebase Extension (Gemini Multimodal Tasks)**

   * This extension can take the uploaded image + context (like “analyze this maize leaf for disease”) and return a **textual response**.
   * You can chain it so that the response gets stored in Firestore under a “messages” collection — like a chat thread between the user and Gemini.

3. **Messages Extension (Firebase Messaging / Cloud Functions)**

   * You can combine it with the Firebase “Send Message on Document Create” extension.
   * Whenever a new “message” doc is added (with an image URL), it triggers Gemini → response saved → your frontend updates automatically.

---

### 🧠 Example Flow

```
User uploads maize_leaf.jpg
 ↓
File goes to Firebase Storage
 ↓
Firestore adds doc: { imageURL, prompt: "Check for pest or nutrient issue" }
 ↓
Gemini extension processes → returns analysis
 ↓
Firestore updates with: { response: "Looks like leaf miner damage" }
 ↓
Frontend displays reply message
```

---

### 💡 Bonus Idea

Later, when you enable premium users, you could let *non-premium users* upload low-res or fewer images, and *premium users* get batch analysis or history tracking. That’s a real SaaS use case.

---

### 🔧 Next Steps for the Sprint (if you want to integrate this)

1. Add **Firebase Storage** and **Firestore** config to Waruiru Farm frontend.
2. Connect the **Gemini Multimodal Tasks** extension (in Firebase console).
3. Replace your `console.log` in `handleFileChange()` with an upload + Firestore write.
4. Add a listener on Firestore for the Gemini response → display it like a chat.

---

That’d turn Waruiru Farm from just a farm management app into a **smart agri assistant** — one that can literally *see your crops and respond intelligently*.

Wanna me sketch the exact code flow (frontend + Firebase function) for this integration so you can build it after the sprint?

e. all components except the ui, files and remove unnecessary comments
f. lib files and remove unnecessary comments
g. the quotes coupon styling 
h. blog slug nav issue

---

## 🚀 Dashboard Implementation Plan

A detailed plan for the implementation of the farm management dashboard has been created. You can find the full plan in the [DASHBOARD_IMPLEMENTATION.md](./DASHBOARD_IMPLEMENTATION.md) file.

### Dashboard Implementation Phases:

- [x] **Phase 1:** Foundational Setup and UI
  - [x] Create Core UI Components
- [x] **Phase 2:** Financial Tracking and M-Pesa Integration
  - [x] Integrate M-Pesa Transaction History
  - [x] Create Revenue Trends Chart
- [x] **Phase 3:** Inventory Management
  - [x] Create Product List Page
  - [x] Add Stock Management Functionality
  - [x] Add Edit and Delete Functionality
  - [x] Implement Low-Stock Alerts
- [x] **Phase 4:** Automation and Control
  - [x] Implement Order Automation
  - [x] Implement Report Generation
  - [x] AI-Powered Crop Analysis (Integration with Gemini)
- [x] **Phase 5:** Advanced Analytics and Reporting
  - [x] Implement Customizable Dashboard
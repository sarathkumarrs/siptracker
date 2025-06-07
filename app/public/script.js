// --- Supabase Configuration ---
// IMPORTANT: Replace with your actual Supabase project URL and Anon Key
const SUPABASE_URL = "https://hpybjnvodvjmpuqmoigg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhweWJqbnZvZHZqbXB1cW1vaWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjY2MTYsImV4cCI6MjA2NDg0MjYxNn0.HCQtxgfWJKBGZ6le3MpnqKefEwCt15KMIdlZMHy6li0"; // Your project's public "anon" key

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- FastAPI Backend URL ---
const FASTAPI_BASE_URL = "http://127.0.0.1:8000";

// --- DOM Elements ---
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signInBtn = document.getElementById("signInBtn");
const authStatus = document.getElementById("authStatus");
const jwtTokenSpan = document.getElementById("jwtToken");
const userIdSpan = document.getElementById("userId");
const apiTestSection = document.getElementById("api-test-section");

const schemeNameInput = document.getElementById("schemeName");
const monthlyAmountInput = document.getElementById("monthlyAmount");
const startDateInput = document.getElementById("startDate");
const createSipBtn = document.getElementById("createSipBtn");
const createSipStatus = document.getElementById("createSipStatus");

const getSummaryBtn = document.getElementById("getSummaryBtn");
const summaryOutput = document.getElementById("summaryOutput");

let currentJwt = null; // Store JWT after successful login

// --- Helper to update status messages ---
function updateStatus(element, message, isError = false) {
    element.textContent = message;
    element.className = isError ? "error" : "";
}

// --- Supabase Sign In Function ---
signInBtn.addEventListener("click", async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    updateStatus(authStatus, "Signing in...");
    currentJwt = null; // Clear previous token
    jwtTokenSpan.textContent = "No Token Yet";
    userIdSpan.textContent = "N/A";
    apiTestSection.style.display = "none"; // Hide API section until logged in

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            updateStatus(authStatus, `Sign in error: ${error.message}`, true);
            console.error("Supabase Sign In Error:", error);
            return;
        }

        if (data && data.session && data.user) {
            currentJwt = data.session.access_token;
            const userId = data.user.id; // This is the UUID from Supabase
            updateStatus(authStatus, "Signed in successfully!");
            jwtTokenSpan.textContent = currentJwt;
            userIdSpan.textContent = userId;
            apiTestSection.style.display = "block"; // Show API section

            console.log("Supabase Session:", data.session);
            console.log("Supabase User:", data.user);
        } else {
            updateStatus(authStatus, "Sign in failed: No session or user data.", true);
        }

    } catch (e) {
        updateStatus(authStatus, `An unexpected error occurred: ${e.message}`, true);
        console.error("Supabase Login Exception:", e);
    }
});

// --- FastAPI API Call Function (Create SIP) ---
createSipBtn.addEventListener("click", async () => {
    if (!currentJwt) {
        updateStatus(createSipStatus, "Please sign in first!", true);
        return;
    }

    const sipData = {
        scheme_name: schemeNameInput.value,
        monthly_amount: parseFloat(monthlyAmountInput.value),
        start_date: startDateInput.value, // YYYY-MM-DD from input type="date"
    };

    updateStatus(createSipStatus, "Creating SIP plan...");

    try {
        const response = await fetch(`${FASTAPI_BASE_URL}/sips/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${currentJwt}`, // Attach JWT
            },
            body: JSON.stringify(sipData),
        });

        const result = await response.json();

        if (response.ok) {
            updateStatus(createSipStatus, "SIP plan created successfully!");
            console.log("Create SIP Response:", result);
        } else {
            updateStatus(createSipStatus, `Error creating SIP: ${result.detail || response.statusText}`, true);
            console.error("Create SIP Error:", result);
            console.error("HTTP Status:", response.status);
            console.error("Headers:", response.headers);
        }

    } catch (e) {
        updateStatus(createSipStatus, `An unexpected error occurred: ${e.message}`, true);
        console.error("Create SIP Exception:", e);
    }
});

// --- FastAPI API Call Function (Get SIP Summary) ---
getSummaryBtn.addEventListener("click", async () => {
    if (!currentJwt) {
        updateStatus(summaryOutput, "Please sign in first!", true);
        return;
    }

    updateStatus(summaryOutput, "Getting SIP summary...");

    try {
        const response = await fetch(`${FASTAPI_BASE_URL}/sips/summary`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${currentJwt}`, // Attach JWT
            },
        });

        const result = await response.json();

        if (response.ok) {
            summaryOutput.textContent = JSON.stringify(result, null, 2); // Pretty print JSON
            updateStatus(summaryOutput, JSON.stringify(result, null, 2), false); // Clear status message
            console.log("SIP Summary Response:", result);
        } else {
            summaryOutput.textContent = `Error getting summary: ${result.detail || response.statusText}`;
            updateStatus(summaryOutput, `Error getting summary: ${result.detail || response.statusText}`, true);
            console.error("Get Summary Error:", result);
            console.error("HTTP Status:", response.status);
            console.error("Headers:", response.headers);
        }

    } catch (e) {
        updateStatus(summaryOutput, `An unexpected error occurred: ${e.message}`, true);
        console.error("Get Summary Exception:", e);
    }
});

// --- Initial setup for start date input ---
// Set default start date to today's date in YYYY-MM-DD format
window.addEventListener('load', () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    startDateInput.value = `${year}-${month}-${day}`;
});
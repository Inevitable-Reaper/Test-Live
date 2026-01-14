import { getSecret } from "../../lib/azure-vault";
const API_URL = "https://api.liveavatar.com";

export async function POST() {
  let session_token = "";
  let session_id = "";
  
  try {
    // Fetch API Key from Azure Vault
    const API_KEY = await getSecret("HeyGen--APIKey");

    if (!API_KEY) {
      console.error("HeyGen API key missing from Vault (HeyGen--APIKey)");
      return new Response(JSON.stringify({ error: "API Configuration missing" }), {
        status: 500,
      });
    }

    const res = await fetch(`${API_URL}/v1/sessions/token`, {
      method: "POST",
      headers: {
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "FULL",
        avatar_id: "21b1cc10-23a2-4857-a15e-32cc8a2e69cc",
        avatar_persona: {
          context_id: "a7da2b5c-cb4e-42d0-b55c-569a899bd04c",
          language: "en",
        },
      }),
    });
    if (!res.ok) {
      const resp = await res.json();
      const errorMessage =
        resp.data[0].message ?? "Failed to retrieve session token";
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: res.status,
      });
    }
    const data = await res.json();

    session_token = data.data.session_token;
    session_id = data.data.session_id;
  } catch (error) {
    console.error("Error retrieving session token:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }

  if (!session_token) {
    return new Response("Failed to retrieve session token", {
      status: 500,
    });
  }
  return new Response(JSON.stringify({ session_token, session_id }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
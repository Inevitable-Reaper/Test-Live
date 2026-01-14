import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

// The vault URL specified for deployment
const vaultUrl = "https://liveavatarzaid.vault.azure.net/";

let secretClient: SecretClient | null = null;

function getClient(): SecretClient {
  if (!secretClient) {
    const credential = new DefaultAzureCredential();
    secretClient = new SecretClient(vaultUrl, credential);
  }
  return secretClient;
}

export async function getSecret(secretName: string): Promise<string | undefined> {
  try {
    const client = getClient();
    const secret = await client.getSecret(secretName);
    return secret.value;
  } catch (error) {
    console.error(`Error fetching secret ${secretName} from vault:`, error);
    return undefined;
  }
}
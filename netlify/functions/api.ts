import express from "express";
import serverless from "serverless-http";
import crypto from "crypto";
import { ethers } from "ethers";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// NOTE: no dotenv.config() here — Netlify injects env vars directly at runtime.
// No .env file exists in the deployed bundle, so loadLiveEnv() below is dropped.

const app = express();
app.use(express.json());

const GITHUB_TOKEN = (process.env.GITHUB_TOKEN || "").trim();
const GITHUB_MODELS_ENDPOINT = "https://models.github.ai/inference";
const GITHUB_MODELS_MODEL = "openai/gpt-4o-mini";
const OPENAI_API_KEY = (process.env.OPENAI_API_KEY || "").trim();

type ChatHistoryMessage = {
  id?: string;
  sender?: "user" | "node";
  role?: "user" | "assistant";
  time?: string;
  timestamp?: string;
  text?: string;
};

let aiClient: GoogleGenAI | null = null;
let openaiClient: OpenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY is not configured. Add it in Netlify env vars.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });
  }
  return aiClient;
}

function getOpenAIClient(): OpenAI {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured. Add it in Netlify env vars.");
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });
  }
  return openaiClient;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function isRetryableStatus(status: number | undefined) {
  return status === 429 || status === 502 || status === 503 || status === 504;
}

async function retryWithBackoff<T>(
  action: () => Promise<T>,
  maxAttempts = 4,
  baseDelay = 500,
) {
  let attempt = 0;
  while (true) {
    try {
      return await action();
    } catch (error: any) {
      const status =
        Number(error?.status || error?.response?.status || error?.statusCode) ||
        undefined;
      attempt += 1;
      if (attempt >= maxAttempts || !isRetryableStatus(status)) {
        throw error;
      }
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.warn(`Retrying request after ${delay}ms due to status ${status}. attempt=${attempt}`);
      await sleep(delay);
    }
  }
}

function buildUrl(baseUrl: string, pathName: string) {
  return `${baseUrl.replace(/\/$/, "")}/${pathName.replace(/^\//, "")}`;
}

async function getGitHubModelsResponse(
  messages: any[],
  temperature: number,
  maxTokens: number,
) {
  return retryWithBackoff(async () => {
    const response = await fetch(
      buildUrl(GITHUB_MODELS_ENDPOINT, "chat/completions"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
        body: JSON.stringify({
          model: GITHUB_MODELS_MODEL,
          messages,
          temperature,
          max_tokens: maxTokens,
        }),
      },
    );

    const responseBody = await response.text();
    let parsed: any = null;
    try {
      parsed = responseBody ? JSON.parse(responseBody) : null;
    } catch {
      parsed = null;
    }

    if (!response.ok) {
      const detail =
        parsed?.error?.message || parsed?.message || responseBody || response.statusText;
      const error: any = new Error(`GitHub Models request failed (${response.status}): ${detail}`);
      error.status = response.status;
      throw error;
    }

    const content = parsed?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("GitHub Models returned an empty response.");
    }
    return content;
  });
}

function sanitizeChatHistory(history: unknown): ChatHistoryMessage[] {
  if (!Array.isArray(history)) return [];
  return history
    .filter((message): message is ChatHistoryMessage => {
      return (
        Boolean(message) &&
        typeof message === "object" &&
        typeof (message as ChatHistoryMessage).text === "string"
      );
    })
    .slice(-20);
}

function buildTranscriptFromHistory(history: ChatHistoryMessage[]) {
  return history
    .map((message) => {
      const speaker =
        message.sender === "node" || message.role === "assistant" ? "Assistant" : "User";
      return `${speaker}: ${message.text}`;
    })
    .join("\n");
}

function buildModelMessagesFromHistory(history: ChatHistoryMessage[]) {
  return history.map((message) => ({
    role: message.sender === "node" || message.role === "assistant" ? "assistant" : "user",
    content: message.text || "",
  }));
}

function generateFallbackChatResponse(message: string, history: ChatHistoryMessage[]) {
  const contextNote =
    history.length > 1
      ? "I kept the previous conversation context in view while drafting this."
      : "I can keep building on this thread as you refine it.";

  return `${contextNote}\n\nFor "${message}", I would start by clarifying the target assets, risk band, rebalance trigger, and execution constraints. Then I would turn that into an Aetheris strategy with allocation rules, safety checks, and monitoring agents before deployment.`;
}

// ------------------------
// Mongoose models
// ------------------------
const DEFAULT_MONGODB_DB = "aetheris";
mongoose.set("strictQuery", true);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    walletAddress: { type: String, default: "" },
    earnings: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    createdAt: { type: Date, default: () => new Date() },
  },
  { collection: "users" },
);

const chatSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    createdAt: { type: Date, default: () => new Date() },
    userMessage: { type: mongoose.Schema.Types.Mixed, required: true },
    nodeMessage: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { collection: "chats" },
);

const earningSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    amount: { type: Number, required: true },
    note: { type: String, default: "task reward" },
    createdAt: { type: Date, default: () => new Date() },
  },
  { collection: "earnings" },
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
const ChatModel = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
const EarningModel = mongoose.models.Earning || mongoose.model("Earning", earningSchema);

// Cache the connection on the Lambda container so warm invocations reuse it
// instead of opening a new connection on every request (this is the #1
// source of "too many connections" errors when running Mongoose on Netlify).
let cachedConn: typeof mongoose | null = null;
async function ensureMongooseConnection() {
  if (cachedConn && mongoose.connection.readyState === 1) return cachedConn;

  const uri = (process.env.MONGODB_URI || "").trim();
  const dbName = (process.env.MONGODB_DB_NAME || DEFAULT_MONGODB_DB).trim();
  if (!uri) {
    throw new Error("MONGODB_URI is not configured. Add it in Netlify env vars.");
  }

  cachedConn = await mongoose.connect(uri, {
    dbName,
    autoIndex: true,
    bufferCommands: false,
    maxPoolSize: 5,
  });
  return cachedConn;
}

// ------------------------
// Health check
// ------------------------
app.get("/api/health", (_req, res) => {
  res.json({ success: true, status: "ok", time: new Date().toISOString() });
});

// ------------------------
// Chat endpoint
// ------------------------
app.post("/api/user/chat/respond", async (req, res) => {
  try {
    const { email, message, history, temperature, maxTokens } = req.body;

    if (!email || !message || typeof message !== "string") {
      return res.status(400).json({ success: false, error: "Missing required chat parameters." });
    }

    const previousHistory = sanitizeChatHistory(history);
    const priorModelMessages = buildModelMessagesFromHistory(previousHistory);
    const transcriptPrefix = buildTranscriptFromHistory(previousHistory);
    const tempVal = typeof temperature === "number" ? temperature : 0.7;
    const maxTkns = typeof maxTokens === "number" ? maxTokens : 2048;
    const startTime = Date.now();
    const systemCtx =
      "You are Aetheris AI Builder, a precise DeFi strategy assistant for Robinhood Chain yield strategies, token agents, and portfolio optimization. Answer in clean Markdown without fake metadata headers.";

    let responseText = "";

    if (GITHUB_TOKEN) {
      try {
        responseText = await getGitHubModelsResponse(
          [
            { role: "system", content: systemCtx },
            ...priorModelMessages,
            { role: "user", content: message },
          ],
          tempVal,
          maxTkns,
        );
      } catch (githubErr: any) {
        console.error("GitHub Models chat inference failed. Trying Gemini fallback.", githubErr);
      }
    }

    if (!responseText) {
      try {
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `${transcriptPrefix}\nUser: ${message}`.trim(),
          config: { systemInstruction: systemCtx, temperature: tempVal },
        });
        responseText = response.text || "No inference response received from the model.";
      } catch (err: any) {
        console.warn("Chat inference unavailable. Using local fallback response.", err.message);
        responseText = generateFallbackChatResponse(message, previousHistory);
      }
    }

    const elapsedMs = Date.now() - startTime;
    const timeStr = new Date().toTimeString().split(" ")[0];

    const userMsg = {
      id: crypto.randomUUID(),
      sender: "user",
      time: timeStr,
      text: message,
    };

    const nodeMsg = {
      id: crypto.randomUUID(),
      sender: "node",
      nodeId: "NODE_GPT_COGNITIVE_SHARD",
      time: timeStr,
      text: responseText,
      latency: `${elapsedMs}ms`,
      gas: `$0.000${Math.floor(Math.random() * 6) + 1}`,
      hash:
        "0x" +
        Math.random().toString(16).slice(2, 10) +
        "..." +
        Math.random().toString(16).slice(2, 6),
    };

    res.json({
      success: true,
      userMessage: userMsg,
      nodeMessage: nodeMsg,
      chatHistory: [...previousHistory, userMsg, nodeMsg],
    });

    try {
      if (email) {
        await ensureMongooseConnection();
        await ChatModel.create({
          email: email.toLowerCase(),
          createdAt: new Date(),
          userMessage: userMsg,
          nodeMessage: nodeMsg,
        });
      }
    } catch (dbErr: any) {
      console.warn("Failed to persist chat to DB:", dbErr.message || dbErr);
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------------
// Auth endpoints
// ------------------------
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: "Missing signup fields" });
    }
    await ensureMongooseConnection();
    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await UserModel.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ success: false, error: "Email already registered" });
    }
    const hash = bcrypt.hashSync(String(password), 10);
    const userDoc = await UserModel.create({
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash: hash,
      earnings: 0,
      balance: 0,
      createdAt: new Date(),
    });
    return res.json({ success: true, user: { name: userDoc.name, email: userDoc.email } });
  } catch (err: any) {
    console.error("/api/auth/signup error:", err?.message || err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/auth/signin", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Missing signin fields" });
    }
    await ensureMongooseConnection();
    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await UserModel.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }
    const ok = bcrypt.compareSync(String(password), user.passwordHash);
    if (!ok) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }
    return res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        walletAddress: user.walletAddress || "",
        earnings: user.earnings || 0,
        balance: user.balance || 0,
      },
    });
  } catch (err: any) {
    console.error("/api/auth/signin error:", err?.message || err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/user/:email", async (req, res) => {
  try {
    const email = String(req.params.email || "").toLowerCase().trim();
    if (!email) return res.status(400).json({ success: false, error: "Missing email" });
    await ensureMongooseConnection();
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    return res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        walletAddress: user.walletAddress || "",
        earnings: user.earnings || 0,
        balance: user.balance || 0,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/user/update", async (req, res) => {
  try {
    const { email, walletAddress, updates } = req.body || {};
    if (!email) return res.status(400).json({ success: false, error: "Missing email" });
    await ensureMongooseConnection();
    const normalizedEmail = String(email).toLowerCase().trim();
    const updateDoc: any = {};
    if (typeof walletAddress === "string") updateDoc.walletAddress = walletAddress.trim();
    if (updates && typeof updates === "object") {
      for (const k of Object.keys(updates)) {
        updateDoc[k] = updates[k];
      }
    }
    if (Object.keys(updateDoc).length === 0) {
      return res.status(400).json({ success: false, error: "No updates provided" });
    }
    const result = await UserModel.findOneAndUpdate({ email: normalizedEmail }, { $set: updateDoc }, { new: true });
    if (!result) return res.status(404).json({ success: false, error: "User not found" });
    return res.json({ success: true, user: result });
  } catch (err: any) {
    console.error("/api/user/update error:", err?.message || err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/earnings/add", async (req, res) => {
  try {
    const { email, amount, note } = req.body || {};
    const amt = Number(amount || 0);
    if (!email || !amt || isNaN(amt)) {
      return res.status(400).json({ success: false, error: "Missing email or invalid amount" });
    }
    await ensureMongooseConnection();
    const normalizedEmail = String(email).toLowerCase().trim();
    const updated = await UserModel.findOneAndUpdate(
      { email: normalizedEmail },
      { $inc: { earnings: amt, balance: amt } },
      { new: true },
    );
    if (!updated) return res.status(404).json({ success: false, error: "User not found" });
    await EarningModel.create({ email: normalizedEmail, amount: amt, note: note || "task reward", createdAt: new Date() });
    return res.json({ success: true, user: { email: updated.email, earnings: updated.earnings, balance: updated.balance } });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------------
// ETH / Robinhood Chain wallet
// ------------------------
const RPC_URL = "https://rpc.mainnet.chain.robinhood.com";
const PRIVATE_KEY = process.env.ROBINHOOD_PRIVATE_KEY!;
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

function getPayerConfig() {
  try {
    return { configured: true, payerWallet: wallet, payerAddress: wallet.address, rpcUrl: RPC_URL };
  } catch (e: any) {
    return { configured: false, configError: e.message, rpcUrl: RPC_URL };
  }
}

app.get("/api/eth-config", async (_req, res) => {
  const config = getPayerConfig();
  if (!config.configured) {
    return res.json({ success: false, configured: false, error: config.configError });
  }
  try {
    const balance = await provider.getBalance(config.payerAddress!);
    res.json({
      success: true,
      configured: true,
      address: config.payerAddress,
      rpcUrl: RPC_URL,
      balance: ethers.formatEther(balance),
      balanceWei: balance.toString(),
    });
  } catch (e: any) {
    res.json({ success: false, error: e.message });
  }
});

app.post("/api/withdraw", async (req, res) => {
  const { recipientAddress, amount } = req.body;

  if (!recipientAddress) {
    return res.status(400).json({ success: false, error: "Recipient address is required." });
  }
  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ success: false, error: "Amount must be greater than 0." });
  }

  const config = getPayerConfig();
  if (!config.configured || !config.payerWallet) {
    return res.status(500).json({ success: false, error: config.configError || "Payer wallet not configured." });
  }

  try {
    if (!ethers.isAddress(recipientAddress)) {
      return res.status(400).json({ success: false, error: "Invalid recipient address." });
    }

    const localProvider = new ethers.JsonRpcProvider(config.rpcUrl);
    const localWallet = config.payerWallet.connect(localProvider);
    const value = ethers.parseEther(amount.toString());
    const payerBalance = await localProvider.getBalance(config.payerAddress!);

    let gasLimit = 21000n;
    try {
      gasLimit = await localProvider.estimateGas({ from: config.payerAddress!, to: recipientAddress, value });
    } catch {
      gasLimit = 21000n;
    }

    const feeData = await localProvider.getFeeData();

    let tx: ethers.TransactionResponse;
    let gasCost: bigint;

    if (feeData.maxFeePerGas !== null && feeData.maxPriorityFeePerGas !== null) {
      gasCost = gasLimit * feeData.maxFeePerGas;
      if (payerBalance < value + gasCost) {
        return res.status(400).json({
          success: false,
          error: "Insufficient payer balance.",
          balance: ethers.formatEther(payerBalance),
          required: ethers.formatEther(value + gasCost),
        });
      }
      tx = await localWallet.sendTransaction({
        to: recipientAddress,
        value,
        gasLimit,
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      });
    } else {
      const gasPrice = feeData.gasPrice ?? ethers.parseUnits("1", "gwei");
      gasCost = gasLimit * gasPrice;
      if (payerBalance < value + gasCost) {
        return res.status(400).json({
          success: false,
          error: "Insufficient payer balance.",
          balance: ethers.formatEther(payerBalance),
          required: ethers.formatEther(value + gasCost),
        });
      }
      tx = await localWallet.sendTransaction({ to: recipientAddress, value, gasLimit, gasPrice });
    }

    const receipt = await tx.wait();

    return res.json({
      success: true,
      hash: tx.hash,
      blockNumber: receipt?.blockNumber,
      confirmations: receipt?.confirmations,
      amount: ethers.formatEther(value),
      gasUsed: receipt?.gasUsed.toString(),
      explorer: `https://explorer.robinhood.com/tx/${tx.hash}`,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.shortMessage || err.message || String(err) });
  }
});

// No app.listen() and no Vite/static middleware — Netlify handles the HTTP
// listener and static asset serving (from your build output dir) itself.
export const handler = serverless(app);
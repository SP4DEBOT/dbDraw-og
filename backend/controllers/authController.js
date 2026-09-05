import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters." });

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail }).lean();
    if (existing) return res.status(409).json({ message: "An account with this email already exists." });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash, role: "Regular User" });

    return res.status(201).json({ message: "Account created.", token: signToken(user), user: publicUser(user) });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ message: "An account with this email already exists." });
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Unable to create your account." });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) return res.status(400).json({ message: "Email and password are required." });

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+passwordHash");
    if (!user) return res.status(401).json({ message: "Invalid email or password." });

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) return res.status(401).json({ message: "Invalid email or password." });

    return res.json({ message: "Signed in.", token: signToken(user), user: publicUser(user) });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Unable to sign in." });
  }
}

export async function me(req, res) {
  try {
    const user = await User.findById(req.user.sub).lean();
    if (!user) return res.status(401).json({ message: "Account no longer exists." });
    return res.json({ user: publicUser(user) });
  } catch (error) {
    console.error("Session lookup error:", error);
    return res.status(500).json({ message: "Unable to restore your session." });
  }
}

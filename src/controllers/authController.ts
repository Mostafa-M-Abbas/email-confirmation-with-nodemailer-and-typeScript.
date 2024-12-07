import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/emailService";

interface TokenPayload {
  email: string;
}

export const registerUser = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    const confirmationUrl = `${process.env.CLIENT_URL}/confirm/${token}`;

    await sendEmail(
      email,
      "Confirm Your Email",
      `
      <p>Thank you for registering. Please confirm your email by clicking the link below:</p>
      <a href="${confirmationUrl}">${confirmationUrl}</a>
    `
    );

    res
      .status(200)
      .json({ message: "Confirmation email sent. Please check your inbox." });
  } catch (error) {
    res.status(500).json({ message: "Error registering user." });
  }
};

export const confirmEmail = (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    res
      .status(200)
      .json({ message: `Email ${payload.email} confirmed successfully.` });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
};

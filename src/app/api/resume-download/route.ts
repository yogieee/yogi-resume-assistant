import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email } = result.data;

    // Send notification email
    const resendKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.NOTIFICATION_EMAIL;

    if (resendKey && notifyEmail) {
      const resend = new Resend(resendKey);
      const fromAddress = process.env.RESEND_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
      const { error: emailError } = await resend.emails.send({
        from: fromAddress,
        to: notifyEmail,
        subject: `Resume Downloaded by ${name}`,
        html: `
          <h2>Resume Download Notification</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString("en-GB", { timeZone: "Europe/London" })}</p>
        `,
      });
      if (emailError) {
        console.error("[resume-download] Email send failed:", emailError);
      }
    }

    // Read and return the PDF
    const filePath = join(process.cwd(), "public", "Yoganandgovind-resume.pdf");
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Yoganand_Govind_Resume.pdf"',
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

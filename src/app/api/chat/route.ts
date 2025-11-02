import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 },
      );
    }

    // Path to the Python script
    const scriptPath = path.join(process.cwd(), "backend", "chatbot.py");

    // Run the Python script with the API key set
    const pythonProcess = spawn("python", [scriptPath, message], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        GEMINI_API_KEY: "AIzaSyCnnjkYzUn0AjDTU1Vwgd6oOZ19L13NPO0",
      },
    });

    let stdout = "";
    let stderr = "";

    pythonProcess.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    return new Promise((resolve) => {
      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          console.error("Python script error:", stderr);
          resolve(
            NextResponse.json(
              { error: "Failed to get response from chatbot" },
              { status: 500 },
            ),
          );
          return;
        }

        try {
          const result = JSON.parse(stdout.trim());
          if (result.status === "success") {
            resolve(NextResponse.json({ response: result.response }));
          } else {
            resolve(
              NextResponse.json(
                { error: result.error || "Unknown error" },
                { status: 500 },
              ),
            );
          }
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          resolve(
            NextResponse.json(
              { error: "Invalid response from chatbot" },
              { status: 500 },
            ),
          );
        }
      });
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

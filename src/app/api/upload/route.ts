import { NextRequest, NextResponse } from "next/server";
import { uploadImage, uploadPortfolioImage } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "art-from-heart/orders";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (folder.includes("portfolio")) {
      const result = await uploadPortfolioImage(buffer);
      return NextResponse.json(result);
    }

    const result = await uploadImage(buffer, folder);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

import { verifyAdminRequest } from "@/lib/admin/admin-guards";
import connectToDatabase from "@/lib/db";
import BuilderApplication from "@/models/BuilderApplication";
import User from "@/models/User";
import Builder from "@/models/Builder";
import { NextResponse } from "next/server";

// GET: Retrieve all builder applications filtered by status
export async function GET(req) {
  try {
    const adminCheck = await verifyAdminRequest();
    if (!adminCheck.admin) {
      return NextResponse.json(
        { success: false, error: adminCheck.error || "Forbidden" },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status") || "pending";

    // Query builder applications with the given status filter
    const applications = await BuilderApplication.find({ status: statusFilter })
      .sort({ createdAt: -1 })
      .lean();

    // Map _id and dates to plain serializable formats
    const data = applications.map((app) => ({
      ...app,
      id: app._id.toString(),
      _id: app._id.toString(),
      userId: app.userId.toString(),
    }));

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/admin/builder-application:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error occurred" },
      { status: 500 }
    );
  }
}

// POST: Update builder application status (Approve/Reject)
export async function POST(req) {
  try {
    const adminCheck = await verifyAdminRequest();
    if (!adminCheck.admin) {
      return NextResponse.json(
        { success: false, error: adminCheck.error || "Forbidden" },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const body = await req.json();
    const { applicationId, status } = body;

    if (!applicationId || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (status !== "approved" && status !== "rejected") {
      return NextResponse.json(
        { success: false, error: "Invalid status value" },
        { status: 400 }
      );
    }

    const application = await BuilderApplication.findById(applicationId);

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    if (status === "approved") {
      // 1. Retrieve the associated user
      const user = await User.findById(application.userId);
      if (!user) {
        return NextResponse.json(
          { success: false, error: "Associated user not found in database" },
          { status: 404 }
        );
      }

      let builderId = user.builderId;

      // 2. Idempotent Builder creation if not already linked
      if (!builderId) {
        const canonicalName = application.builderName.trim();
        const slug = canonicalName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        // Check if builder already exists by name or slug (idempotency safety)
        let builder = await Builder.findOne({
          $or: [{ name: canonicalName }, { slug }]
        });

        if (!builder) {
          // Create a new Builder record
          builder = await Builder.create({
            name: canonicalName,
            slug,
            status: "active"
          });
          console.log(`[Admin Approval] Created new Builder profile: "${canonicalName}" | Slug: "${slug}"`);
        } else {
          console.log(`[Admin Approval] Reusing existing Builder profile: "${builder.name}"`);
        }

        builderId = builder._id;
      }

      // 3. Promote User role to "builder" and link builderId
      user.role = "builder";
      user.builderId = builderId;
      await user.save();
      console.log(`[Admin Approval] Activated user ${user.email} as Builder.`);
    }

    // 4. Update status in BuilderApplication record
    application.status = status;
    await application.save();

    return NextResponse.json({ success: true, data: application }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/admin/builder-application:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error occurred" },
      { status: 500 }
    );
  }
}

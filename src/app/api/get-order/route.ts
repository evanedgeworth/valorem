import request from "@/utils/request";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (req.method === "POST") {
    try {
      const response = await request({
        url: "/order/97",
        method: "GET",
      });
      const data = await response.json();
      return new NextResponse(JSON.stringify({ data }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      console.log(err);
      return new NextResponse(JSON.stringify({ error: { statusCode: 500, message: err.message } }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } else {
    return new NextResponse(JSON.stringify({ error: { statusCode: 405, message: "Method Not Allowed" } }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }
}

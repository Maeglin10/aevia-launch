import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import type { SessionData } from "@/lib/sessions";

const mockSessions = new Map<string, SessionData>();

vi.mock("@/lib/sessions", () => ({
  saveSession: vi.fn((id: string, data: SessionData) => mockSessions.set(id, data)),
  saveSessionToBlob: vi.fn(async (id: string, data: SessionData) => {
    mockSessions.set(id, data);
  }),
  getSessionFromBlob: vi.fn(async (id: string) => mockSessions.get(id) ?? null),
}));

import { PATCH } from "./route";

describe("PATCH /api/sessions", () => {
  beforeEach(() => {
    mockSessions.clear();
  });

  it("merges businessProfile without clobbering a field set by a previous PATCH", async () => {
    const id = "sess-1";
    mockSessions.set(id, {
      id,
      formData: {} as SessionData["formData"],
      businessProfile: { team: [{ name: "Alice", role: "Coiffeuse" }] },
      createdAt: new Date(),
    });

    const req = new NextRequest(`http://localhost/api/sessions?id=${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        businessProfile: { services: [{ name: "Coupe", price: "35€" }] },
      }),
    });

    const res = await PATCH(req);
    expect(res.status).toBe(200);

    const updated = mockSessions.get(id)!;
    expect(updated.businessProfile?.services).toEqual([{ name: "Coupe", price: "35€" }]);
    expect(updated.businessProfile?.team).toEqual([{ name: "Alice", role: "Coiffeuse" }]);
  });
});

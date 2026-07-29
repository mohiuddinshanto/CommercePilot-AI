import type { Metadata } from "next";
import AcceptInviteClient from "./AcceptInviteClient";

export const metadata: Metadata = {
  title: "Accept Invitation - CommercePilot AI",
  description: "Accept your staff invitation and join your team on CommercePilot.",
};

export default function AcceptInvitePage() {
  return <AcceptInviteClient />;
}

import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auctions")({
  component: AuctionsLayout,
});

function AuctionsLayout() {
  return <Outlet />;
}

import { Link } from "@tanstack/react-router";
import {
  FEATURE_INTEGRATED_BIDDING,
  formatMoney,
  type Auction,
  type Lot,
} from "@/lib/auctions-data";

export function BiddingPanel({ auction, lot }: { auction: Auction; lot: Lot }) {
  const est = `${formatMoney(lot.estimateLow, auction.currency)} – ${formatMoney(lot.estimateHigh, auction.currency)}`;
  const integrated =
    auction.biddingMode === "integrated" && FEATURE_INTEGRATED_BIDDING;

  return (
    <aside className="sticky top-24 rounded-sm border border-border bg-surface/60 p-6">
      <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span>{lot.lotNumber}</span>
        <span
          className={`rounded-sm px-2 py-1 ${
            integrated ? "bg-gold/15 text-gold" : "bg-burgundy/20 text-foreground"
          }`}
        >
          {integrated ? "Integrated Bidding" : "Concierge / Partner Bidding"}
        </span>
      </div>

      <div className="mb-4 border-b border-border pb-4">
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Estimate
        </div>
        <div className="mt-1 font-display text-3xl text-gold-gradient">{est}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Buyer's premium {auction.buyersPremiumPct}% · {auction.currency}
        </div>
      </div>

      {integrated ? <IntegratedActions /> : <ExternalActions auction={auction} />}

      <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Bids are legally binding. Availability of direct bidding depends on the
        authorisation provided by each auction partner.
      </p>
    </aside>
  );
}

function IntegratedActions() {
  return (
    <div className="space-y-2">
      <Link
        to="/membership"
        className="block rounded-sm gold-gradient px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-foreground"
      >
        Place Bid
      </Link>
      <Link
        to="/membership"
        className="block rounded-sm border border-border px-4 py-3 text-center text-[11px] uppercase tracking-[0.3em] hover:border-gold hover:text-gold"
      >
        Set Maximum Bid
      </Link>
      <Link
        to="/watchlist"
        className="block rounded-sm border border-border px-4 py-3 text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground"
      >
        Add to Watchlist
      </Link>
    </div>
  );
}

function ExternalActions({ auction }: { auction: Auction }) {
  return (
    <div className="space-y-2">
      <Link
        to="/concierge"
        className="block rounded-sm gold-gradient px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-foreground"
      >
        Request Concierge Bid
      </Link>
      <Link
        to="/watchlist"
        className="block rounded-sm border border-border px-4 py-3 text-center text-[11px] uppercase tracking-[0.3em] hover:border-gold hover:text-gold"
      >
        Add to Watchlist
      </Link>
      <a
        href={auction.partnerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-sm border border-border px-4 py-3 text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground"
      >
        Open Partner Auction Page ↗
      </a>
    </div>
  );
}

import { Suspense } from "react";
import AuctionsPage from "./AuctionsClient";

export default function AuctionsMainPage() {
  return (
    <Suspense fallback={<div>Loading auctions...</div>}>
      <AuctionsPage />
    </Suspense>
  );
}

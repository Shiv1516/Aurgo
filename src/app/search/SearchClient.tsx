"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AuctionCard from "@/components/auction/AuctionCard";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { searchAPI } from "@/lib/api";
import { Search as SearchIcon } from "lucide-react";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (query.length < 2) return setIsLoading(false);

    setIsLoading(true);
    searchAPI
      .search({ q: query, limit: 20 })
      .then((res) => {
        setResults(res.data.data || []);
        setTotal(res.data.pagination?.total || 0);
      })
      .finally(() => setIsLoading(false));
  }, [query]);

  return (
    <>
      <div className="bg-dark py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl text-white">Search Results</h1>
          <p className="text-gray-400">
            {total} results for "{query}"
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <PageLoader />
        ) : results.length ? (
          <div className="grid grid-cols-3 gap-6">
            {results.map((r: any) => (
              <AuctionCard key={r._id} auction={r} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <SearchIcon className="h-12 w-12 mx-auto" />
            <p>{query ? "No results found" : "Enter a search term"}</p>
          </div>
        )}
      </div>
    </>
  );
}

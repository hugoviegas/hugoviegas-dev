import React from "react";
import Viewer from "@/components/LightsaberViewer/Viewer";
import { Link } from "react-router-dom";

export default function LightsaberDemo() {
  return (
    <div className="min-h-screen p-6">
      <nav className="mb-4">
        <Link to="/" className="text-sm text-blue-400">
          ← Home
        </Link>
      </nav>
      <h1 className="text-2xl font-bold mb-4">Lightsaber Viewer</h1>
      <Viewer />
    </div>
  );
}

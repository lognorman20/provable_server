"use client"; // Add this line to mark the component as a client component

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { hash as starknetHash } from "starknet";

export function Mainv0() {
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [documents, setDocuments] = useState([]);
  const [currentDocId, setCurrentDocId] = useState(null);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("http://localhost:3000/documents");
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSave = async () => {
    try {
      const url = currentDocId
        ? `http://localhost:3000/update/${currentDocId}`
        : "http://localhost:3000/submit";
      const method = currentDocId ? "PUT" : "POST";

      const textHash = starknetHash.starknetKeccak(text).toString(); // Compute the hash of the text
      console.log(text, textHash);

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, name, hash: textHash }), // Include the hash in the request body
      });

      if (response.ok) {
        console.log("Text saved successfully");
        fetchDocuments(); // Refresh documents after save
      } else {
        console.error("Failed to save text", response.statusText);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDocuments((prevDocuments) => prevDocuments.filter((doc) => doc.id !== id));
        console.log("Document deleted successfully");
        fetchDocuments(); // Refresh documents after delete
      } else {
        console.error("Failed to delete document", response.statusText);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  const handleDocumentClick = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/documents/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          console.error("Document not found");
        } else {
          console.error("Failed to fetch document details:", response.statusText);
        }
        return;
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        setName(data.name);
        setText(data.text);
        setCurrentDocId(data._id); // Set the current document ID
      } else {
        console.error("Expected JSON response but got:", contentType);
      }
    } catch (error) {
      console.error("Error fetching document details:", error);
    }
  };

  return (
    <div className="grid min-h-screen w-full grid-cols-[240px_1fr]">
      <div className="flex flex-col border-r bg-muted/40 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Files</h2>
          <Button variant="ghost" size="icon" className="rounded-full">
            <PlusIcon className="h-4 w-4" />
            <span className="sr-only">New File</span>
          </Button>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1">
            {documents.map((doc) => (
              <div key={doc._id} className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted">
                <a
                  href="#"
                  className="flex-1 truncate"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDocumentClick(doc._id);
                  }}
                >
                  {doc.name}
                </a>
                <XIcon
                  className="h-4 w-4 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(doc._id);
                  }}
                />
              </div>
            ))}
          </nav>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex-1 p-6">
          <Textarea
            placeholder="Enter File name"
            maxLength={20}
            className="mb-4 w-full rounded-md border border-input bg-background p-2 text-lg focus:outline-none focus:ring-1 focus:ring-primary"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            placeholder="Start typing..."
            className="h-3/4 w-full resize-none rounded-md border border-input bg-background p-4 text-lg focus:outline-none focus:ring-1 focus:ring-primary"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {currentDocId && (
            <div className="mt-2 text-sm text-gray-500">
              Document ID: {currentDocId}
            </div>
          )}
        </div>
        <div className="border-t bg-muted/40 p-4">
          <Button className="ml-auto" onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  )
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}


function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

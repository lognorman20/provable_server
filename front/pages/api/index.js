import { useEffect, useState } from 'react';

export default function Home() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch('/api/documents');
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Documents</h1>
      <ul>
        {documents.map((doc) => (
          <li key={doc._id}>{doc.name}</li>
        ))}
      </ul>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { parseArtworkCsv } from '../utils/dataProcessing';

const useArtworkData = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await parseArtworkCsv();
        setArtworks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { artworks, loading, error };
};

export default useArtworkData;
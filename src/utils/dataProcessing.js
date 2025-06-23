import Papa from 'papaparse';
import artworkCsv from '../assets/artwork.csv';

export const parseArtworkCsv = async () => {
  return new Promise((resolve, reject) => {
    Papa.parse(artworkCsv, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: async (results) => {
        if (results.errors.length > 0) {
          reject(new Error("Error parsing artwork data from CSV."));
          return;
        }

        const essentialFields = [
          'id',
          'title',
          'main_reference_number',
          'artist_title',
          'place_of_origin',
          'date_start',
          'image_id'  // Note: 'image_link' is not required but will be checked for generalization
        ];

        const filteredArtworks = results.data
          .filter(row => {
            if (!row || typeof row !== 'object') return false;
            return essentialFields.every(field => {
              const value = row[field];
              if (value === null || value === undefined) return false;
              if (typeof value === 'string') return value.trim() !== '';
              return true;
            });
          })
          .map(artwork => {
            // Generalize image_link: Prefer a direct 'image_link' from CSV if it's a valid URL;
            // otherwise, construct from 'image_id' for backwards compatibility.
            let imageLink = null;
            if (artwork.image_link && typeof artwork.image_link === 'string' && artwork.image_link.trim().startsWith('http')) {
              imageLink = artwork.image_link.trim();  // Use provided full URL if available
            } else if (artwork.image_id) {
              imageLink = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`;  // Fallback construction
            }

            return {
              id: artwork.id,
              main_reference_number: String(artwork.main_reference_number).trim(),
              title: artwork.title ? String(artwork.title).trim() : 'N/A',
              artist_id: artwork.artist_id,
              artist_title: artwork.artist_title ? String(artwork.artist_title).trim() : 'N/A',
              place_of_origin: artwork.place_of_origin ? String(artwork.place_of_origin).trim() : 'N/A',
              date_start: artwork.date_start,
              image_link: imageLink,  // May be null if no valid link
            };
          });

        // Resolve with all processed artworks (no image validation here)
        resolve(filteredArtworks.filter(artwork => artwork.image_link !== null));  // Exclude if no image_link at all
      },
      error: (error) => {
        reject(new Error("Error downloading or parsing CSV: " + error.message));
      }
    });
  });
};
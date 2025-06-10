import Papa from 'papaparse';
import artworkCsv from '../assets/artwork.csv';

export const parseArtworkCsv = async () => {
  return new Promise((resolve, reject) => {
    Papa.parse(artworkCsv, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
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
          'image_id'
        ];

        const processedArtworks = results.data
          .filter(row => {
            if (!row || typeof row !== 'object') return false;
            return essentialFields.every(field => {
              const value = row[field];
              if (value === null || value === undefined) return false;
              if (typeof value === 'string') return value.trim() !== '';
              return true;
            });
          })
          .map(artwork => ({
            id: artwork.id,
            main_reference_number: String(artwork.main_reference_number).trim(),
            title: artwork.title ? String(artwork.title).trim() : 'N/A',
            artist_id: artwork.artist_id,
            artist_title: artwork.artist_title ? String(artwork.artist_title).trim() : 'N/A',
            place_of_origin: artwork.place_of_origin ? String(artwork.place_of_origin).trim() : 'N/A',
            date_start: artwork.date_start,
            image_link: artwork.image_id
              ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`
              : null,
          }));

        resolve(processedArtworks);
      },
      error: (error) => {
        reject(new Error("Error downloading or parsing CSV: " + error.message));
      }
    });
  });
};
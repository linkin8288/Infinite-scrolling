// API:
// Fetch unsplash API - fetchImages function.
// using useEffect to fecth API while the web loads.
// passing ...image props to Photo component.
// ---------------------------------------------------------------------
// Fetch images in the initial render -> 
// When you scroll to the bottom -> Loading -> fetch new images for one page
// Search workds -> fetch images

// Scroll event:
// Calculating to the bottom of window, then fetch API.
// Get a single page from the list of different photos, page + 1.
// Add new photos to the old array.

// Search query:
// handleSubmit is the function to control the search value.


import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';

import Photo from './Photo';
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

// remove current scroll code
// set default page to 1
// setup two useEffects
// don't run second on initial render
// check for query value
// if page 1 fetch images
// otherwise setPage(1)
// fix scroll functionality

function App() {

  const [loading, setLoading] = useState(false);
  // initial images and new images
  const [photos, setPhotos] = useState([]);
  // fetch new images when you scroll to the bottom
  const [newImages, setNewImages] = useState(false);
  // Infinite scroll page, default is 1
  const [page, setPage] = useState(1);
  // Search input
  const [query, setQuery] = useState('');
  const mounted = useRef(false);

  const fetchImages = async () => {
    setLoading(true);
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;

    // If something in the query, search, otherwise using main url
    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();

      // Adding new images to the old images passing a function to add new images to old images.
      // data.results is the default search result
      setPhotos((oldPhotos) => {
        // wipe out the old results
        if (query && page === 1) {
          return data.results;
          // 
        } else if (query) {
          return [...oldPhotos, ...data.results];
        } else {
          // Add Old and new photos
          return [...oldPhotos, ...data];
        }
      });
      setNewImages(false);
      setLoading(false);
    } catch (error) {
      setNewImages(false);

      setLoading(false);
    }
  };

  // Fetch event - fetch images when page changes
  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // fetch new page
  // mounted run except the initial render.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!newImages) return;
    if (loading) return;

    // scroll to the bottom and get new page + 1
    setPage((oldPage) => oldPage + 1);
  }, [newImages, loading]);

  // Calculating to the bottom of window, then fetch API, passing event to useEffect
  const event = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      setNewImages(true);
    }
  };

  // Add / Remove Scroll event
  useEffect(() => {
    window.addEventListener('scroll', event);
    return () => window.removeEventListener('scroll', event);
  }, []);

  // Submit function
  const handleSubmit = (e) => {
    e.preventDefault();
    // if there is no search query, don't fetch
    if (!query) return;
    if (page === 1) {
      fetchImages();
    }
    setPage(1);
  };
  
  return (
    <main>
      <h1 className='project-name'>Infinite scrolling project</h1>
      {/* Search input */}
      <section className='search'>
        <form className='search-form'>

          {/* Value and onChange */}
          <input
            type='text'
            placeholder='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='form-input'
          />
          <button type='submit' className='submit-btn' onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>

      {/* Photo section */}
      <section className='photos'>
        <div className='photos-center'>
          {/* Map the photos state - image */}
          {photos.map((image, index) => {
            console.log(image)
            return <Photo key={index} {...image} />;
          })}
        </div>
        {loading && <h2 className='loading'>Loading...</h2>}
      </section>
    </main>
  );
}

export default App;

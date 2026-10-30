# KStudio — Cherry Red Player Refresh

A responsive GitHub Pages front-end refresh using the supplied brand palette:
- Cotton `#EDEBDD`
- Cherry Red `#810100`
- Maroon `#630000`
- Noir Black `#1B1717`

## Included
- Responsive desktop/mobile music-library layout
- Searchable tracklist and YouTube IFrame player controls
- Mini player and expandable Now Playing screen
- User-created named playlists with add/remove-ready playlist structure
- Responsive login/register/profile interface
- Custom favicon and cursor assets retained
- Existing Open Graph image and metadata retained

## Important prototype limitation
This ZIP is a static GitHub Pages front end. Playlist and profile data are stored in the current browser using localStorage. The account screen is a UI prototype, **not secure authentication**; passwords are not stored, and local profile data is not synchronized between devices. Do not publish this as a real account system or collect real WhatsApp/email details until a secure backend is connected. The previously discussed Google Apps Script source/configuration was not included in the uploaded ZIP, so the backend has not been wired in this build.

The supplied YouTube IDs are preserved as track sources. Playback requires YouTube to be available and may be subject to embedding restrictions, ads, or regional availability.

## Deploy
Upload the contents of this folder to the root of the GitHub Pages repository. Keep the `assets` folder alongside `index.html`.

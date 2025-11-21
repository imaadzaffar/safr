# Product Requirements Document: Safr Flight Tracking App

## Product Overview

**Product Name**: Safr

**Description**: A visual flight tracking web application that allows users to log their flights, visualize travel on an interactive 2D/3D globe, track statistics, and optionally create shared maps with friends to combine travel experiences.

**Target Users**: Frequent travelers, aviation enthusiasts, travel enthusiasts who want to visualize and track their journey history

**Platform**: Responsive web application (desktop & mobile)

---

## Core Features

### 1. Flight Management

#### 1.1 Add Flight
- **Manual Entry Form** with fields:
  - Origin airport (searchable dropdown with airport codes)
  - Destination airport (searchable dropdown with airport codes)
  - Date of flight (date picker)
- **Auto-calculation** of:
  - Flight distance (great circle distance)
  - Country detection from airport location
  - Continent detection
- **Validation**:
  - Required fields: origin, destination, date
  - Origin ≠ destination
  - Date cannot be in future
- **Success feedback**: Brief animation showing new flight path on map

#### 1.2 Flight List
- Display all logged flights in chronological order (most recent first)
- Each entry shows: date, route (SFO → JFK), distance
- Actions per flight: edit, delete
- Empty state with prompt to add first flight

#### 1.3 Edit/Delete Flights
- Edit: pre-populate form with existing data
- Delete: confirmation dialog before removal
- Updates to map/stats happen in real-time

---

### 2. Visualization

#### 2.1 Map Modes
- **Toggle between 2D and 3D views**
  - 2D: Equirectangular projection (standard web map)
  - 3D: Interactive globe
  - Toggle button always visible in top center

#### 2.2 2D Map View
- World map with countries rendered
- **Country highlighting**: 
  - Visited countries shown in distinct color (green/teal tones)
  - Unvisited countries in neutral gray
- **Flight paths**:
  - Curved lines connecting origin/destination
  - Great circle routes
  - Animated line drawing when flight added
  - Subtle color coding possible (by year/recency)
- **Interactions**:
  - Hover over country: show country name, flag, visit count
  - Click country: show all flights to/from that country
  - Pan and zoom controls

#### 2.3 3D Globe View
- **Interactive sphere** showing Earth
- Same country highlighting as 2D
- **Flight paths**: 
  - 3D arcs connecting airports
  - Animated when flights added
  - Slight elevation above globe surface
- **Interactions**:
  - Click and drag to rotate globe
  - Scroll to zoom in/out
  - Smooth animations for rotation
  - Same hover/click behaviors as 2D
- **Auto-rotation**: Optional gentle spin when idle

---

### 3. Statistics Dashboard

#### 3.1 Core Stats Display
- **Countries visited**: X / 197
- **Continents visited**: X / 5 (or 7, depending on definition)
- **Total distance flown**: in km and miles
- **Total flights**: count
- **Year filter**: 
  - "All Time" (default)
  - Dropdown to filter by specific year
  - Stats update dynamically when filtered

#### 3.2 Additional Insights
- **Most visited country**
- **Longest flight**
- **Average flight distance**
- **Yearly breakdown** (when viewing all time):
  - Bar chart or simple list showing flights/distance per year

---

### 4. Data Persistence

#### 4.1 Local Storage
- No authentication required
- All data stored in browser localStorage
- **Data structure**:
  ```json
  {
    "flights": [
      {
        "id": "uuid",
        "origin": "SFO",
        "originCountry": "United States",
        "destination": "JFK",
        "destinationCountry": "United States",
        "date": "2023-06-15",
        "distance": 4139,
        "year": 2023
      }
    ]
  }
  ```
- Automatic save on every change
- Data persists across sessions

#### 4.2 Import/Export
- **Export**: Download all data as JSON file
- **Import**: Upload JSON file to restore/migrate data
- Useful for backup and device transfer

---

### 5. Shared Maps (Phase 2 / Premium Feature)

#### 5.1 Create Shared Map
- **Setup**:
  - Generate unique shareable link
  - Users access link and contribute their flights
  - No authentication required (link = access)
  
#### 5.2 Shared Map Visualization
- **Combined view showing**:
  - All countries visited by any participant (different colors per person)
  - All flight paths (color-coded by person)
  - Legend showing participants and their colors

#### 5.3 Shared Statistics
- **Individual stats** for each participant
- **Combined stats**:
  - Total unique countries (union of all participants)
  - Total unique continents
  - Combined distance flown
  - Total combined flights
- **Comparison view**:
  - Side-by-side stats
  - Who has visited more countries
  - Unique countries per person (visited by only them)
  - Common countries (visited by everyone)

#### 5.4 Shared Bucket List
- **Bucket list feature**:
  - Each participant can mark countries they want to visit
  - Shows overlap (countries multiple people want to visit)
  - Visual indicator on map for bucket list destinations
  - "Group bucket list" showing countries no one has visited but everyone wants to

---

## Technical Specifications

### UI/UX Requirements

#### Design System
- **Color palette**: 
  - Primary: Deep navy (#1E1B4B)
  - Accent: Sage green for visited countries (#6EBE8C)
  - Secondary: Warm tan/ochre (#C89664)
  - Tertiary: Steel blue (#6B8FAD)
  - Background: Light blue/off-white (#D9E8F5)
  - Neutral: Light gray for unvisited countries
  
#### Typography
- **Primary Font**: Fredoka One (headings, logo, major UI elements)
- **Secondary Font**: Nunito (body text, stats, labels)
- Clear hierarchy for stats
- Accessible font sizes (minimum 16px body)

#### Responsive Design
- **Mobile-first approach**
- **Breakpoints**:
  - Mobile: < 640px (single column, simplified stats)
  - Tablet: 640px - 1024px (adapted layout)
  - Desktop: > 1024px (full featured)
- **Mobile specific**:
  - Hamburger menu for navigation
  - Full-screen map view
  - Bottom sheet for stats
  - Touch-optimized controls
  - Swipe gestures for 2D/3D toggle

#### Components
- Searchable airport dropdown (autocomplete)
- Date picker
- Modal dialogs for add/edit flight
- Toast notifications for success/error
- Loading states for map rendering

### Technical Stack Recommendations

#### Core Technologies
- **Framework**: React with TypeScript
- **3D Rendering**: Three.js (for 3D globe)
- **2D Maps**: D3.js or Leaflet with custom styling
- **Styling**: Tailwind CSS
- **State Management**: React Context or Zustand
- **Storage**: localStorage with wrapper utility

#### Key Libraries
- **Airport data**: Airport codes, coordinates, country mapping (static JSON)
- **Distance calculation**: Haversine formula library
- **Country/continent mapping**: ISO country data
- **Animation**: Framer Motion for UI, GSAP for flight path animations
- **Date handling**: date-fns or Day.js

### Data Requirements

#### Airport Database
- Comprehensive list of IATA/ICAO codes
- Airport coordinates (lat/long)
- Country and city associations
- Major airports prioritized in search

#### Geographic Data
- Country boundaries (GeoJSON)
- Continent definitions
- Country metadata (names, flags, ISO codes)

### Performance Considerations
- **Map rendering**: Optimize for 200+ countries
- **Flight paths**: Efficient rendering for 500+ flights
- **Animation**: 60fps target for smooth globe rotation
- **Mobile**: Optimized texture sizes for 3D globe
- **Loading**: Progressive enhancement (show stats while map loads)

---

## User Flows

### Primary Flow: First-Time User
1. Landing page with empty map and "Add Flight" prompt
2. Click "Add Flight" → Modal opens
3. Fill in origin, destination, date
4. Submit → Flight saves, map animates new path, stats update
5. User sees their first traveled country highlighted
6. Encouraged to add more flights

### Secondary Flow: View Statistics
1. User has logged multiple flights
2. Stats panel shows countries, distance, flights
3. User filters by year → map and stats update
4. User hovers over country → tooltip shows details
5. User clicks country → list of flights to/from appears

### Tertiary Flow: Export Data
1. User clicks "Export" in settings/menu
2. JSON file downloads automatically
3. User can import on new device/browser

### Future Flow: Shared Map
1. User clicks "Create Shared Map"
2. Unique link generated and copied
3. User shares link with friends
4. Friends open link, add their flights
5. Map shows combined view with color-coded countries
6. Comparison stats visible to all participants

---

## Success Metrics

### Engagement
- Average number of flights logged per user
- Time spent on visualization (2D vs 3D usage)
- Return visits (localStorage persistence)

### Feature Adoption
- % of users who filter by year
- % of users who export data
- (Future) % of users who create shared maps

### Performance
- Time to first meaningful paint
- Map render time
- Animation frame rate (target 60fps)

---

## Future Enhancements

### Phase 2
- ✈️ Shared maps with friends
- 🗺️ Bucket list feature
- 📊 More detailed analytics (airlines, airports)
- 📷 Photo attachments to flights
- 🏆 Achievement badges (milestones)

### Phase 3
- 🔐 Optional cloud sync with authentication
- 📧 Email integration (auto-import from confirmations)
- 🌐 Multi-language support
- 📱 Native mobile apps
- 🎨 Customizable themes

---

## Open Questions & Decisions Needed

1. **Airport database source**: Which dataset to use? (OurAirports, OpenFlights)
2. **Continent count**: 5 or 7 continents? (Geographic vs political)
3. **Distance units**: Default to km or miles? User preference toggle?
4. **Flight path styling**: Single color or gradient by recency?
5. **Shared map limits**: Max participants per shared map?
6. **Data privacy**: How to handle shared map data? Expire links?

---

## Version History

- **v1.0** - Initial PRD (November 2025)
  - Core flight tracking functionality
  - 2D/3D visualization
  - Basic statistics
  - Local storage only

---

*This PRD is a living document and will be updated as the product evolves.*
# Notable Figures API Documentation

## Overview

The Notable Figures API provides endpoints to display Kurdish notable figures with their biographical information, images, and associations.

## Database Setup

First, run the SQL schema file to create the tables:
```bash
mysql -u your_user -p your_database < backend/NOTABLE_FIGURES_SCHEMA.sql
```

Or manually execute the SQL in `backend/NOTABLE_FIGURES_SCHEMA.sql`

## Image Setup

Place figure images in: `backend/public/images/notable-figures/`
- Format: `{image_slug}.jpg`
- Example: If `image_slug = "saladin"`, the file should be `saladin.jpg`

## API Endpoints

### 1. Get All Notable Figures (List/Grid Page)

**Endpoint:** `GET /notable-figures`

**Description:** Returns all notable figures for display in a grid/list view. Includes basic info for hover tooltips.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Example Figure",
    "century": "20th Century",
    "area_of_distinction": "Political Figure",
    "city_born": "Erbil",
    "image_slug": "example-figure",
    "image_url": "/assets/images/notable-figures/example-figure.jpg",
    "sort_order": 1
  },
  {
    "id": 2,
    "name": "Another Figure",
    "century": "19th Century",
    "area_of_distinction": "Poet",
    "city_born": "Sulaymaniyah",
    "image_slug": "another-figure",
    "image_url": "/assets/images/notable-figures/another-figure.jpg",
    "sort_order": 2
  }
]
```

**Frontend Usage:**
- Display images in a grid
- Show name on the image (bottom overlay)
- On hover: display `century`, `area_of_distinction`, and `city_born`
- On click: navigate to `/notable-figures/{id}`

---

### 2. Get Single Notable Figure (Detail Page)

**Endpoint:** `GET /notable-figures/:id`

**Description:** Returns full details of a single notable figure, including essay, education, and associated figures.

**Response:**
```json
{
  "id": 1,
  "name": "Example Figure",
  "century": "20th Century",
  "area_of_distinction": "Political Figure",
  "city_born": "Erbil",
  "essay": "Detailed essay about the figure...",
  "education": "University of Baghdad, PhD in Political Science",
  "image_slug": "example-figure",
  "image_url": "/assets/images/notable-figures/example-figure.jpg",
  "associated_figures": [
    {
      "id": 2,
      "name": "Associated Figure",
      "century": "20th Century",
      "area_of_distinction": "Writer",
      "city_born": "Dohuk",
      "image_slug": "associated-figure",
      "image_url": "/assets/images/notable-figures/associated-figure.jpg"
    }
  ]
}
```

**Notes:**
- `essay` may be `null` initially (to be written later)
- `associated_figures` is an array of related notable figures (can be empty `[]`)
- Associated figures can be clicked to navigate to their detail pages

---

## Example Usage

### JavaScript/Fetch Example

```javascript
// Get all figures for the grid page
fetch('http://localhost:3000/notable-figures')
  .then(res => res.json())
  .then(figures => {
    // Display figures in a grid
    figures.forEach(figure => {
      console.log(figure.name, figure.image_url);
    });
  });

// Get a specific figure's details
fetch('http://localhost:3000/notable-figures/1')
  .then(res => res.json())
  .then(figure => {
    console.log(figure.name);
    console.log(figure.essay);
    console.log(figure.associated_figures);
  });
```

### React Example Component Structure

```jsx
// NotableFiguresGrid.jsx
function NotableFiguresGrid() {
  const [figures, setFigures] = useState([]);
  
  useEffect(() => {
    fetch('/notable-figures')
      .then(res => res.json())
      .then(setFigures);
  }, []);

  return (
    <div className="figures-grid">
      {figures.map(figure => (
        <FigureCard 
          key={figure.id} 
          figure={figure}
          onHover={/* Show century, area, city */}
          onClick={() => navigate(`/notable-figures/${figure.id}`)}
        />
      ))}
    </div>
  );
}

// NotableFigureDetail.jsx
function NotableFigureDetail({ id }) {
  const [figure, setFigure] = useState(null);
  
  useEffect(() => {
    fetch(`/notable-figures/${id}`)
      .then(res => res.json())
      .then(setFigure);
  }, [id]);

  if (!figure) return <div>Loading...</div>;

  return (
    <div>
      <img src={figure.image_url} alt={figure.name} />
      <h1>{figure.name}</h1>
      <p>{figure.century} • {figure.area_of_distinction} • Born in {figure.city_born}</p>
      <div>{figure.education}</div>
      <div>{figure.essay || 'Essay coming soon...'}</div>
      
      {figure.associated_figures.length > 0 && (
        <div>
          <h2>Associated Figures</h2>
          {figure.associated_figures.map(assoc => (
            <Link key={assoc.id} to={`/notable-figures/${assoc.id}`}>
              {assoc.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Adding New Notable Figures

### 1. Add Image
Place the image file in `backend/public/images/notable-figures/`
Example: `backend/public/images/notable-figures/mahmud-barzani.jpg`

### 2. Insert into Database

```sql
INSERT INTO notable_figures (
    name, 
    century, 
    area_of_distinction, 
    city_born, 
    education, 
    image_slug, 
    sort_order
) VALUES (
    'Mahmud Barzani',
    '20th Century',
    'Political Figure',
    'Barzan',
    'Traditional Kurdish Education',
    'mahmud-barzani',
    1
);
```

### 3. Add Essay Later (when ready)

```sql
UPDATE notable_figures 
SET essay = 'Detailed essay text here...' 
WHERE id = 1;
```

### 4. Associate Figures (optional)

```sql
-- Link figure 1 with figure 2
INSERT INTO notable_figure_associations (figure_id, associated_figure_id)
VALUES (1, 2);

-- Note: Associations are one-directional. If you want bidirectional,
-- insert both directions:
INSERT INTO notable_figure_associations (figure_id, associated_figure_id)
VALUES (2, 1);
```

---

## Data Fields

### Notable Figures Table

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `id` | INT | Primary key | Auto |
| `name` | VARCHAR(255) | Full name of the figure | Yes |
| `century` | VARCHAR(100) | Century they lived in | No |
| `area_of_distinction` | VARCHAR(255) | Their area of notability | Yes |
| `city_born` | VARCHAR(255) | City of birth | No |
| `essay` | TEXT | Detailed essay | No (can add later) |
| `education` | TEXT | Education background | No |
| `image_slug` | VARCHAR(255) | Image filename (without .jpg) | Yes |
| `sort_order` | INT | Custom ordering | No (default 0) |

---

## Frontend Design Notes

### List/Grid Page
- Display figures in a responsive grid
- Show image with name overlay at bottom
- Hover tooltip/popup showing: century, area_of_distinction, city_born
- Click to navigate to detail page

### Detail Page
- Large image at top
- Name as heading
- Century, area, city as subtitle/metadata
- Education section
- Essay section (or "Coming soon" if null)
- Associated figures section (with links to their pages)
- Associated figures can be displayed as cards/mini-preview

---

## Error Handling

- **404**: Figure not found (when accessing `/notable-figures/:id` with invalid ID)
- **500**: Server error (database connection issues, etc.)

Error response format:
```json
{
  "error": "Notable figure not found"
}
```


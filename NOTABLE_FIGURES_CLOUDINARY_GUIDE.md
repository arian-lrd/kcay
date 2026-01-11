# Notable Figures - Cloudinary Setup Guide

This guide explains how to add and manage notable figures using Cloudinary.

## Folder Structure

Each notable figure has its own folder in Cloudinary:

```
notable-figures/
  ├── saladin/
  │   ├── saladin.jpg          (image file)
  │   └── saladin.json         (data file)
  ├── mustafa-barzani/
  │   ├── mustafa-barzani.jpg
  │   └── mustafa-barzani.json
  └── ahmed-khani/
      ├── ahmed-khani.jpg
      └── ahmed-khani.json
```

**Important:** The folder name, image filename, and JSON filename should all match (e.g., `saladin`).

## How to Add a New Notable Figure

### Step 1: Create a Folder in Cloudinary

1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Navigate to **Media Library**
3. Go to the `notable-figures` folder
4. Click **New Folder** and name it after the figure (e.g., `saladin`)

### Step 2: Upload the Image

1. Open the folder you just created (e.g., `notable-figures/saladin/`)
2. Click **Upload** and select the image file
3. **Rename the file** to match the folder name (e.g., `saladin.jpg`)
   - The filename should be: `{folder-name}.jpg` or `{folder-name}.png`

### Step 3: Create and Upload the JSON File

1. Create a JSON file with the following structure:

```json
{
  "name": "Saladin",
  "century": "12th Century",
  "area_of_distinction": "Military Leader",
  "city_born": "Tikrit",
  "education": "University of Baghdad",
  "essay": "Saladin was a Kurdish military leader who founded the Ayyubid dynasty. He is best known for his role in the Crusades...",
  "sort_order": 1,
  "associated_figures": ["mustafa-barzani", "ahmed-khani"]
}
```

2. Save it as `{folder-name}.json` (e.g., `saladin.json`)
3. In Cloudinary, go to the same folder (`notable-figures/saladin/`)
4. Click **Upload** and select the JSON file
5. **Important:** Make sure to set the **Resource Type** to **Raw** when uploading
   - In the upload dialog, look for "Resource Type" or "File Type" option
   - Select "Raw" instead of "Image"

### Step 4: Verify

After uploading both files, verify:
- ✅ Image file exists: `notable-figures/{name}/{name}.jpg`
- ✅ JSON file exists: `notable-figures/{name}/{name}.json`
- ✅ Both files have the same name (matching the folder name)

## JSON File Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Full name of the notable figure (English) |
| `name_kurdish` | string | No | Kurdish name (supports Arabic script for Sorani) |
| `century` | string | No | Century they lived in (e.g., "12th Century") |
| `area_of_distinction` | string | Yes | Their area of notability (e.g., "Military Leader", "Poet", "Writer") |
| `city_born` | string | No | City of birth |
| `education` | string | No | Education background |
| `essay` | string | No | Detailed essay/biography (can be very long) |
| `sort_order` | number | No | Display order (lower numbers appear first, default: 0) |
| `associated_figures` | array | No | Array of folder names of related figures (e.g., `["mustafa-barzani", "ahmed-khani"]`) |

## Example JSON File

```json
{
  "name": "Saladin",
  "name_kurdish": "صلاح الدین ایوبی",
  "century": "12th Century",
  "area_of_distinction": "Military Leader",
  "city_born": "Tikrit",
  "education": "University of Baghdad",
  "essay": "Saladin (1137-1193) was a Kurdish military leader who founded the Ayyubid dynasty. He is best known for his role in the Crusades, particularly for recapturing Jerusalem from the Crusaders in 1187.\n\nBorn in Tikrit, he rose to prominence as a military commander and eventually became the Sultan of Egypt and Syria. His chivalry and respect for his enemies earned him admiration even from his Crusader adversaries.\n\nThroughout his reign, Saladin demonstrated exceptional leadership qualities and strategic thinking that would influence military tactics for generations to come.",
  "sort_order": 1,
  "associated_figures": ["mustafa-barzani"]
}
```

## Essay Formatting - Paragraph Breaks

To create paragraph breaks in the essay, use `\n\n` (double newline) in your JSON:

- **Single newline** (`\n`): Creates a line break within the same paragraph
- **Double newline** (`\n\n`): Creates a new paragraph (blank line between paragraphs)

### Example with Paragraphs:

```json
{
  "essay": "This is the first paragraph of the essay.\n\nThis is the second paragraph, separated by a blank line.\n\nAnd this is the third paragraph."
}
```

**Important Notes:**
- Use `\n` (backslash + n) in JSON, not actual line breaks
- `\n\n` creates a paragraph break (blank line)
- Single `\n` creates a line break (no blank line)
- The website will automatically format these correctly when displaying

## Associated Figures

To link related figures:

1. In the JSON file, add an `associated_figures` array with the folder names:
```json
{
  "associated_figures": ["mustafa-barzani", "ahmed-khani"]
}
```

2. The folder names must match exactly (case-sensitive)
3. Associated figures will appear on the detail page of each figure

## Image Positioning (Optional)

Each notable figure's image can have custom positioning to control which part of the image is visible (e.g., to show the person's head instead of centering).

### How to Set Image Positioning in Cloudinary:

1. In Cloudinary, go to the image you want to adjust
2. Click on the image to open its details
3. Go to the **Context** tab (or **Metadata** tab)
4. Under **Custom Fields**, add:
   - **Field Name:** `object_position`
   - **Value:** The positioning value (e.g., `center top`, `center 10%`, `50% 20%`)

### Common Positioning Values:

- `center top` - Shows the top/head of the person (most common for portraits)
- `center 10%` - Shows top 10% of image (more head visible)
- `center 20%` - Shows top 20% of image
- `center center` - Centers the image
- `50% 30%` - Custom positioning (50% horizontal, 30% from top)

### Example:

If you want to show more of the person's head, set:
- **Field:** `object_position`
- **Value:** `center 10%`

**Note:** If no positioning is set in Cloudinary, the website will use the default CSS variable (`center top`).

## Enabling Cloudinary for Notable Figures

To use Cloudinary instead of the database:

1. Open `backend/.env`
2. Add this line:
```
USE_CLOUDINARY_FOR_NOTABLE_FIGURES=true
```

3. Restart the backend server

**Note:** If Cloudinary is not enabled, the system will use the database (existing behavior).

## Troubleshooting

### Image not showing
- ✅ Check that the image filename matches the folder name
- ✅ Check that the image is uploaded to the correct folder
- ✅ Verify the image file extension (.jpg, .png, etc.)

### JSON data not loading
- ✅ Check that the JSON file is uploaded as **Raw** resource type (not Image)
- ✅ Verify the JSON filename matches the folder name
- ✅ Check that the JSON file is valid (use a JSON validator)
- ✅ Ensure the JSON file is in the same folder as the image

### Figure not appearing in list
- ✅ Check that both image and JSON files exist
- ✅ Verify the folder structure: `notable-figures/{name}/`
- ✅ Check the `sort_order` field in JSON (lower numbers appear first)
- ✅ Look at backend terminal logs for error messages

## Tips

1. **Naming Convention:** Use lowercase with hyphens for folder names (e.g., `mustafa-barzani`, not `Mustafa Barzani`)
2. **Image Format:** JPG or PNG are recommended
3. **JSON Validation:** Always validate your JSON before uploading (use [jsonlint.com](https://jsonlint.com/))
4. **Essay Length:** The essay field can be as long as needed - no character limits!
5. **Sort Order:** Use `sort_order: 1` for most important figures, higher numbers for less important ones


# India Fuel Analysis Dashboard

## Run locally
1. Keep the folder structure intact.
2. Double-click `open-dashboard.bat` on Windows, or open `index.html` in a browser.
3. Internet access is required for the CDN-hosted Three.js/Chart.js/Lucide libraries used elsewhere in the dashboard.

## India map behavior
- The Overview page now shows an interactive stylized map of India instead of the 3D car showcase.
- Hover, click, or keyboard-focus a city marker to see litres and the number of records whose trip notes explicitly mention that city.
- Existing fuel records do not contain a dedicated city field. To avoid inventing city assignments, the map only attributes fuel when a city is explicitly named in trip notes; all other records remain unassigned.
- The original 500-record JSON is preserved at `data/500_fuel_records.json`.

CITY DATA NOTE
- New/edit fuel records include a required City / Location field.
- Cities without city-linked records show clearly labelled illustrative demo values (not real fuel measurements).
- Once you add records for a city, its marker shows the actual total from those records.

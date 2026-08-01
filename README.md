# NourishMe

A personalised nutrition & meal-finder web app, built for a "Good Health & Well-Being" hackathon demo.

## Run it

No build step, no dependencies. Just serve the folder statically, e.g.:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Or open `index.html` directly in a browser.

## What it does

- **Your Plan** — enter age, gender, nationality, weight/height (kg/lb, cm/ft-in), activity level, dietary restrictions, and goal. Computes a daily calorie target (Mifflin-St Jeor + activity factor + goal adjustment, with a safety floor) and a colour-coded protein/carbs/fat breakdown.
- **What Can I Cook?** — add ingredients you have on hand; matches them against a built-in database of 35 recipes across 11 cuisines, filtered by your dietary restrictions and hard-filtered to your nationality's cuisine, with goal-fit badges and "missing ingredient" notes.

## Data

Profile and ingredients are stored in `localStorage`, so they persist across sessions with no backend. First load seeds a sample profile and ingredient list. Use the **Reset** button in Your Plan to restore it at any time.

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
- **What Can I Cook?** — add ingredients you have on hand; matches them against a built-in database of 129 recipes across 22 cuisines, grouped by cuisine, filtered by your dietary restrictions and hard-filtered to your nationality's cuisine, with goal-fit badges and "missing ingredient" notes.
- **Snack Finder** — pick a calorie ceiling (under 100/200/300 kcal) and browse a built-in database of 18 snacks, filtered by your dietary restrictions and goal-boosted for higher protein when your goal is muscle/leaner. Includes a "Surprise me" random pick.
- **Today's Log** — add meals or snacks straight from their cards, or quick-add anything by name/calories/macros. Shows colour-coded progress bars for calories and each macro against your daily target, with a friendly (never shaming) status line. Resets automatically on a new day, plus a manual "Clear today" button.

## Data

Profile, ingredients, and today's log are stored in `localStorage`, so they persist across sessions with no backend. First load seeds a sample profile, ingredient list, and a couple of logged items. Use the **Reset** button in Your Plan to restore it at any time.

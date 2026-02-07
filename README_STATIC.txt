HumachLab Website (static export)

This folder is generated from the Django app: humachlab/website
Converted templates: website/templates/theme1/*.html

How to run:
  cd into this folder and run a local server, e.g.
    python -m http.server 8000
  then open:
    http://localhost:8000/index.html

Notes:
- Theme color switching is handled client-side (localStorage) via assets/js/hml_static_runtime.js
- Django forms are simulated client-side; they redirect to success.html/unsuccess.html
- Dynamic variables like {{ type }}, {{ id }}, {{ news_id }}, {{ search_query }} are filled from query params.

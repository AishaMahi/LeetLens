LeetMetric is a web application that visualizes your LeetCode problem-solving progress using interactive pie charts and displays submission statistics by difficulty levels (Easy, Medium, Hard). It fetches data from the LeetCode GraphQL API via a custom CORS proxy server.

--Features--
* Fetches and displays number of problems solved by difficulty, visualized as pie charts.
* Displays total submissions grouped by difficulty with easy-to-read cards.
* Validates LeetCode usernames before querying.
* Utilizes a deployed CORS Anywhere proxy server to bypass CORS restrictions on API requests.
*Responsive, clean design using CSS custom properties and conic-gradient for visual progress.

--Technologies--
* HTML, CSS, JavaScript
* LeetCode GraphQL API
* CORS Anywhere (Node.js proxy) hosted on Render or other platforms

--Setup Instructions--
Prerequisites
A running CORS anywhere proxy server accessible via a public URL (e.g., deployed on Render)
Modern web browser with JavaScript enabled

--Running Locally--
1- Clone or download the project files.

2- Update script.js with your deployed CORS proxy URL on Render:
const proxyUrl = "https://your-cors-anywhere-url.onrender.com/";

3- Open index.html in your browser.

4- Enter a valid LeetCode username and click Search to view stats.

--Usage--
* Enter a LeetCode username containing alphanumeric characters, underscores, or hyphens (max 15 chars).
* View your problem-solving progress in real time.
* Pie charts show solved problems, and cards show total submission counts per difficulty.

--File Overview--
index.html- Main HTML structure and UI layout
style.css- Styling with responsive design and charts
script.js- Implements fetch calls, data handling, and UI updates

Notes
* The app distinguishes problems solved (unique accepted solutions) from total submissions (including multiple attempts).
* Network requests must pass through your CORS proxy due to browser security policies.
* If API returns errors or username is invalid, appropriate messages are displayed.
* Ensure you keep your CORS proxy URL updated and publicly accessible.

License
This project is licensed under the MIT License.
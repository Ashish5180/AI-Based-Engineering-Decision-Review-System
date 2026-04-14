# 🛡️ ArchGuard — Detailed Project Documentation (Hinglish)

ArchGuard ek advanced engineering analysis tool hai jo software architecture reviews ko automate karta hai. Yeh document is project ke har ek component ko gehraai (detail) mein samjhata hai.

---

## 🎨 1. Frontend Architecture (Next.js 15)

Frontend ko **Next.js 15** ke latest features ka use karke banaya gaya hai taaki user experience seamless aur premium lage.

### Key Technical Aspects:
*   **App Router**: Humne purane `pages/` router ki jagah modern `app/` router use kiya hai. Isse nested layouts aur dynamic routing handle karna bahut efficient ho gaya hai.
*   **React Server Components (RSC)**: Website ka heavy part server pe render hota hai, isliye browser pe load kam parta hai aur page fast load hota hai.
*   **Vanilla CSS Glassmorphism**: Kisi UI library (jaise Tailwind ya Bootstrap) pe depend rehne ke bajaye, humne custom Vanilla CSS use ki hai.
    *   **Kyon?**: Taaki hum **Glassmorphism** (translucent backgrounds), grain textures aur high-end scroll animations ko bina kisi restriction ke implement kar sakein.
*   **Responsive Design**: CSS Variables aur Flexbox/Grid ka use karke isse mobile aur desktop dono ke liye optimize kiya gaya hai.

---

## ⚙️ 2. Backend Architecture (Go 1.24)

Backend ko "Clean Architecture" principles pe build kiya gaya hai, jo scalable aur maintainable hai.

### Project Structure:
*   **`main.go`**: Application ka entry point.
*   **`internal/server/`**: Yahan HTTP server initialize hota hai aur routes ko handlers ke saath bind kiya jata hai.
*   **`internal/handler/`**: Saara request-handling logic yahan milage (e.g., Decisions handle karna, Patterns fetch karna).
*   **`internal/middleware/`**: Har request backend tak pahunchne se pehle in filters se guzarti hai:
    *   **Logger**: Har request ka method, path aur time track karta hai.
    *   **Metrics**: API performance ko monitor karne ke liye.
    *   **CORS**: Frontend aur Backend ke beech safe communication ensure karne ke liye.

### Database Logic (MongoDB):
Humne **MongoDB** choose kiya hai kyunki engineering decisions ka data dynamic hota hai.
*   **Decisions Collection**: Isme project title, architecture text, tech stack aur AI dwara generate ki gayi feedback report save hoti hai.
*   **Patterns Collection**: Isme industry-standard architectural solutions store hote hain.

---

## 🧠 3. AI Analysis Engine (OpenAI GPT-4o-mini)

Yeh ArchGuard ka "Dimaag" hai. Jab bhi aap koi architectural decision submit karte hain, Backend yeh steps follow karta hai:

1.  **Prompt Building**: Aapka input (Architecture description, API design, Tech choices) ek structured prompt mein convert hota hai.
2.  **AI Reasoning**: GPT-4o-mini is data ko analyze karta hai aur potential "Anti-patterns" ya "Security Risks" dhundta hai.
3.  **Structured JSON Response**: AI hume direct text nahi deta, balki ek valid JSON deta hai jisme yeh fields hote hain:
    *   **Risk Level**: Low, Medium, High, ya Critical.
    *   **Scalability Score**: Aapka design future growth handle kar payega ya nahi.
    *   **Insights**: конкретные technical points jahan improvement ki zaroorat hai.
    *   **Action Plan**: Immediate fix aur long-term suggestions.

---

## 📡 4. API Endpoints Table

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend server status check karne ke liye. |
| `POST` | `/api/decisions` | Naya decision review create karne ke liye. |
| `GET` | `/api/decisions` | Saare purane reviews fetch karne ke liye. |
| `GET` | `/api/decisions/{id}` | Kisi specific review ki detail report ke liye. |
| `GET` | `/api/patterns` | Architectural patterns ki library list karne ke liye. |
| `POST` | `/api/patterns/tailor` | Kisi pattern ko apne tech stack ke hisaab se customize karne ke liye. |

---

## 🔑 5. Environment Variables (.env)

App ko chalane ke liye aapko yeh variables Backend mein set karne honge:

*   **`PORT`**: Jis port pe backend chalega (Default: 8080).
*   **`MONGO_URI`**: Aapke MongoDB instance ka connection string.
*   **`OPENAI_API_KEY`**: OpenAI API access karne ke liye secret key.
*   **`LOG_LEVEL`**: Debugging info control karne ke liye (info, debug, error).

---

## 🛠️ 6. Setup aur Development Flow

1.  **Github Repo Clone karein**.
2.  **Backend Dependencies**: `go mod tidy` run karein.
3.  **Frontend Dependencies**: `npm install` karein.
4.  **Local Test**: Pehle backend start karein (`go run main.go`), phir frontend (`npm run dev`).

Yeh system isliye powerful hai kyunki yeh **Review Cycle** ko weeks se hours mein le aata hai! 🚀

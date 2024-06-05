## CI/CD-Pipeline
### Einführung in CI/CD
Continuous Integration (CI) und Continuous Deployment (CD) sind zwei wichtige Bestandteile der modernen Softwareentwicklung. CI/CD ist ein Ansatz, bei dem Entwickler regelmäßig Code in einem gemeinsamen Repository zusammenführen und automatisierte Tests durchführen. Dieser Prozess ermöglicht es Teams, Codeänderungen schnell und sicher zu integrieren und bereitzustellen. In diesem Artikel werden wir uns genauer ansehen, was CI/CD ist, warum es wichtig ist und wie es in der Praxis funktioniert.
In unserem Projekt, das aus einem Express-Backend (`server.js`) und einer React-Anwendung im Frontend besteht, ermöglicht die CI/CD-Pipeline eine effiziente und fehlerfreie Entwicklung und Bereitstellung. Bei jeder Codeänderung werden Tests automatisch durchgeführt, und wenn diese bestanden werden, können Build-Prozesse, wie z.B. das Erstellen von Docker-Images oder das Bereitstellen von Anwendungen, automatisch ausgeführt werden. Dieser Prozess ermöglicht 
es uns, dass Code sicher in die Produktion übertragen werden kann.
### Bedeutung des Testings in CI/CD
Testing ist ein zentraler Bestandteil der CI/CD-Pipeline. Es gewährleistet, dass Fehler frühzeitig erkannt werden und die Software mit vertrauenswürdiger Qualität ausgeliefert wird. Tests können in verschiedene Typen unterteilt werden:
- Unit-Tests: Testen einzelne Komponenten oder Funktionen der Software.
- Integrationstests: Testen, ob verschiedene Komponenten der Software korrekt zusammenarbeiten. Überprüfen der Interaktionen zwischen Komponenten oder Systemen.
- End-to-End-Tests: Testen die gesamte Anwendung von Anfang bis Ende. Simulation der Benutzerinteraktionen mit der Anwendung unter realen Bedingungen.
- Performance Tests: Testen die Leistung der Anwendung unter verschiedenen Bedingungen.
### Unit Tests
Unit Tests sind speziell dafür konzipiert, die kleinsten testbaren Teile einer Anwendung isoliert von anderen zu testen. Sie sind schnell ausführbar und helfen Entwicklern, sofortiges Feedback über die Funktionalität des Codes zu erhalten. Im Kontext unseres Projekts:
- Backend (Node.js/Express): Unit Tests können eingesetzt werden, um sicherzustellen, dass die API-Endpunkte wie erwartet funktionieren. Werkzeuge wie Jest und Supertest bieten eine effiziente Lösung für das Schreiben von Tests, die HTTP-Anfragen simulieren und die Antworten validieren.
- Frontend (React): Unit Tests überprüfen die korrekte Anzeige von Komponenten und die ordnungsgemäße Handhabung von Zuständen und Ereignissen. Bibliotheken wie React Testing Library erlauben es, React-Komponenten in einer vereinfachten Umgebung zu rendern und zu testen, wobei das Verhalten aus Benutzersicht im Vordergrund steht.
#### Backend
Wir installieren uns Jest und Supertest, um unsere API-Endpunkte zu testen.
```
npm install --save-dev jest supertest
```
Danach schreiben wir uns einen Test für unseren Express-Server und speziell für unsere einzige Route (/api). Dazu erstellen wir eine Datei `server.test.js` im Verzeichnis `backend/__tests__` und fügen folgenden Code ein:
```
const request = require('supertest');
const app = require('../server'); 

// Test für GET /api
describe('GET /api', () => {
  it('should respond with a message', async () => {
    const response = await request(app).get('/api');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Hello from the backend');
  });
});
```
Achtung: Damit wir darauf zugreifen können, müssen wir in unserer `server.js`-Datei den Server exportieren:
```
module.exports = app;
```
Nun müssen wir noch den jest Befehl in unserem `package.json` hinzufügen:
```
"scripts": {
  "test": "jest"
}
```
Jetzt können wir unsere Tests ausführen:
```
npm test
```
#### Frontend
Das Frontend testen wir an dieser Stelle erstmal nicht. Hierfür gibt es spezielle Bibliotheken wie React Testing Library, die es uns ermöglichen, React-Komponenten zu rendern und zu testen.
### CI/CD-Pipeline
Wir verwenden für die CI/CD-Pipeline Github Actions. Dazu müssen wir erstmal eine Github-Worklfow-Datei im Wurzelverzeichnis unter `.github/workflows` erstellen. Diese Datei nennen wir `ci-cd-pipeline.yml` und fügen folgenden Code ein:
```
name: CI/CD Pipeline
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm install
    - name: Run tests
      run: npm test
```
Erklärung des Workflows:
- `name`: Name des Workflows
- `on`: Event, das den Workflow auslöst (in diesem Fall ein Push-Event)
- `jobs`: Eine Liste von Jobs, die in diesem Workflow ausgeführt werden
- `build`: Name des Jobs
- `runs-on`: Die Art des Runners, auf dem der Job ausgeführt wird (in diesem Fall ein Ubuntu-Latest-Runner)
- `steps`: Eine Liste von Schritten, die in diesem Job ausgeführt werden
- `uses`: Eine Aktion, die in diesem Schritt verwendet wird
- `with`: Parameter, die an die Aktion übergeben werden
- `run`: Ein Shell-Befehl, der in diesem Schritt ausgeführt wird


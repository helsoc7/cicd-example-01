## Vorbereitungen
### Installationen
Installiere bitte kubectl, lens und helm mit choco.
Wir müssen erstmal in unserem Frontend gehen und die React anpassen. Hier müssen wir nämlich die URL des Backends anpassen. Das bedeutet, dass wir in die App.js gehen und das wie folgt ändern:
```javascript
import React, { useEffect, useState } from 'react';

function App() {
    const [backendMessage, setBackendMessage] = useState('');
    useEffect(() => {
    fetch('https://simple-application.de/api')
    .then(response => response.json())
    .then(data => setBackendMessage(data.message))
    .catch(err => console.error('Error: ', err));
    }, []);
    return (
        <div>
            <p>Message from Backend: {backendMessage}</p>
        </div>
    );
}
export default App;
```
## Manifest Dateien schreiben
Wir müssen nun die Manifest Dateien für Kubernetes schreiben. Hierfür erstellen wir einen Ordner `k8s` und darin die Dateien `frontend-deployment.yaml`, `frontend-service.yaml`, `backend-deployment.yaml`, `backend-service.yaml` und `ingress.yaml`.
### frontend-deployment.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: frontend
  name: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - image: helenhaveloh/simple-application-frontend:1.0.1
          imagePullPolicy: IfNotPresent
          resources:
            requests:
              cpu: 100m
              memory: 200Mi
            limits:
              cpu: 200m
              memory: 300Mi          
          name: frontend
          ports:
            - containerPort: 80
              protocol: TCP
      restartPolicy: Always
```
- Dieses Manifest definiert eine Bereitstellung für die Frontend-Anwendung.
- Es verwendet das apps/v1 API und den Deployment-Typ.
- Die Metadaten enthalten Labels, die zur Identifizierung der Bereitstellung verwendet werden.
- Die replicas-Eigenschaft gibt an, wie viele Replikate der Anwendung erstellt werden sollen (in diesem Fall 1).
- Der selector definiert die Labels, die verwendet werden, um die Pods auszuwählen, die von dieser Bereitstellung verwaltet werden sollen.
- Das template-Objekt definiert die Pod-Vorlage, die für die Bereitstellung verwendet wird.
- In der Pod-Vorlage wird ein Container definiert, der das Frontend-Image enthält.
- Es werden Ressourcenbeschränkungen für den Container festgelegt, wie z.B. CPU- und Speicheranforderungen und -limits.
- Der Container wird auf Port 80 ausgeführt.
- Die restartPolicy ist auf "Always" gesetzt, was bedeutet, dass der Container automatisch neu gestartet wird, wenn er beendet wird.
### frontend-service.yaml
```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend  
spec:
  selector: 
    app: frontend
  ports:
    - port: 80
      targetPort: 80
```
- Dieses Manifest definiert einen Dienst für die Frontend-Anwendung.
- Es verwendet das v1 API und den Service-Typ.
- Die Metadaten enthalten den Namen des Dienstes.
- Der selector definiert die Labels, die verwendet werden, um die Pods auszuwählen, die von diesem Dienst abgedeckt werden sollen.
- Der Dienst wird auf Port 80 konfiguriert und leitet den Datenverkehr an den Zielport 80 weiter.
### backend-deployment.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: backend
  name: backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - image: helenhaveloh/backend-docker-compose:latest
          imagePullPolicy: IfNotPresent
          resources:
            requests:
              cpu: 100m
              memory: 100Mi
            limits:
              cpu: 100m
              memory: 100Mi          
          name: backend
          ports:
            - containerPort: 4000
              protocol: TCP
      restartPolicy: Always
```
- Dieses Manifest definiert eine Bereitstellung für die Backend-Anwendung.
- Es verwendet das apps/v1 API und den Deployment-Typ.
- Die Metadaten enthalten Labels, die zur Identifizierung der Bereitstellung verwendet werden.
- Die replicas-Eigenschaft gibt an, wie viele Replikate der Anwendung erstellt werden sollen (in diesem Fall 1).
- Der selector definiert die Labels, die verwendet werden, um die Pods auszuwählen, die von dieser Bereitstellung verwaltet werden sollen.
- Das template-Objekt definiert die Pod-Vorlage, die für die Bereitstellung verwendet wird.
- In der Pod-Vorlage wird ein Container definiert, der das Backend-Image enthält.
- Es werden Ressourcenbeschränkungen für den Container festgelegt, wie z.B. CPU- und Speicheranforderungen und -limits.
- Der Container wird auf Port 4000 ausgeführt.
- Die restartPolicy ist auf "Always" gesetzt, was bedeutet, dass der Container automatisch neu gestartet wird, wenn er beendet wird.
### backend-service.yaml
```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  type: ClusterIP
  selector:
    app: backend
  ports:
  - port: 4000
    targetPort: 4000
```
- Dieses Manifest definiert einen Dienst für die Backend-Anwendung.
- Es verwendet das v1 API und den Service-Typ.
- Die Metadaten enthalten den Namen des Dienstes.
- Der selector definiert die Labels, die verwendet werden, um die Pods auszuwählen, die von diesem Dienst abgedeckt werden sollen.
- Der Dienst wird auf Port 4000 konfiguriert und leitet den Datenverkehr an den Zielport 4000 weiter.
### ingress.yaml
tbd
## Docker Desktop Kubernetes aktivieren
Prüfen ob das lokale Cluster läuft:
```bash
kubectl get pods
```
Sollte das Cluster nicht laufen, kann es über das Docker Desktop Menü aktiviert werden.
## TLS Zertifikate erstellen
```bash
mkcert simple-application.de localhost 127.0.0.1 ::1
```
Die Zertifikate werden in den Dateien `simple-application.de.pem` und `simple-application.de-key.pem` gespeichert.
## Eintrag in der Hostdatei
```bash
sudo nano /etc/hosts
```
Folgende Zeile hinzufügen:
```
127.0.0.1 simple-application.de
```
(in Windows unter c:\Windows\System32\Drivers\etc\hosts mit Admin-Rechten bearbeiten)
## TLS Zertifikate in Kubernetes Secret speichern
```bash

## NGINX-INGRESS im Cluster installieren
```bash
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```
## Ingress konfigurieren
Wir fügen nun unseren Host in der Ingress-Datei hinzu:
```bash
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress
spec:
  tls:
    - hosts:
        - simple-application.de
      secretName: simple-application.de
  ingressClassName: nginx
  rules:
    - host: simple-application.de
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend
                port:
                  number: 80
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: backend
                port:
                  number: 4000
```
Dieses YAML-Manifest definiert ein Ingress-Objekt für eine Kubernetes-Anwendung. Ein Ingress-Objekt ermöglicht den Zugriff von außen auf die Dienste innerhalb des Kubernetes-Clusters über HTTP/HTTPS. Hier sind die Schlüsselkomponenten dieses Manifests:

- apiVersion: networking.k8s.io/v1: Gibt die API-Version an, die für dieses Objekt verwendet wird. In diesem Fall ist es die Version 1 der Networking-API-Gruppe.
- kind: Ingress: Zeigt an, dass dieses Dokument ein Ingress-Objekt definiert.
- metadata: Enthält Metadaten über das Ingress-Objekt, wie z.B. den Namen ingress.
- spec: Definiert die gewünschte Zustandskonfiguration des Ingress-Objekts.
- tls: Konfiguriert die TLS-Einstellungen für das Ingress, um HTTPS-Verkehr zu ermöglichen. Es definiert eine Liste von Hosts (simple-application.de) und den Namen des Secrets (simple-application.de), das das TLS-Zertifikat und den privaten Schlüssel enthält.
- ingressClassName: Gibt die Klasse des Ingress-Controllers an, der dieses Ingress-Objekt verwalten soll. In diesem Fall ist es nginx, was bedeutet, dass ein NGINX Ingress Controller verwendet wird.
- rules: Definiert die Regeln, wie eingehender Verkehr an Dienste weitergeleitet wird.
- host: Gibt den Hostnamen an (simple-application.de), für den diese Regel gilt.
- http: Definiert die Regeln für den HTTP-Verkehr.
- paths: Eine Liste von Pfaden, die dieser Regel entsprechen. Jeder Pfad hat folgende Eigenschaften:
- path: Der URL-Pfad, für den diese Regel gilt. Es gibt zwei Pfade definiert: / und /api.
- pathType: Gibt den Typ des Pfades an. Prefix bedeutet, dass alle Anfragen, die mit dem angegebenen Pfad beginnen, dieser Regel entsprechen.
- backend: Definiert den Backend-Dienst, an den der Verkehr weitergeleitet wird.
- service: Gibt den Namen des Dienstes (frontend für den Pfad / und backend für den Pfad /api) und den Port (80 für den Frontend-Dienst und 4000 für den Backend-Dienst) an, an den der Verkehr weitergeleitet wird.
Zusammengefasst leitet dieses Ingress-Objekt alle HTTP-Anfragen an simple-application.de an den frontend-Dienst auf Port 80 weiter, außer Anfragen, die mit /api beginnen. Diese werden an den backend-Dienst auf Port 4000 weitergeleitet. Es konfiguriert auch HTTPS für simple-application.de durch Verwendung eines TLS-Zertifikats, das im Secret simple-application.de gespeichert ist.


## Anwendung im Cluster deployen
```bash
cd k8s/
kubectl apply -f . --recursive
```

Danach prüfen ob die Pods laufen:
```bash
kubectl get pods
```

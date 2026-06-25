# Calculadora de Impuestos - Tarea Final

## Estructura del proyecto

```
tax-calculator/
├── public/
│   └── index.html          # Frontend de la calculadora
├── spec/
│   ├── support/
│   │   └── jasmine.json    # Configuracion de Jasmine
│   └── taxCalculatorSpec.js # Pruebas unitarias
├── tekton/
│   ├── tasks/
│   │   ├── git-clone.yaml
│   │   ├── run-tests.yaml
│   │   ├── build-docker.yaml
│   │   └── deploy-ibm-cloud.yaml
│   └── pipeline/
│       ├── pipeline.yaml
│       └── pipeline-run.yaml
├── taxCalculator.js        # Logica de calculo de impuestos
├── server.js               # Servidor Express
├── package.json
├── Dockerfile
└── .dockerignore
```

## 1. Ejecutar pruebas unitarias con Jasmine

```bash
npm install
npm test
```

Resultado esperado: 10 specs, 0 fallos.

## 2. Crear Dockerfile

El Dockerfile ya esta creado. Usa `node:18-alpine` como imagen base.

## 3. Construir imagen de Docker

```bash
docker build -t tax-calculator .
```

## 4. Desplegar y probar en contenedor Docker

```bash
docker run -d -p 3000:3000 --name tax-calc tax-calculator
```

Verificar en: http://localhost:3000

Probar la API:
```bash
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000, "taxRate": 16}'
```

Detener el contenedor:
```bash
docker stop tax-calc
docker rm tax-calc
```

## 5. Etiquetar y subir al IBM Cloud Registry

### Pre-requisitos:
1. Crear cuenta en IBM Cloud: https://cloud.ibm.com/registration
2. Instalar CLI de IBM Cloud: https://cloud.ibm.com/docs/cli
3. Instalar plugin de container registry:
```bash
ibmcloud plugin install container-registry
```

### Pasos:
```bash
# Login a IBM Cloud
ibmcloud login

# Seleccionar region
ibmcloud target -r us-south

# Crear namespace en Container Registry
ibmcloud cr namespace-add tax-calculator

# Login al registry
ibmcloud cr login

# Etiquetar la imagen
docker tag tax-calculator:latest us.icr.io/tax-calculator/tax-calculator:latest

# Subir la imagen
docker push us.icr.io/tax-calculator/tax-calculator:latest

# Verificar
ibmcloud cr images
```

## 6. Desplegar en IBM Cloud

```bash
# Instalar Kubernetes Service
ibmcloud plugin install container-service

# Crear cluster (o usar un cluster existente)
ibmcloud ks cluster create free-cluster tax-calc-cluster

# Configurar kubectl
ibmcloud ks cluster config --cluster tax-calc-cluster

# Crear deployment
kubectl create deployment tax-calculator --image=us.icr.io/tax-calculator/tax-calculator:latest

# Exponer el servicio
kubectl expose deployment tax-calculator --type=NodePort --port=3000

# Ver el pod
kubectl get pods
kubectl get services
```

## 7-9. Pipeline de Tekton

### Instalar Tekton en el cluster:
```bash
# Instalar Tekton
kubectl apply -f https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml

# Instalar Tekton Dashboard (opcional)
kubectl apply -f https://storage.googleapis.com/tekton-releases/dashboard/latest/release.yaml
```

### Aplicar tareas y pipeline:
```bash
# Aplicar tareas
kubectl apply -f tekton/tasks/

# Aplicar pipeline
kubectl apply -f tekton/pipeline/
```

### Ejecutar el pipeline:
```bash
kubectl apply -f tekton/pipeline/pipeline-run.yaml
```

### Ver progreso:
```bash
# Ver pipeline runs
kubectl get pipelineruns

# Ver logs
kubectl logs -l tekton.dev/pipelineRun=tax-calculator-run -f
```

## 10. Desplegar imagen construida por el pipeline

El pipeline ya incluye la tarea `deploy-ibm-cloud` que despliega automaticamente la imagen despues de construirla.

Para verificar el despliegue:
```bash
kubectl get pods
kubectl get services
```

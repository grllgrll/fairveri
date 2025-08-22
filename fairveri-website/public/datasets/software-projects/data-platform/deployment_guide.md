# FAIRDataHub - Deployment Guide

## 🚀 Quick Start

This guide will help you deploy FAIRDataHub in various environments, from local development to production-ready Kubernetes clusters.

## 📋 Prerequisites

### System Requirements
- **CPU**: Minimum 4 cores, Recommended 8+ cores
- **RAM**: Minimum 8GB, Recommended 16GB+
- **Storage**: 50GB+ for base installation
- **Network**: Stable internet connection for container pulls

### Software Dependencies
- Docker Engine 20.10+
- Docker Compose 2.0+
- Kubernetes 1.21+ (for production)
- kubectl (for Kubernetes deployments)
- Helm 3.0+ (optional, for Kubernetes package management)

## 🏠 Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/fairdatahub/platform.git
cd platform
```

### 2. Environment Configuration
```bash
# Copy example environment file
cp .env.example .env

# Edit configuration
nano .env
```

### 3. Docker Compose Deployment
```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Initial Setup
```bash
# Run database migrations
docker-compose exec api npm run migrate

# Create admin user
docker-compose exec api npm run seed:admin

# Generate API keys
docker-compose exec api npm run generate:keys
```

### Access Points
- **Web Interface**: http://localhost:3000
- **API Documentation**: http://localhost:8080/docs
- **Admin Panel**: http://localhost:3000/admin

## 🏢 Production Deployment

### Option 1: Docker Swarm

#### 1. Initialize Swarm
```bash
# On manager node
docker swarm init --advertise-addr <manager-ip>

# Join worker nodes
docker swarm join --token <token> <manager-ip>:2377
```

#### 2. Deploy Stack
```bash
# Deploy production stack
docker stack deploy -c docker-stack.yml fairdatahub

# Monitor deployment
docker stack services fairdatahub
```

### Option 2: Kubernetes

#### 1. Create Namespace
```bash
kubectl create namespace fairdatahub
```

#### 2. Configure Secrets
```bash
# Create secrets for sensitive data
kubectl create secret generic db-credentials \
  --from-literal=username=postgres \
  --from-literal=password=yourpassword \
  -n fairdatahub

kubectl create secret generic jwt-secrets \
  --from-literal=access-token-secret=your-access-secret \
  --from-literal=refresh-token-secret=your-refresh-secret \
  -n fairdatahub
```

#### 3. Deploy with Helm
```bash
# Add Helm repository
helm repo add fairdatahub https://charts.fairdatahub.org
helm repo update

# Install with custom values
helm install fairdatahub fairdatahub/platform \
  --namespace fairdatahub \
  --values production-values.yaml
```

#### 4. Manual Kubernetes Deployment
```bash
# Apply all manifests
kubectl apply -f k8s/ -n fairdatahub

# Check deployment status
kubectl get pods -n fairdatahub
kubectl get services -n fairdatahub
```

## 🔧 Configuration Options

### Environment Variables

#### Database Configuration
```bash
# PostgreSQL
DB_HOST=postgres
DB_PORT=5432
DB_NAME=fairdatahub
DB_USER=postgres
DB_PASSWORD=yourpassword

# MongoDB
MONGO_URI=mongodb://mongo:27017/fairdatahub

# Redis
REDIS_URL=redis://redis:6379
```

#### Authentication
```bash
# JWT Configuration
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

#### Storage Configuration
```bash
# Object Storage (S3-compatible)
S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=fairdatahub
S3_REGION=us-east-1

# Local File Storage
UPLOAD_PATH=/app/uploads
MAX_FILE_SIZE=1073741824  # 1GB
```

#### Search Engine
```bash
# Elasticsearch
ELASTICSEARCH_URL=http://elasticsearch:9200
ELASTICSEARCH_INDEX=fairdatahub
```

### Production Values (Helm)
```yaml
# production-values.yaml
global:
  domain: fairdatahub.org
  tls:
    enabled: true
    secretName: fairdatahub-tls

frontend:
  replicaCount: 3
  image:
    tag: "v1.0.0"
  ingress:
    enabled: true
    className: nginx
    hosts:
      - host: fairdatahub.org
        paths:
          - path: /
            pathType: Prefix

api:
  replicaCount: 3
  image:
    tag: "v1.0.0"
  resources:
    requests:
      memory: "512Mi"
      cpu: "500m"
    limits:
      memory: "1Gi"
      cpu: "1000m"

postgresql:
  enabled: true
  auth:
    postgresPassword: "production-password"
  primary:
    persistence:
      size: 100Gi

mongodb:
  enabled: true
  auth:
    enabled: true
    rootPassword: "production-password"
  persistence:
    size: 50Gi

redis:
  enabled: true
  auth:
    enabled: true
    password: "production-password"

elasticsearch:
  enabled: true
  replicas: 3
  volumeClaimTemplate:
    resources:
      requests:
        storage: 100Gi
```

## 🔐 SSL/TLS Configuration

### Certificate Management
```bash
# Using cert-manager for automatic certificates
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set installCRDs=true

# Apply cluster issuer
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@fairdatahub.org
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

### Ingress Configuration
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: fairdatahub-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - fairdatahub.org
    - api.fairdatahub.org
    secretName: fairdatahub-tls
  rules:
  - host: fairdatahub.org
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend
            port:
              number: 3000
  - host: api.fairdatahub.org
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api
            port:
              number: 8080
```

## 📊 Monitoring Setup

### Prometheus & Grafana
```bash
# Add Prometheus community Helm repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install Prometheus stack
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --values monitoring-values.yaml
```

### Monitoring Values
```yaml
# monitoring-values.yaml
grafana:
  adminPassword: admin-password
  ingress:
    enabled: true
    hosts:
      - monitoring.fairdatahub.org

prometheus:
  prometheusSpec:
    storageSpec:
      volumeClaimTemplate:
        spec:
          storageClassName: fast-ssd
          resources:
            requests:
              storage: 50Gi

alertmanager:
  config:
    global:
      smtp_smarthost: 'smtp.gmail.com:587'
      smtp_from: 'alerts@fairdatahub.org'
    route:
      group_by: ['alertname']
      group_wait: 10s
      group_interval: 10s
      repeat_interval: 1h
      receiver: 'web.hook'
    receivers:
    - name: 'web.hook'
      email_configs:
      - to: 'admin@fairdatahub.org'
        subject: 'FAIRDataHub Alert'
```

## 🔄 Backup & Recovery

### Database Backup Script
```bash
#!/bin/bash
# backup.sh

# PostgreSQL Backup
kubectl exec -n fairdatahub postgresql-0 -- pg_dumpall -U postgres > backup-$(date +%Y%m%d).sql

# MongoDB Backup
kubectl exec -n fairdatahub mongodb-0 -- mongodump --archive > mongodb-backup-$(date +%Y%m%d).archive

# Upload to S3
aws s3 cp backup-$(date +%Y%m%d).sql s3://fairdatahub-backups/
aws s3 cp mongodb-backup-$(date +%Y%m%d).archive s3://fairdatahub-backups/
```

### Automated Backup CronJob
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: database-backup
  namespace: fairdatahub
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:13
            command:
            - /bin/bash
            - -c
            - |
              pg_dump -h postgresql -U postgres fairdatahub > /backup/backup-$(date +%Y%m%d).sql
              aws s3 cp /backup/backup-$(date +%Y%m%d).sql s3://fairdatahub-backups/
            env:
            - name: PGPASSWORD
              valueFrom:
                secretKeyRef:
                  name: db-credentials
                  key: password
            volumeMounts:
            - name: backup-storage
              mountPath: /backup
          volumes:
          - name: backup-storage
            emptyDir: {}
          restartPolicy: OnFailure
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Pod Not Starting
```bash
# Check pod status
kubectl describe pod <pod-name> -n fairdatahub

# Check logs
kubectl logs <pod-name> -n fairdatahub --previous
```

#### 2. Service Connectivity Issues
```bash
# Test service connectivity
kubectl run test-pod --image=busybox --rm -it -- sh
nslookup api.fairdatahub.svc.cluster.local
```

#### 3. Database Connection Problems
```bash
# Check database pod
kubectl logs postgresql-0 -n fairdatahub

# Test connection
kubectl exec -it postgresql-0 -n fairdatahub -- psql -U postgres -d fairdatahub
```

#### 4. Storage Issues
```bash
# Check persistent volumes
kubectl get pv,pvc -n fairdatahub

# Check storage class
kubectl get storageclass
```

### Health Checks

#### System Health Endpoints
- **API Health**: `GET /health`
- **Database Health**: `GET /health/db`
- **Storage Health**: `GET /health/storage`
- **Search Health**: `GET /health/search`

#### Monitoring Commands
```bash
# Check all services
kubectl get all -n fairdatahub

# Monitor resource usage
kubectl top pods -n fairdatahub
kubectl top nodes

# Check events
kubectl get events -n fairdatahub --sort-by=.metadata.creationTimestamp
```

## 📞 Support

### Getting Help
- **Documentation**: https://docs.fairdatahub.org
- **Community Forum**: https://community.fairdatahub.org
- **GitHub Issues**: https://github.com/fairdatahub/platform/issues
- **Email Support**: support@fairdatahub.org

### Emergency Contacts
- **Technical Lead**: tech-lead@fairdatahub.org
- **DevOps Team**: devops@fairdatahub.org
- **Security Team**: security@fairdatahub.org

---

This deployment guide covers the essential steps for setting up FAIRDataHub in various environments. For specific customizations or enterprise deployments, please contact our support team.
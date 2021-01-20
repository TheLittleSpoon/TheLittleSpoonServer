apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: spoon-backend
  name: spoon-backend
  namespace: spoon
spec:
  selector:
    matchLabels:
      app: spoon-backend
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: spoon-backend
    spec:
      containers:
      - image: gcr.io/GOOGLE_CLOUD_PROJECT/spoon-be:COMMIT_SHA
        name: projector-be
        ports:
        - containerPort: 3000
          protocol: TCP
        resources:
          requests:
              memory: "50Mi"
              cpu: "50m"
          limits:
              memory: "250Mi"
              cpu: "250m"
